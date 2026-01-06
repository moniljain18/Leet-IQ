import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { env } from "./lib/env.js";
import connectDB from "./lib/db.js";

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
// Routes imports
// Routes imports
import sessionRoutes from "./routes/sessionRoute.js";

import chatRoutes from "./routes/chatRoute.js";
import executorRoutes from "./routes/executorRoute.js";
import contestRoutes from "./routes/contestRoute.js";
import userRoutes from "./routes/userRoute.js";
import rewardRoutes from "./routes/rewardRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import appealRoutes from "./routes/appealRoute.js";
import problemRoutes from "./routes/problemRoute.js";
import billingRoutes from "./routes/billingRoute.js";
import storeRoutes from "./routes/storeRoute.js";

app.use(express.json());
const allowedOrigin = env.CLIENT_URL || process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));

// Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/execute", executorRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appeals", appealRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/store", storeRoutes);

app.get("/api", (req, res) => {
    res.status(200).json({
        msg: "LeetIQ API is running!",
        version: "1.0.0",
        endpoints: ["/api/health", "/api/problems", "/api/sessions", "/api/execute"]
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ msg: "Server is healthy", status: "success" });
});

app.get("/api/books", (req, res) => {
    res.status(200).json({ msg: "This is books API" });
});

// Note: Frontend is deployed separately on Vercel
// No static file serving needed here/api

// Start server and connect to database
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`CORS Policy: Allowing origin ${allowedOrigin}`);
    connectDB();
});