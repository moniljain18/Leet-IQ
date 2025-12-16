// Piston API is a service for code execution

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
    try {
        const languageConfig = LANGUAGE_VERSIONS[language];

        if (!languageConfig) {
            return {
                success: false,
                error: `Unsupported language: ${language}`,
            };
        }

        const startTime = Date.now();
        const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language: languageConfig.language,
                version: languageConfig.version,
                files: [
                    {
                        name: `main.${getFileExtension(language)}`,
                        content: code,
                    },
                ],
            }),
        });
        const endTime = Date.now();
        const runtime = endTime - startTime; // Client-side measured duration

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP error! status: ${response.status}`,
            };
        }

        const data = await response.json();
        console.log("Piston API Response:", data); // Debug logging

        // Check for compilation errors (e.g., Syntax Errors in Java/C++)
        if (data.compile && data.compile.stderr) {
            return {
                success: false,
                output: "",
                error: `Compilation Error:\n${data.compile.stderr}`,
            };
        }

        // Check if runtime execution happened
        if (!data.run) {
            return {
                success: false,
                output: "",
                error: "Execution failed: No run data received from Piston API",
            };
        }

        const output = data.run.output || "";
        const stderr = data.run.stderr || "";

        // If stderr exists during run, return failure
        if (stderr) {
            return {
                success: false,
                output: output,
                error: `Runtime Error:\n${stderr}`,
            };
        }

        return {
            success: true,
            output: output.trim() || "No output",
            runtime: runtime, // Client-side measured
            memory: null,     // Not available from API
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to execute code: ${error.message}`,
        };
    }
}

function getFileExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java",
    };

    return extensions[language] || "txt";
}
