import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let client = null;

export const initializeStreamClient = async (user, token) => {
    // If we have an existing client for the same user, and it's not disconnected, reuse it
    if (client && client.user?.id === user.id) {
        return client;
    }

    // Otherwise, disconnect any existing client properly
    if (client) {
        console.log("Disconnecting existing Stream client before re-initializing...");
        await disconnectStreamClient();
    }

    if (!apiKey) throw new Error("Stream API key is not provided.");

    client = new StreamVideoClient({
        apiKey,
        user,
        token,
    });

    console.log("Stream client initialized for user:", user.id);
    return client;
};

export const disconnectStreamClient = async () => {
    if (client) {
        try {
            await client.disconnectUser();
            client = null;
        } catch (error) {
            console.error("Error disconnecting Stream client:", error);
        }
    }
};
