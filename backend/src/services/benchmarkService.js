import ContestSubmission from "../models/ContestSubmission.js";

/**
 * Calculates the percentile ranking (Beats %) and distribution data for a submission.
 */
export async function calculateBenchmarks(problemId, language, runtime, memory) {
    try {
        // Get all accepted submissions for this problem and language
        const submissions = await ContestSubmission.find({
            problemId,
            language,
            status: "Accepted"
        }).select("runtime memory");

        if (submissions.length === 0) {
            return {
                runtimePercentile: 100,
                memoryPercentile: 100,
                runtimeDistribution: [],
                memoryDistribution: []
            };
        }

        // Calculate Runtime Percentile
        const total = submissions.length;
        const slowerRuntime = submissions.filter(s => s.runtime > runtime).length;
        const sameRuntime = submissions.filter(s => s.runtime === runtime).length;

        // LeetCode-style logic:
        // You beat everyone strictly slower than you + half of those with the same runtime
        // This makes the percentage more dynamic and accurate across all available users.
        const runtimePercentile = ((slowerRuntime + (sameRuntime / 2)) / total) * 100;

        // Calculate Memory Percentile
        const worseMemory = submissions.filter(s => s.memory > memory).length;
        const sameMemory = submissions.filter(s => s.memory === memory).length;
        const memoryPercentile = ((worseMemory + (sameMemory / 2)) / total) * 100;

        // Generate Distribution Data (for the histogram)
        const runtimeBinSize = Math.max(1, runtime / 10);
        const memoryBinSize = Math.max(1024, memory / 10);

        const runtimeDistribution = generateDistribution(submissions.map(s => s.runtime), runtimeBinSize);
        const memoryDistribution = generateDistribution(submissions.map(s => s.memory), memoryBinSize);

        return {
            runtimePercentile: Math.min(99.9, Math.max(1, runtimePercentile)).toFixed(1),
            memoryPercentile: Math.min(99.9, Math.max(1, memoryPercentile)).toFixed(1),
            runtimeDistribution,
            memoryDistribution,
            runtimeBinSize,
            memoryBinSize
        };
    } catch (error) {
        console.error("Benchmark Calculation Error:", error);
        return null;
    }
}

function generateDistribution(values, binSize) {
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);

    const bins = {};
    values.forEach(v => {
        const binStart = Math.floor(v / binSize) * binSize;
        bins[binStart] = (bins[binStart] || 0) + 1;
    });

    // Convert to sorted array for Recharts
    const distribution = Object.keys(bins).map(k => ({
        bin: Number(k),
        count: bins[k]
    })).sort((a, b) => a.bin - b.bin);

    return distribution;
}
