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

app.use(express.json());
const allowedOrigin = env.CLIENT_URL || process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));

// Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/execute", executorRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ msg: "Server is healthy", status: "success" });
});

app.get("/api/books", (req, res) => {
    res.status(200).json({ msg: "This is books API" });
});

// Production static file serving
if (env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// Start server and connect to database
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`CORS Policy: Allowing origin ${allowedOrigin}`);
    connectDB();
});