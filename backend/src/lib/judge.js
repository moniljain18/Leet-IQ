import { runCodeInDocker } from "./dockerExecutor.js";
import { randomUUID } from "crypto";

const LANGUAGE_CONFIG = {
    javascript: { language: "javascript" },
    python: { language: "python" },
    java: { language: "java" },
};

/**
 * Generates a wrapper script for the specific language.
 * Now uses a secret result marker to prevent user code spoofing.
 */
function getDriver(language, userCode, functionName, testCases, marker, structure = {}) {
    const tcJson = JSON.stringify(testCases);
    const argTypes = structure.argTypes || [];
    const returnType = structure.returnType;

    switch (language.toLowerCase()) {
        case "javascript":
            return `
// Helper Definitions
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

// Deserializers
function arrayToList(arr) {
    if (!arr || arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}
function listToArray(head) {
    const arr = [];
    while (head) {
        arr.push(head.val);
        head = head.next;
    }
    return arr;
}
function arrayToTree(arr) {
    if (!arr || arr.length === 0) return null;
    let root = new TreeNode(arr[0]);
    let queue = [root];
    let i = 1;
    while (i < arr.length) {
        let current = queue.shift();
        if (arr[i] !== null) {
            current.left = new TreeNode(arr[i]);
            queue.push(current.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            current.right = new TreeNode(arr[i]);
            queue.push(current.right);
        }
        i++;
    }
    return root;
}
// Note: Tree serialization (treeToArray) is complex (BFS with nulls), usually not needed for judging if we compare JSONs? 
// Actually, LeetCode compares the SERIALIZED output. So we need treeToArray.
function treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    // Trim trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }
    return result;
}

${userCode}

(function() {
    const testCases = ${tcJson};
    const results = [];
    const marker = "${marker}";
    const argTypes = ${JSON.stringify(argTypes)};
    const returnType = "${returnType || ''}";

    for (const tc of testCases) {
        try {
            // Convert inputs based on metadata
            const args = tc.params.map((param, idx) => {
                const type = argTypes[idx];
                if (type === "ListNode") return arrayToList(param);
                if (type === "TreeNode") return arrayToTree(param);
                return param;
            });

            const start = performance.now();
            let actual;
            if (typeof ${functionName} === 'function') {
                actual = ${functionName}(...args);
            } else if (typeof Solution !== 'undefined') {
                const sol = new Solution();
                if (typeof sol.${functionName} === 'function') {
                    actual = sol.${functionName}(...args);
                } else {
                    throw new Error("Function ${functionName} not found in Solution class");
                }
            } else {
                throw new Error("Function ${functionName} not found");
            }
            const end = performance.now();

            // Convert output back to serializable format for comparison
            let serializedActual = actual;
            if (returnType === "ListNode") serializedActual = listToArray(actual);
            // if (returnType === "TreeNode") serializedActual = treeToArray(actual); // TODO: implement if needed

            results.push({
                status: "Accepted",
                actual: serializedActual,
                expected: tc.expected,
                time: end - start
            });
        } catch (e) {
            results.push({ status: "Runtime Error", error: e.message });
            break;
        }
    }
    process.stdout.write(marker + JSON.stringify(results) + "\\n");
})();
`;

        case "python":
            const escapedCode = userCode.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"');
            return `
import time
import json
import sys

# Helpers
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def array_to_list(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for x in arr[1:]:
        curr.next = ListNode(x)
        curr = curr.next
    return head

def list_to_array(head):
    arr = []
    while head:
        arr.append(head.val)
        head = head.next
    return arr

def array_to_tree(arr):
    if not arr: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while i < len(arr):
        curr = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            curr.left = TreeNode(arr[i])
            queue.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            queue.append(curr.right)
        i += 1
    return root

def run_judge():
    marker = "${marker}"
    arg_types = ${JSON.stringify(argTypes)}
    return_type = "${returnType || ''}"
    
    exec_globals = {}
    # Inject helpers into user scope
    exec_globals['ListNode'] = ListNode
    exec_globals['TreeNode'] = TreeNode

    try:
        exec(compile("""${escapedCode}\""", 'user_code', 'exec'), exec_globals)
    except Exception as e:
        print(marker + json.dumps([{"status": "Runtime Error", "error": str(e)}]))
        return

    test_cases = json.loads('${tcJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')
    results = []
    
    if 'Solution' in exec_globals:
        try:
            sol = exec_globals['Solution']()
            func = getattr(sol, '${functionName}', None)
        except Exception as e:
             # Handle case where Solution needs args or fails init
            print(marker + json.dumps([{"status": "Runtime Error", "error": "Solution class init failed: " + str(e)}]))
            return
    else:
        func = exec_globals.get('${functionName}')

    if not func:
        print(marker + json.dumps([{"status": "Runtime Error", "error": "Function ${functionName} not found"}]))
        return

    for tc in test_cases:
        try:
            # Convert args
            args = []
            params = tc['params']
            for idx, param in enumerate(params):
                if idx < len(arg_types):
                    t = arg_types[idx]
                    if t == "ListNode":
                        args.append(array_to_list(param))
                    elif t == "TreeNode":
                        args.append(array_to_tree(param))
                    else:
                        args.append(param)
                else:
                    args.append(param)

            start = time.perf_counter()
            actual = func(*args)
            end = time.perf_counter()

            # Serialize output
            if return_type == "ListNode":
                actual = list_to_array(actual)
            
            results.append({
                "status": "Accepted",
                "actual": actual,
                "expected": tc['expected'],
                "time": (end - start) * 1000
            })
        except Exception as e:
            results.append({"status": "Runtime Error", "error": str(e)})
            break

    print(marker + json.dumps(results))

run_judge()
`;

        case "java":
            // Java requires a complete class structure with main method
            // We need to wrap user's Solution class and run test cases
            const javaTestCases = JSON.stringify(testCases).replace(/"/g, '\\"');
            const javaArgTypes = JSON.stringify(argTypes).replace(/"/g, '\\"');
            return `
import java.util.*;
import org.json.*;

// Helper classes
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

${userCode}

public class Main {
    // Helper methods
    public static ListNode arrayToList(JSONArray arr) throws JSONException {
        if (arr == null || arr.length() == 0) return null;
        ListNode head = new ListNode(arr.getInt(0));
        ListNode curr = head;
        for (int i = 1; i < arr.length(); i++) {
            curr.next = new ListNode(arr.getInt(i));
            curr = curr.next;
        }
        return head;
    }
    
    public static JSONArray listToArray(ListNode head) {
        JSONArray arr = new JSONArray();
        while (head != null) {
            arr.put(head.val);
            head = head.next;
        }
        return arr;
    }
    
    public static TreeNode arrayToTree(JSONArray arr) throws JSONException {
        if (arr == null || arr.length() == 0) return null;
        TreeNode root = new TreeNode(arr.getInt(0));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length()) {
            TreeNode curr = queue.poll();
            if (i < arr.length() && !arr.isNull(i)) {
                curr.left = new TreeNode(arr.getInt(i));
                queue.add(curr.left);
            }
            i++;
            if (i < arr.length() && !arr.isNull(i)) {
                curr.right = new TreeNode(arr.getInt(i));
                queue.add(curr.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        String marker = "${marker}";
        JSONArray results = new JSONArray();
        
        try {
            String testCasesJson = "${javaTestCases}";
            String argTypesJson = "${javaArgTypes}";
            String returnType = "${returnType || ''}";
            
            JSONArray testCases = new JSONArray(testCasesJson);
            JSONArray argTypes = new JSONArray(argTypesJson);
            
            Solution sol = new Solution();
            
            for (int t = 0; t < testCases.length(); t++) {
                JSONObject tc = testCases.getJSONObject(t);
                JSONObject result = new JSONObject();
                
                try {
                    JSONArray params = tc.getJSONArray("params");
                    long start = System.nanoTime();
                    
                    // Call the solution method using reflection
                    java.lang.reflect.Method[] methods = Solution.class.getDeclaredMethods();
                    java.lang.reflect.Method targetMethod = null;
                    for (java.lang.reflect.Method m : methods) {
                        if (m.getName().equals("${functionName}")) {
                            targetMethod = m;
                            break;
                        }
                    }
                    
                    if (targetMethod == null) {
                        result.put("status", "Runtime Error");
                        result.put("error", "Method ${functionName} not found");
                        results.put(result);
                        break;
                    }
                    
                    // Prepare arguments
                    Object[] callArgs = new Object[params.length()];
                    Class<?>[] paramTypes = targetMethod.getParameterTypes();
                    
                    for (int i = 0; i < params.length(); i++) {
                        String argType = i < argTypes.length() ? argTypes.getString(i) : "";
                        Class<?> pType = paramTypes[i];
                        
                        if (argType.equals("ListNode") || pType == ListNode.class) {
                            callArgs[i] = arrayToList(params.getJSONArray(i));
                        } else if (argType.equals("TreeNode") || pType == TreeNode.class) {
                            callArgs[i] = arrayToTree(params.getJSONArray(i));
                        } else if (pType == int[].class) {
                            JSONArray arr = params.getJSONArray(i);
                            int[] intArr = new int[arr.length()];
                            for (int j = 0; j < arr.length(); j++) intArr[j] = arr.getInt(j);
                            callArgs[i] = intArr;
                        } else if (pType == int.class || pType == Integer.class) {
                            callArgs[i] = params.getInt(i);
                        } else if (pType == String.class) {
                            callArgs[i] = params.getString(i);
                        } else if (pType == boolean.class || pType == Boolean.class) {
                            callArgs[i] = params.getBoolean(i);
                        } else if (pType == String[].class) {
                            JSONArray arr = params.getJSONArray(i);
                            String[] strArr = new String[arr.length()];
                            for (int j = 0; j < arr.length(); j++) strArr[j] = arr.getString(j);
                            callArgs[i] = strArr;
                        } else if (pType == int[][].class) {
                            JSONArray arr = params.getJSONArray(i);
                            int[][] intArr = new int[arr.length()][];
                            for (int j = 0; j < arr.length(); j++) {
                                JSONArray inner = arr.getJSONArray(j);
                                intArr[j] = new int[inner.length()];
                                for (int k = 0; k < inner.length(); k++) intArr[j][k] = inner.getInt(k);
                            }
                            callArgs[i] = intArr;
                        } else {
                            callArgs[i] = params.get(i);
                        }
                    }
                    
                    Object actual = targetMethod.invoke(sol, callArgs);
                    long end = System.nanoTime();
                    
                    // Serialize output
                    Object serializedActual;
                    if (returnType.equals("ListNode") || actual instanceof ListNode) {
                        serializedActual = listToArray((ListNode) actual);
                    } else if (actual instanceof int[]) {
                        JSONArray arr = new JSONArray();
                        for (int v : (int[]) actual) arr.put(v);
                        serializedActual = arr;
                    } else if (actual instanceof int[][]) {
                        JSONArray arr = new JSONArray();
                        for (int[] row : (int[][]) actual) {
                            JSONArray rowArr = new JSONArray();
                            for (int v : row) rowArr.put(v);
                            arr.put(rowArr);
                        }
                        serializedActual = arr;
                    } else if (actual instanceof List) {
                        serializedActual = new JSONArray((List<?>) actual);
                    } else {
                        serializedActual = actual;
                    }
                    
                    result.put("status", "Accepted");
                    result.put("actual", serializedActual);
                    result.put("expected", tc.get("expected"));
                    result.put("time", (end - start) / 1_000_000.0);
                    
                } catch (Exception e) {
                    result.put("status", "Runtime Error");
                    result.put("error", e.getMessage() != null ? e.getMessage() : e.toString());
                    results.put(result);
                    break;
                }
                results.put(result);
            }
        } catch (Exception e) {
            JSONObject errorResult = new JSONObject();
            try {
                errorResult.put("status", "Runtime Error");
                errorResult.put("error", e.getMessage() != null ? e.getMessage() : e.toString());
            } catch (JSONException je) {}
            results.put(errorResult);
        }
        
        System.out.println(marker + results.toString());
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

    // Spoof protection: unique marker per run
    const marker = `__JUDGE_${randomUUID()}__`;
    const driverCode = getDriver(language, userCode, functionName, testCases, marker);

    try {
        console.log(`[Judge] Executing ${language} in Docker with marker...`);
        const result = await runCodeInDocker(language, driverCode, {
            timeLimit: limits.timeLimit || 2000,
            memoryLimit: limits.memoryLimit || 128
        });

        if (result.status === "System Error") {
            return result;
        }

        // Handle TLE/MLE from Docker level
        if (result.status === "Time Limit Exceeded" || result.status === "Memory Limit Exceeded") {
            return {
                status: result.status,
                error: result.error,
                runtime: result.runtime,
                memory: result.memory,
                cases: []
            };
        }

        // Process output for results using our secret marker
        const markerIndex = result.output?.indexOf(marker);
        let rawOutput = result.output;
        let judgeJson = null;

        if (markerIndex !== -1) {
            rawOutput = result.output.substring(0, markerIndex).trim();
            judgeJson = result.output.substring(markerIndex + marker.length).trim();
        }

        if (!judgeJson) {
            // If no JSON was found but status was successful, something went wrong
            if (result.status === "success" || result.status === "Accepted") {
                return {
                    status: "Runtime Error",
                    error: "No results received. Check for infinite loops or process kills.",
                    rawOutput: rawOutput,
                    runtime: result.runtime,
                    memory: result.memory
                };
            }
            return {
                status: "Runtime Error",
                error: result.error || "Execution failed without results",
                rawOutput: rawOutput,
                runtime: result.runtime,
                memory: result.memory
            };
        }

        let cases = [];
        try {
            cases = JSON.parse(judgeJson);
        } catch (parseErr) {
            return {
                status: "Runtime Error",
                error: "Failed to parse judge output. Output stream might be corrupted.",
                rawOutput: rawOutput,
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
            rawOutput: rawOutput,
            runtime: parseFloat(totalTime.toFixed(2)),
            memory: result.memory,
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
