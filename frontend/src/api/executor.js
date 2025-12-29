import axiosInstance from "../lib/axios";

export const executeCode = async (language, code, problemId, isSubmit = false) => {
    try {
        const response = await axiosInstance.post("/execute", {
            language,
            code,
            problemId,
            isSubmit
        });

        const data = response.data;

        // If it was a judging run, we return the full data object
        if (isSubmit) {
            return {
                success: data.status === "Accepted",
                ...data
            };
        }

        if (data.status === "Runtime Error") {
            return {
                success: false,
                output: data.output || "",
                error: `Runtime Error:\n${data.output}`,
                runtime: data.runtime || 0,
                memory: data.memory || 0
            };
        }

        return {
            success: true,
            output: data.output,
            runtime: data.runtime || 0,
            memory: data.memory || 0,
        };

    } catch (error) {
        console.error("Execution API Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Execution Failed",
        };
    }
};
