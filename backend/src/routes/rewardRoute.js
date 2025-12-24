import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { dailyCheckIn, claimProblemReward } from "../controllers/rewardController.js";

const router = express.Router();

router.post("/check-in", protectRoute, dailyCheckIn);
router.post("/problem/:problemId", protectRoute, claimProblemReward);

export default router;
