import mongoose from "mongoose";
import Contest from "../models/Contest.js";
import ContestSubmission from "../models/ContestSubmission.js";

export const getContests = async (req, res) => {
    try {
        const contests = await Contest.find().sort({ startTime: -1 });
        res.status(200).json(contests);
    } catch (error) {
        console.error("Error in getContests:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        res.status(200).json(contest);
    } catch (error) {
        console.error("Error in getContestById:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const registerForContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const userId = req.auth.userId; // Assuming Clerk provides this in protectRoute
        // We need to map Clerk userId to our DB ObjectId if not already done
        // For now, let's assume req.user._id exists if protectRoute populates it
        const mongoUserId = req.user._id;

        const currentParticipant = contest.participants.find(p => p.user.toString() === mongoUserId.toString());
        if (currentParticipant) {
            return res.status(400).json({ message: "User already registered" });
        }

        contest.participants.push({ user: mongoUserId });
        await contest.save();

        res.status(200).json({ message: "Registered successfully" });
    } catch (error) {
        console.error("Error in registerForContest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const cancelRegistration = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const mongoUserId = req.user._id;

        const participantIndex = contest.participants.findIndex(p => p.user.toString() === mongoUserId.toString());
        if (participantIndex === -1) {
            return res.status(400).json({ message: "User not registered" });
        }

        contest.participants.splice(participantIndex, 1);
        await contest.save();

        res.status(200).json({ message: "Registration cancelled successfully" });
    } catch (error) {
        console.error("Error in cancelRegistration:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const submitToContest = async (req, res) => {
    try {
        const { problemId, code, language, status, runtime, memory } = req.body;
        const contestId = req.params.id;
        const userId = req.user._id;

        let score = 0;
        let contest = null;

        if (contestId !== "practice") {
            contest = await Contest.findById(contestId);
            if (!contest) {
                return res.status(404).json({ message: "Contest not found" });
            }

            // Calculate score if Accepted
            if (status === "Accepted") {
                const problem = contest.problems?.find(p => p.problemId === problemId || p.id === problemId);
                if (problem) {
                    score = problem.score || 100;
                } else {
                    score = 100; // fallback
                }
            }
        }

        const submission = new ContestSubmission({
            contest: contestId,
            user: userId,
            problemId,
            code,
            language,
            status,
            runtime,
            memory: memory || 0,
            score
        });

        console.log(`[Submission] Saving for user: ${userId}, problem: ${problemId}, status: ${status}`);
        await submission.save();

        res.status(200).json({
            status: "Submission Recorded",
            submissionId: submission._id
        });
    } catch (error) {
        console.error("Error in submitToContest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getContestSubmissions = async (req, res) => {
    try {
        const { id: contestId } = req.params;
        const { problemId } = req.query;
        const mongoUserId = req.user._id;

        let contestMatch = contestId.toString();
        // Mongoose find() will handle cast to String if schema says String.

        const query = {
            contest: contestMatch,
            user: mongoUserId
        };

        if (problemId) {
            query.problemId = problemId;
        }

        const submissions = await ContestSubmission.find(query).sort({ createdAt: -1 });

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error in getContestSubmissions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { id: contestId } = req.params;

        // In aggregation, we MUST match types exactly as in the DB.
        // Since schema says contest is a String, we use a string.
        const contestMatch = contestId.toString();

        const leaderboard = await ContestSubmission.aggregate([
            { $match: { contest: contestMatch, status: "Accepted" } },
            // First group by user and problem to get the best score for each problem
            {
                $group: {
                    _id: { user: "$user", problemId: "$problemId" },
                    bestScore: { $max: "$score" },
                    bestTime: { $min: "$submittedAt" }
                }
            },
            // Then group by user to sum up their scores
            {
                $group: {
                    _id: "$_id.user",
                    totalScore: { $sum: "$bestScore" },
                    lastSubmissionTime: { $max: "$bestTime" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    userId: "$_id",
                    name: "$userDetails.name",
                    profileImage: "$userDetails.profileImage",
                    totalScore: 1,
                    lastSubmissionTime: 1,
                    count: 1
                }
            },
            { $sort: { totalScore: -1, lastSubmissionTime: 1 } }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Error in getLeaderboard:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin route to create contest
export const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;
        const newContest = new Contest({
            title,
            description,
            startTime,
            endTime,
            problems
        });

        await newContest.save();
        res.status(201).json(newContest);
    } catch (error) {
        console.error("Error in createContest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSolvedProblemIds = async (req, res) => {
    try {
        const mongoUserId = req.user._id;
        console.log(`[SolvedIDs] Fetching for user: ${mongoUserId}`);
        const solvedSubmissions = await ContestSubmission.find({
            user: mongoUserId,
            status: "Accepted"
        }).distinct("problemId");

        console.log(`[SolvedIDs] Found: ${solvedSubmissions.length} problems - ${solvedSubmissions}`);
        res.status(200).json(solvedSubmissions);
    } catch (error) {
        console.error("Error in getSolvedProblemIds:", error);
        res.status(500).json({ message: "Server error" });
    }
};
