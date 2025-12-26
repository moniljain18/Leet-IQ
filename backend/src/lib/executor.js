import axios from "axios";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_CONFIG = {
    javascript: {
        language: "javascript",
        version: "18.15.0",
    },
    python: {
        language: "python",
        version: "3.10.0",
    },
    java: {
        language: "java",
        version: "15.0.2",
    },
};

export async function executeCode(language, code) {
    const config = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!config) throw new Error("Unsupported language");

    try {
        const response = await axios.post(PISTON_API_URL, {
            language: config.language,
            version: config.version,
            files: [
                {
                    content: code,
                },
            ],
        });

        const { run } = response.data;
        const runtimeMs = Math.round((run.time || 0) * 1000);
        const memoryBytes = run.memory || 0;

        // Piston returns 0 for success, non-zero for error
        if (run.stderr) {
            return {
                status: "error",
                output: run.stdout,
                error: run.stderr,
                runtime: runtimeMs,
                memory: memoryBytes,
            };
        }

        return {
            status: "success",
            output: run.stdout,
            error: null,
            runtime: runtimeMs,
            memory: memoryBytes,
        };

    } catch (err) {
        console.error("Piston API Error:", err.response?.data || err.message);
        return {
            status: "system_error",
            output: "",
            error: err.response?.data?.message || err.message,
        };
    }
}
