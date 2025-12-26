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
