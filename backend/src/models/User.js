import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profileImage: {
            type: String,
            default: "",
        },
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        coins: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastSolvedDate: {
            type: Date,
            default: null,
        },
        dailyCheckInDate: {
            type: Date,
            default: null,
        },
        solvedProblems: [{
            type: String,
        }],
    },
    { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
