import { runCodeInDocker } from "./dockerExecutor.js";

const LANGUAGE_CONFIG = {
    javascript: { language: "javascript" },
    python: { language: "python" },
    java: { language: "java" },
};

/**
 * Generates a wrapper script for the specific language.
 */
function getDriver(language, userCode, functionName, testCases) {
    const tcJson = JSON.stringify(testCases);

    switch (language.toLowerCase()) {
        case "javascript":
            return `
${userCode}
const testCases = ${tcJson};
const results = [];
for (const tc of testCases) {
    try {
        const start = performance.now();
        let actual;
        if (typeof ${functionName} === 'function') {
            actual = ${functionName}(...tc.params);
        } else if (typeof Solution !== 'undefined') {
            const sol = new Solution();
            if (typeof sol.${functionName} === 'function') {
                actual = sol.${functionName}(...tc.params);
            } else {
                throw new Error("Function ${functionName} not found in Solution class");
            }
        } else {
            throw new Error("Function ${functionName} not found");
        }
        const end = performance.now();
        results.push({
            status: "Accepted",
            actual: actual,
            expected: tc.expected,
            time: end - start
        });
    } catch (e) {
        results.push({ status: "Runtime Error", error: e.message });
    }
}
console.log("__JUDGE_RESULTS__" + JSON.stringify(results));
`;

        case "python":
            const escapedCode = userCode.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"').replace(/'/g, "\\'");
            return `
import time
import json
import sys

exec_globals = {}
try:
    exec(compile("""${escapedCode}\""", 'user_code', 'exec'), exec_globals)
except Exception as e:
    print("__JUDGE_RESULTS__" + json.dumps([{"status": "Runtime Error", "error": str(e)}]))
    sys.exit(0)

test_cases = json.loads('${tcJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')
results = []
try:
    if 'Solution' in exec_globals:
        sol = exec_globals['Solution']()
        func = getattr(sol, '${functionName}')
    else:
        func = exec_globals.get('${functionName}')

    if not func:
        raise Exception("Function ${functionName} not found")

    for tc in test_cases:
        start = time.perf_counter()
        actual = func(*tc['params'])
        end = time.perf_counter()
        results.append({
            "status": "Accepted",
            "actual": actual,
            "expected": tc['expected'],
            "time": (end - start) * 1000
        })
except Exception as e:
    results.append({"status": "Runtime Error", "error": str(e)})

print("__JUDGE_RESULTS__" + json.dumps(results))
`;

        case "java":
            // Java requires a more structured approach since it's compiled.
            // We use a predefined wrapper class that parses JSON and calls the user's Solution class.
            return `
import java.util.*;

${userCode}

public class Solution {
    public static void main(String[] args) {
        // Simple manual runner for now (expand as needed for JSON parsing)
        // For simplicity, we assume the user provides a Solution class with a static method or instance method.
        // Professional implementations would use a library like Jackson for JSON handling.
        System.out.println("__JUDGE_RESULTS__[]"); // Placeholder until full Java parser is added
    }
}
`;

        default:
            return userCode;
    }
}

export async function judgeCode(language, userCode, functionName, testCases, limits = {}) {
    const config = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!config) throw new Error("Unsupported language");

    const driverCode = getDriver(language, userCode, functionName, testCases);

    try {
        console.log(`[Judge] Executing ${language} in Docker...`);
        const result = await runCodeInDocker(language, driverCode, {
            timeLimit: limits.timeLimit || 2000,
            memoryLimit: limits.memoryLimit || 128
        });

        if (result.status === "System Error") {
            return result;
        }

        // Handle TLE/MLE from Docker
        if (result.status === "Time Limit Exceeded" || result.status === "Memory Limit Exceeded") {
            return {
                status: result.status,
                error: result.error,
                runtime: result.runtime,
                memory: result.memory,
                cases: []
            };
        }

        // Process output for results
        const match = result.output?.match(/__JUDGE_RESULTS__(.*)/);
        if (!match) {
            // Check for other errors
            if (result.status === "error") {
                return {
                    status: "Runtime Error",
                    error: result.error,
                    output: result.output,
                    runtime: result.runtime,
                    memory: result.memory
                };
            }
            return {
                status: "Runtime Error",
                error: "Could not parse judge results. Check for infinite loops or massive output.",
                output: result.output,
                runtime: result.runtime,
                memory: result.memory
            };
        }

        let cases = [];
        try {
            cases = JSON.parse(match[1]);
        } catch (parseErr) {
            return {
                status: "Runtime Error",
                error: "Failed to parse internal judge JSON.",
                output: result.output,
                runtime: result.runtime,
                memory: result.memory
            };
        }

        // Aggregate results
        let totalTime = 0;
        let finalStatus = "Accepted";
        let firstFailure = null;

        for (const c of cases) {
            if (c.status !== "Accepted") {
                finalStatus = c.status;
                firstFailure = c;
                break;
            }
            if (JSON.stringify(c.actual) !== JSON.stringify(c.expected)) {
                finalStatus = "Wrong Answer";
                firstFailure = c;
                break;
            }
            totalTime += (c.time || 0);
        }

        return {
            status: finalStatus,
            cases: cases,
            runtime: parseFloat(totalTime.toFixed(2)),
            memory: result.memory, // Docker stats would be ideal here
            failure: firstFailure,
        };

    } catch (err) {
        console.error("Judge Docker Error:", err);
        return {
            status: "System Error",
            error: err.message,
        };
    }
}
