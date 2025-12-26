import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { rewardApi } from "../api/rewards";
import { useAuth } from "@clerk/clerk-react";

export const useDailyCheckIn = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationKey: ["dailyCheckIn"],
        mutationFn: async () => {
            const token = await getToken();
            return rewardApi.dailyCheckIn(token);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Check-in failed");
        },
    });

    return result;
};

export const useClaimProblemReward = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationKey: ["claimProblemReward"],
        mutationFn: async ({ problemId, difficulty }) => {
            const token = await getToken();
            return rewardApi.claimProblemReward(problemId, difficulty, token);
        },
        onSuccess: (data) => {
            console.log("[useRewards] Reward mutation success, server data:", data);
            toast.success(`You earned ${data.coinGain} coins!`);

            // Immediate cache update for snappy UI
            queryClient.setQueryData(["userProfile"], (old) => {
                if (!old) {
                    console.log("[useRewards] No existing profile in cache to update");
                    return old;
                }
                const updated = {
                    ...old,
                    coins: data.coins,
                    streak: data.streak
                };
                console.log("[useRewards] Optimistically updated profile cache:", updated);
                return updated;
            });

            // Still invalidate to ensure synchronization with server state
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
        onError: (error) => {
            console.error("[useRewards] Reward claim failed:", error);
        },
    });

    return result;
};
