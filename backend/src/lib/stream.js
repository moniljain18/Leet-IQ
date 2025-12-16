import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { env } from "./env.js";

const apiKey = env.STREAM_API_KEY;
const apiSecret = env.STREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
    console.error("STREAM_API_KEY or STREAM_SECRET_KEY is missing");
}

export const chatClient = (apiKey && apiSecret) ? StreamChat.getInstance(apiKey, apiSecret) : null;
export const streamClient = (apiKey && apiSecret) ? new StreamClient(apiKey, apiSecret) : null;

if (chatClient) console.log("Chat client initialized");
if (streamClient) console.log("Stream client initialized");

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully:", userData);
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};

export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted successfully:", userId);
    } catch (error) {
        console.error("Error deleting the Stream user:", error);
    }
};
