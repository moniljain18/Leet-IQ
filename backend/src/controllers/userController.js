export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        // Auto-reset streak if they missed yesterday
        if (user.streak > 0 && user.lastSolvedDate) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const lastSolved = new Date(user.lastSolvedDate);
            const lastSolvedDate = new Date(lastSolved.getFullYear(), lastSolved.getMonth(), lastSolved.getDate());

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // If last solved was before yesterday, streak is broken
            if (lastSolvedDate.getTime() < yesterday.getTime()) {
                user.streak = 0;
                await user.save();
            }
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
