import User from "../models/User.js";

export const dailyCheckIn = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            console.error("[Reward] No user ID found in request. req.user:", req.user);
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            console.error(`[Reward] User not found in DB with ID: ${req.user._id}`);
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const lastCheckIn = user.dailyCheckInDate ? new Date(user.dailyCheckInDate) : null;
        const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate()) : null;

        if (lastCheckInDate && lastCheckInDate.getTime() === today.getTime()) {
            return res.status(400).json({ message: "Already checked in today" });
        }

        user.coins += 1;
        user.dailyCheckInDate = now;
        await user.save();

        console.log(`[Reward] Daily check-in successful for user: ${user.name} (${user._id})`);

        res.status(200).json({
            message: "Daily check-in successful",
            coins: user.coins,
            dailyCheckInDate: user.dailyCheckInDate
        });
    } catch (error) {
        console.error("[Reward] Critical error in dailyCheckIn:", error);
        res.status(500).json({ message: "Internal server error during check-in" });
    }
};

export const claimProblemReward = async (req, res) => {
    try {
        const { difficulty } = req.body;
        const { problemId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if problem already rewarded (optional, depending on if you want one-time rewards)
        if (user.solvedProblems.includes(problemId)) {
            // Still update streak, but maybe no extra coins? 
            // For now, let's allow coins but logic can be added here.
        }

        let coinGain = 0;
        switch (difficulty?.toLowerCase()) {
            case 'easy': coinGain = 10; break;
            case 'medium': coinGain = 25; break;
            case 'hard': coinGain = 50; break;
            default: coinGain = 5;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
        const lastSolvedDate = lastSolved ? new Date(lastSolved.getFullYear(), lastSolved.getMonth(), lastSolved.getDate()) : null;

        // Streak logic
        if (!lastSolvedDate) {
            user.streak = 1;
        } else {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastSolvedDate.getTime() === yesterday.getTime()) {
                user.streak += 1;
                // 7-day bonus
                if (user.streak % 7 === 0) {
                    coinGain += 50;
                }
            } else if (lastSolvedDate.getTime() < yesterday.getTime()) {
                user.streak = 1;
            }
            // If already solved today, streak stays the same
        }

        user.coins += coinGain;
        user.lastSolvedDate = now;
        if (!user.solvedProblems.includes(problemId)) {
            user.solvedProblems.push(problemId);
        }

        await user.save();

        res.status(200).json({
            message: "Reward claimed",
            coins: user.coins,
            streak: user.streak,
            coinGain
        });
    } catch (error) {
        console.error("Error in claimProblemReward:", error);
        res.status(500).json({ message: "Server error" });
    }
};
