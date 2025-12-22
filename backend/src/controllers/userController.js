export const getProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
