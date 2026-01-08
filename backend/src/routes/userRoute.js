import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getProfile, restoreStreak, startTimeTravel, cancelTimeTravel } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protectRoute, getProfile);
router.post("/restore-streak", protectRoute, restoreStreak);
router.post("/start-time-travel", protectRoute, startTimeTravel);
router.post("/cancel-time-travel", protectRoute, cancelTimeTravel);

export default router;
