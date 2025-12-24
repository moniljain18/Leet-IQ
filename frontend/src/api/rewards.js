import axiosInstance from "../lib/axios";

export const rewardApi = {
    dailyCheckIn: async () => {
        const response = await axiosInstance.post("/rewards/check-in");
        return response.data;
    },
    claimProblemReward: async (problemId, difficulty) => {
        const response = await axiosInstance.post(`/rewards/problem/${problemId}`, { difficulty });
        return response.data;
    }
};
