import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    getContests,
    getContestById,
    registerForContest,
    cancelRegistration,
    submitToContest,
    getContestSubmissions,
    getLeaderboard,
    createContest,
    getSolvedProblemIds,
    updateSubmissionNotes
} from "../controllers/contestController.js";

const router = express.Router();

router.get("/submissions/solved", protectRoute, getSolvedProblemIds);
router.get("/", protectRoute, getContests);
router.post("/", protectRoute, createContest); // Admin should ideally have separate check
router.get("/:id", protectRoute, getContestById);
router.post("/:id/register", protectRoute, registerForContest);
router.delete("/:id/register", protectRoute, cancelRegistration);
router.post("/:id/submit", protectRoute, submitToContest);
router.get("/:id/submissions", protectRoute, getContestSubmissions);
router.get("/:id/leaderboard", protectRoute, getLeaderboard);
router.put("/submissions/:id/notes", protectRoute, updateSubmissionNotes);

export default router;
