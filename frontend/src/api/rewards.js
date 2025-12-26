import axiosInstance from "../lib/axios";

export const rewardApi = {
    dailyCheckIn: async (token) => {
        const response = await axiosInstance.post("/rewards/check-in", {}, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },
    claimProblemReward: async (problemId, difficulty, token) => {
        const response = await axiosInstance.post(`/rewards/problem/${problemId}`, { difficulty }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    }
};
