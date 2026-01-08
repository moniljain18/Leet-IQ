import express from "express";
import Problem from "../models/Problem.js";

const router = express.Router();

/**
 * Get company statistics (count of problems per company)
 */
router.get("/stats/companies", async (req, res) => {
    try {
        const result = await Problem.aggregate([
            { $match: { isActive: true } },
            { $unwind: "$companyTags" },
            { $group: { _id: "$companyTags", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({
            companies: result.map(r => ({ name: r._id, count: r.count }))
        });
    } catch (error) {
        console.error("Error fetching company stats:", error);
        res.status(500).json({ message: "Failed to fetch company statistics" });
    }
});

/**
 * Get all problems (public endpoint)
 */
router.get("/", async (req, res) => {
    try {
        const problems = await Problem.find({ isActive: true })
            .sort({ difficulty: 1, createdAt: -1 })
            .select('-__v -createdBy -testCases');

        res.status(200).json({ problems });
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ message: "Failed to fetch problems" });
    }
});

/**
 * Get a single problem by ID (public endpoint)
 */
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findOne({
            id: req.params.id,
            isActive: true
        }).select('-__v -createdBy -testCases');

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json({ problem });
    } catch (error) {
        console.error("Error fetching problem:", error);
        res.status(500).json({ message: "Failed to fetch problem" });
    }
});

export default router;
