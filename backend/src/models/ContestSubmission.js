import mongoose from "mongoose";

const contestSubmissionSchema = new mongoose.Schema(
    {
        contest: {
            type: String, // Supporting both ObjectId and mock string IDs
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        problemId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", "Memory Limit Exceeded", "Pending"],
            default: "Pending",
        },
        code: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        runtime: {
            type: Number,
        },
        memory: {
            type: Number,
        },
        score: {
            type: Number,
            default: 0,
        },
        benchmarks: {
            type: Object, // Stores runtimePercentile, memoryPercentile, distributions
        },
        notes: {
            type: String, // User-provided notes for the submission
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const ContestSubmission = mongoose.model("ContestSubmission", contestSubmissionSchema);

export default ContestSubmission;
