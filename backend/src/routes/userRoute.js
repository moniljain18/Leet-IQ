import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectRoute, getProfile);

export default router;
