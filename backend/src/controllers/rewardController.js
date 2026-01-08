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

        // Check if this is a time travel solve
        let isTimeTravel = false;
        let timeTravelDate = null;

        if (user.activeTimeTravelDate) {
            isTimeTravel = true;
            timeTravelDate = new Date(user.activeTimeTravelDate);

            // Deduct a time travel pass
            if (user.timeTravelPasses > 0) {
                user.timeTravelPasses -= 1;
                console.log(`[Reward] Time travel pass used. Remaining: ${user.timeTravelPasses}`);
            }

            // Add the date to streakHistory
            if (!user.streakHistory) {
                user.streakHistory = [];
            }
            user.streakHistory.push(timeTravelDate);

            // Clear the active time travel
            user.activeTimeTravelDate = null;

            console.log(`[Reward] Time travel completed for date: ${timeTravelDate.toDateString()}`);
        }

        const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
        const lastSolvedDate = lastSolved ? new Date(lastSolved.getFullYear(), lastSolved.getMonth(), lastSolved.getDate()) : null;

        // Streak logic - More robust normalization
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        console.log(`[Reward] Problem: ${problemId}, User: ${user.name}, IsTimeTravel: ${isTimeTravel}`);
        console.log(`[Reward] Debug Dates - Normalized Today: ${today.toISOString()}, Normalized Yesterday: ${yesterday.toISOString()}, Normalized LastSolved: ${lastSolvedDate ? lastSolvedDate.toISOString() : 'NULL'}`);

        // Only update streak for non-time-travel solves
        if (!isTimeTravel) {
            if (!lastSolvedDate) {
                // First time ever solving a problem
                user.streak = 1;
                console.log("[Reward] First time solve - Streak set to 1");
            } else {
                const lastSolvedTime = lastSolvedDate.getTime();
                const todayTime = today.getTime();
                const yesterdayTime = yesterday.getTime();

                if (lastSolvedTime === todayTime) {
                    // Already solved a problem today - streak stays the same
                    console.log(`[Reward] Already solved today - Streak remains at ${user.streak}`);
                } else if (lastSolvedTime === yesterdayTime) {
                    // Solved yesterday, solving today - increment streak!
                    user.streak += 1;
                    console.log(`[Reward] Sequential solve - Streak incremented to ${user.streak}`);
                    // 7-day bonus
                    if (user.streak % 7 === 0) {
                        coinGain += 50;
                        console.log("[Reward] 7-day bonus granted (+50 coins)");
                    }
                } else if (lastSolvedTime < yesterdayTime) {
                    // Solved before yesterday - streak broken, restart at 1
                    user.streak = 1;
                    console.log("[Reward] Streak broken - Restarting at 1");
                }
            }

            // Update lastSolvedDate only for normal solves
            user.lastSolvedDate = now;

            // Add today to streakHistory
            if (!user.streakHistory) {
                user.streakHistory = [];
            }
            // Check if today is already in history
            const todayInHistory = user.streakHistory.some(d => {
                const historyDate = new Date(d);
                const historyMidnight = new Date(historyDate.getFullYear(), historyDate.getMonth(), historyDate.getDate());
                return historyMidnight.getTime() === today.getTime();
            });
            if (!todayInHistory) {
                user.streakHistory.push(today);
            }
        }

        user.coins += coinGain;

        // Ensure problemId is saved as string (it is now a string array in model)
        if (!user.solvedProblems.includes(problemId)) {
            user.solvedProblems.push(problemId);
            console.log(`[Reward] Problem ${problemId} added to solvedProblems`);
        }

        await user.save();
        console.log(`[Reward] Save successful - Final Streak: ${user.streak}, Final Coins: ${user.coins}`);

        res.status(200).json({
            message: isTimeTravel ? "Time travel completed!" : "Reward claimed",
            coins: user.coins,
            streak: user.streak,
            coinGain,
            isTimeTravel,
            timeTravelDate: isTimeTravel ? timeTravelDate : null,
            passesRemaining: user.timeTravelPasses
        });
    } catch (error) {
        console.error("Error in claimProblemReward:", error);
        res.status(500).json({ message: "Server error" });
    }
};

