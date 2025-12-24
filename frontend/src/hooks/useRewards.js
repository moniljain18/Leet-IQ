import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { rewardApi } from "../api/rewards";

export const useDailyCheckIn = () => {
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationKey: ["dailyCheckIn"],
        mutationFn: rewardApi.dailyCheckIn,
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
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationKey: ["claimProblemReward"],
        mutationFn: ({ problemId, difficulty }) => rewardApi.claimProblemReward(problemId, difficulty),
        onSuccess: (data) => {
            toast.success(`You earned ${data.coinGain} coins!`);
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
        onError: (error) => {
            console.error("Reward claim failed:", error);
        },
    });

    return result;
};
