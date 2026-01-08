export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        // Auto-reset streak if they missed yesterday
        if (user.streak > 0 && user.lastSolvedDate) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const lastSolved = new Date(user.lastSolvedDate);
            const lastSolvedDateMidnight = new Date(lastSolved.getFullYear(), lastSolved.getMonth(), lastSolved.getDate());

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            console.log(`[getProfile] Investigating Streak for ${user.name}:`);
            console.log(` - Current Streak: ${user.streak}`);
            console.log(` - Today: ${today.toDateString()}`);
            console.log(` - Last Solved: ${lastSolvedDateMidnight.toDateString()}`);
            console.log(` - Yesterday: ${yesterday.toDateString()}`);

            // If last solved was strictly before yesterday, streak is broken
            // Comparison: if lastSolved is NOT today AND lastSolved is NOT yesterday -> reset
            if (lastSolvedDateMidnight.getTime() < yesterday.getTime()) {
                console.log(`[getProfile] Streak broken! Last solved was before yesterday. Resetting to 0.`);
                user.streak = 0;
                await user.save();
            } else {
                console.log(`[getProfile] Streak maintained. User solved today or yesterday.`);
            }
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Restore streak using a Time Travel Pass
 */
export const restoreStreak = async (req, res) => {
    try {
        const user = req.user;

        // Check if user has passes
        if (!user.timeTravelPasses || user.timeTravelPasses <= 0) {
            return res.status(400).json({
                message: "No Time Travel Passes available",
                passes: user.timeTravelPasses || 0
            });
        }

        // Check if streak is already active (solved today or yesterday)
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let lastSolvedMidnight = null;
        if (user.lastSolvedDate) {
            const lastSolved = new Date(user.lastSolvedDate);
            lastSolvedMidnight = new Date(lastSolved.getFullYear(), lastSolved.getMonth(), lastSolved.getDate());
        }

        // If user already solved today or yesterday, no need to restore
        if (lastSolvedMidnight && lastSolvedMidnight.getTime() >= yesterday.getTime()) {
            return res.status(400).json({
                message: "Your streak is not broken. No restoration needed.",
                streak: user.streak
            });
        }

        // Use the pass to restore streak
        user.timeTravelPasses -= 1;

        // Restore the streak - set lastSolvedDate to yesterday to maintain streak
        user.lastSolvedDate = yesterday;

        // If streak was reset to 0, restore it to 1
        if (user.streak === 0) {
            user.streak = 1;
        }
        // Otherwise, streak continues from where it was

        await user.save();

        console.log(`[restoreStreak] User ${user.name} used a Time Travel Pass. Streak: ${user.streak}, Passes remaining: ${user.timeTravelPasses}`);

        res.status(200).json({
            message: "Streak restored successfully!",
            streak: user.streak,
            passesRemaining: user.timeTravelPasses,
            lastSolvedDate: user.lastSolvedDate
        });

    } catch (error) {
        console.error("Error in restoreStreak:", error);
        res.status(500).json({ message: "Failed to restore streak" });
    }
};

/**
 * Start a time travel session - user clicks on a missed date
 */
export const startTimeTravel = async (req, res) => {
    try {
        const user = req.user;
        const { date } = req.body; // ISO date string

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        // Check if user has passes
        if (!user.timeTravelPasses || user.timeTravelPasses <= 0) {
            return res.status(400).json({
                message: "No Time Travel Passes available",
                passes: user.timeTravelPasses || 0
            });
        }

        // Parse and validate the target date
        const targetDate = new Date(date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDateMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

        // Cannot time travel to today or future
        if (targetDateMidnight.getTime() >= today.getTime()) {
            return res.status(400).json({
                message: "Cannot time travel to today or future dates"
            });
        }

        // Check if this date is already in streakHistory
        const alreadySolved = user.streakHistory?.some(d => {
            const historyDate = new Date(d);
            const historyMidnight = new Date(historyDate.getFullYear(), historyDate.getMonth(), historyDate.getDate());
            return historyMidnight.getTime() === targetDateMidnight.getTime();
        });

        if (alreadySolved) {
            return res.status(400).json({
                message: "You already solved a problem on this date"
            });
        }

        // Set the active time travel date
        user.activeTimeTravelDate = targetDateMidnight;
        await user.save();

        console.log(`[TimeTravel] User ${user.name} started time travel to ${targetDateMidnight.toDateString()}`);

        res.status(200).json({
            message: "Time travel started! Solve a problem to complete.",
            targetDate: targetDateMidnight,
            passesRemaining: user.timeTravelPasses
        });

    } catch (error) {
        console.error("Error in startTimeTravel:", error);
        res.status(500).json({ message: "Failed to start time travel" });
    }
};

/**
 * Cancel active time travel session
 */
export const cancelTimeTravel = async (req, res) => {
    try {
        const user = req.user;

        if (!user.activeTimeTravelDate) {
            return res.status(400).json({ message: "No active time travel session" });
        }

        user.activeTimeTravelDate = null;
        await user.save();

        res.status(200).json({ message: "Time travel cancelled" });
    } catch (error) {
        console.error("Error in cancelTimeTravel:", error);
        res.status(500).json({ message: "Failed to cancel time travel" });
    }
};
