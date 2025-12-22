import { executeCode } from "../lib/executor.js";

export const executeSubmission = async (req, res) => {
    try {
        const { language, code, problemId } = req.body;

        if (!language || !code) {
            return res.status(400).json({ message: "Language and code are required" });
        }

        // Execute code
        const result = await executeCode(language, code);

        // If there was a system error (e.g., Docker failure)
        if (result.status === "system_error") {
            console.error("Execution System Error:", result.error);
            return res.status(500).json({
                msg: "Execution Environment Error",
                detail: result.error
            });
        }

        // If the code ran but produced an error (runtime error, syntax error)
        if (result.status === "error" || result.error) {
            return res.status(200).json({
                status: "Runtime Error",
                output: result.error, // Show stderr
                expectedOutput: null,
            });
        }

        // Success flow - now we should compare with expected output
        // But since the expected output depends on the problem, for now we just return the raw output.
        // The frontend can compare, OR we can accept `expectedOutput` in the body.
        // Given the architecture, let's just return the output for now and let the Frontend judge "Accepted".
        // Alternatively, if the frontend sends the Expected Output, we can compare here.

        res.status(200).json({
            status: result.status === "success" ? "Calculated" : "Runtime Error",
            output: result.status === "success" ? result.output : result.error,
            runtime: result.runtime,
        });

    } catch (error) {
        console.error("Executor Controller Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
