import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env from backend/.env and repo-root/.env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPaths = [
    // backend/.env
    path.resolve(__dirname, "..", "..", ".env"),
    // repo-root/.env (one level above backend)
    path.resolve(__dirname, "..", "..", "..", ".env"),
];

envPaths.forEach((p) => {
    dotenv.config({ path: p, override: false });
});

export const env = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_SECRET_KEY: process.env.STREAM_SECRET_KEY,
};