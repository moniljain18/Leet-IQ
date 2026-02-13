import { executeCode } from "../lib/executor.js";
import { judgeCode } from "../lib/judge.js";
import { PROBLEMS } from "../data/problems.js";
import { calculateBenchmarks } from "../services/benchmarkService.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";

const FREE_DAILY_PROBLEM_LIMIT = 5;

export const executeSubmission = async (req, res) => {
    try {
        const { language, code, problemId, isSubmit } = req.body;

        if (!language || !code || !problemId) {
            return res.status(400).json({ message: "Language, code, and problemId are required" });
        }

        // Get user from request (set by protectRoute middleware)
        const user = req.user;

        // For SUBMIT mode, check daily problem limit for free users
        if (isSubmit && user && !user.isPremium) {
            // Skip limit check if user already solved this problem (practice mode is unlimited)
            const isAlreadySolved = user.solvedProblems?.includes(problemId);

            if (!isAlreadySolved) {
                const today = new Date().toDateString();
                const lastSolvedDate = user.lastProblemSolvedDate
                    ? new Date(user.lastProblemSolvedDate).toDateString()
                    : null;

                // Reset count if new day
                let dailyCount = lastSolvedDate === today ? (user.dailyProblemsSolved || 0) : 0;

                if (dailyCount >= FREE_DAILY_PROBLEM_LIMIT) {
                    return res.status(403).json({
                        message: "Daily problem limit reached. Upgrade to Premium for unlimited practice!",
                        error: "FREE_TIER_LIMIT",
                        upgradeRequired: true,
                        dailyLimit: FREE_DAILY_PROBLEM_LIMIT,
                        problemsSolved: dailyCount
                    });
                }
            }
        }

        // Try to fetch problem from database first, fallback to static PROBLEMS
        let problem;
        try {
            const dbProblem = await Problem.findOne({ id: problemId, isActive: true });
            if (dbProblem) {
                problem = dbProblem.toObject();
                console.log(`[Executor] Using database problem: ${problemId} `);
            } else {
                problem = PROBLEMS[problemId];
                console.log(`[Executor] Using static problem: ${problemId} `);
            }
        } catch (dbError) {
            console.error(`[Executor] Database lookup failed, using static: `, dbError.message);
            problem = PROBLEMS[problemId];
        }

        if (!problem) {
            return res.status(404).json({ message: "Problem not found in judging database" });
        }

        // Check if problem is premium-only and user doesn't have premium
        if (problem.isPremiumOnly && user && !user.isPremium) {
            return res.status(403).json({
                message: "This problem is Premium-only. Upgrade to access!",
                error: "PREMIUM_REQUIRED",
                upgradeRequired: true
            });
        }

        // Use the judge engine for EVERYTHING to ensure high precision metrics
        // and that the function is actually called.
        // For "Run Code", we only run the first few test cases to be fast.
        if (!problem.testCases || problem.testCases.length === 0) {
            return res.status(500).json({ message: "Problem has no test cases configured for judging" });
        }

        const testCasesToRun = isSubmit ? problem.testCases : problem.testCases.slice(0, 3);

        // Java needs more time due to JVM startup overhead
        const languageTimeLimits = {
            java: 10000,  // 10 seconds for Java
            python: 5000, // 5 seconds for Python
            javascript: 2000
        };
        const timeLimit = languageTimeLimits[language.toLowerCase()] || problem.timeLimit || 5000;

        console.log(`[Executor] ${isSubmit ? 'Judging' : 'Running'} ${problemId} in ${language} `);
        const result = await judgeCode(language, code, problem.functionName, testCasesToRun, {
            timeLimit: timeLimit,
            memoryLimit: problem.memoryLimit || 256,
            structure: problem.structure // Pass structure for type conversion (ListNode, etc)
        });

        if (result.status === "System Error") {
            console.error(`[Executor] Judging System Error: ${result.error} `);
            return res.status(500).json({ msg: "Judging System Error", detail: result.error });
        }

        // If submission was accepted and this is a submit (not just run), increment daily count
        // Only count towards daily limit if this is a NEW problem solution (not re-solve)
        if (isSubmit && result.status === "Accepted" && user && !user.isPremium) {
            const isAlreadySolved = user.solvedProblems?.includes(problemId);

            if (!isAlreadySolved) {
                const today = new Date().toDateString();
                const lastSolvedDate = user.lastProblemSolvedDate
                    ? new Date(user.lastProblemSolvedDate).toDateString()
                    : null;
                let newDailyCount = lastSolvedDate === today ? (user.dailyProblemsSolved || 0) + 1 : 1;

                await User.findByIdAndUpdate(user._id, {
                    dailyProblemsSolved: newDailyCount,
                    lastProblemSolvedDate: new Date()
                });
                console.log(`[Executor] Free user ${user.email} daily NEW problem count: ${newDailyCount}/${FREE_DAILY_PROBLEM_LIMIT}`);
            } else {
                console.log(`[Executor] Free user ${user.email} re-solved ${problemId} - not counting towards limit`);
            }
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

        // Enrich cases with input data from our local database
        const enrichedCases = result.cases?.map((c, idx) => ({
            ...c,
            input: testCasesToRun[idx]?.params // Params are the actual inputs
        })) || [];

        // Map internal status to what the frontend expects if needed,
        // but judgeCode already returns "Accepted", "Wrong Answer", etc.
        res.status(200).json({
            status: result.status,
            runtime: result.runtime,
            memory: result.memory,
            cases: enrichedCases,
            rawOutput: result.rawOutput, // Full stdout minus judge JSON
            failure: result.failure ? {
                ...result.failure,
                input: testCasesToRun[result.cases.findIndex(c => c === result.failure)]?.params
            } : null,
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

