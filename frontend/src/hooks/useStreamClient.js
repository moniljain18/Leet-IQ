import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
    const [streamClient, setStreamClient] = useState(null);
    const [call, setCall] = useState(null);
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isInitializingCall, setIsInitializingCall] = useState(true);

    useEffect(() => {
        let isCancelled = false;
        let videoCall = null;
        let chatInstance = null;

        const initCall = async () => {
            // Wait for session data to be fully populated (host and callId are critical)
            if (loadingSession || !session?.callId || !session?.host || (!isHost && !isParticipant)) {
                if (!loadingSession) {
                    setIsInitializingCall(false);
                }
                return;
            }

            if (session.status === "completed") {
                setIsInitializingCall(false);
                return;
            }

            try {
                setIsInitializingCall(true);
                const { token, userId, userName, userImage } = await sessionApi.getStreamToken();
                if (isCancelled) return;

                const vClient = await initializeStreamClient(
                    {
                        id: userId,
                        name: userName,
                        image: userImage,
                    },
                    token
                );

                if (isCancelled) return;
                setStreamClient(vClient);

                videoCall = vClient.call("default", session.callId);
                await videoCall.join({ create: true });
                if (isCancelled) {
                    await videoCall.leave();
                    return;
                }
                setCall(videoCall);

                const apiKey = import.meta.env.VITE_STREAM_API_KEY;
                chatInstance = StreamChat.getInstance(apiKey);

                await chatInstance.connectUser(
                    {
                        id: userId,
                        name: userName,
                        image: userImage,
                    },
                    token
                );
                if (isCancelled) {
                    await chatInstance.disconnectUser();
                    return;
                }
                setChatClient(chatInstance);

                const chatChannel = chatInstance.channel("messaging", session.callId);
                await chatChannel.watch();
                if (isCancelled) return;
                setChannel(chatChannel);

            } catch (error) {
                console.error("useStreamClient: Initialization error", error);
                if (!isCancelled) {
                    // toast.error("Failed to join video call"); // Avoid spamming toasts during race conditions
                }
            } finally {
                if (!isCancelled) {
                    setIsInitializingCall(false);
                }
            }
        };

        initCall();

        return () => {
            isCancelled = true;
            // Note: We don't call setIsInitializingCall(true) here anymore 
            // as it causes blank screens on rapid remounts.

            const cleanup = async () => {
                try {
                    if (videoCall) {
                        await videoCall.leave();
                    }
                    if (chatInstance) {
                        await chatInstance.disconnectUser();
                    }
                    // For singletons, we don't necessarily want to disconnect the whole client 
                    // on every unmount if we might come right back.
                    // But we'll call it for now to be safe, as it was in the "working" state.
                    await disconnectStreamClient();
                } catch (error) {
                    console.error("useStreamClient: Cleanup error", error);
                } finally {
                    setStreamClient(null);
                    setCall(null);
                    setChatClient(null);
                    setChannel(null);
                }
            };
            cleanup();
        };
    }, [session?.callId, session?.status, loadingSession, isHost, isParticipant]);

    return {
        streamClient,
        call,
        chatClient,
        channel,
        isInitializingCall,
    };
}

export default useStreamClient;
