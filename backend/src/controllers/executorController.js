import { executeCode } from "../lib/executor.js";
import { judgeCode } from "../lib/judge.js";
import { PROBLEMS } from "../data/problems.js";
import { calculateBenchmarks } from "../services/benchmarkService.js";

export const executeSubmission = async (req, res) => {
    try {
        const { language, code, problemId, isSubmit } = req.body;

        if (!language || !code || !problemId) {
            return res.status(400).json({ message: "Language, code, and problemId are required" });
        }

        const problem = PROBLEMS[problemId];
        if (!problem) {
            return res.status(404).json({ message: "Problem not found in judging database" });
        }

        // Use the judge engine for EVERYTHING to ensure high precision metrics
        // and that the function is actually called.
        // For "Run Code", we only run the first few test cases to be fast.
        if (!problem.testCases || problem.testCases.length === 0) {
            return res.status(500).json({ message: "Problem has no test cases configured for judging" });
        }

        const testCasesToRun = isSubmit ? problem.testCases : problem.testCases.slice(0, 3);

        console.log(`[Executor] ${isSubmit ? 'Judging' : 'Running'} ${problemId} in ${language}`);
        const result = await judgeCode(language, code, problem.functionName, testCasesToRun, {
            timeLimit: problem.timeLimit || 2000,
            memoryLimit: problem.memoryLimit || 128
        });

        if (result.status === "System Error") {
            console.error(`[Executor] Judging System Error: ${result.error}`);
            return res.status(500).json({ msg: "Judging System Error", detail: result.error });
        }

        let benchmarks = null;
        // Only calculate benchmarks if it's a real submission and Accepted
        if (isSubmit && result.status === "Accepted") {
            try {
                benchmarks = await calculateBenchmarks(problemId, language, result.runtime, result.memory);
            } catch (benchErr) {
                console.error("[Executor] Benchmark calculation failed:", benchErr);
                // Don't fail the whole submission if benchmarks fail
            }
        }

        // Map internal status to what the frontend expects if needed,
        // but judgeCode already returns "Accepted", "Wrong Answer", etc.
        res.status(200).json({
            status: result.status,
            runtime: result.runtime,
            memory: result.memory,
            cases: result.cases,
            failure: result.failure,
            benchmarks: benchmarks,
            // For "Run" mode compatibility with old OutputPanel expectations:
            success: result.status === "Accepted",
            output: result.status === "Accepted" ? "Test Case Passed!" : (result.failure?.actual || result.error)
        });

    } catch (error) {
        console.error("Executor Controller Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
