import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./lib/env.js";
import connectDB from "./lib/db.js";

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

// Routes
app.get("/api/health", (req, res) => {
    res.status(200).json({ msg: "Server is healthy", status: "success" });
});

app.get("/api/books", (req, res) => {
    res.status(200).json({ msg: "This is books API" });
});

// Production static file serving
if (env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// Start server and connect to database
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    connectDB();
}); 