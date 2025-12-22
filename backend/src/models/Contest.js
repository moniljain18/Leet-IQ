import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        problems: [
            {
                problemId: {
                    type: String, // String ID used in frontend PROBLEMS mapping
                    required: true,
                },
                score: {
                    type: Number,
                    default: 100, // Default score per problem
                },
            },
        ],
        participants: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                registeredAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        status: {
            type: String,
            enum: ["upcoming", "active", "completed"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
