import axiosInstance from "../lib/axios";

export const sessionApi = {
    createSession: async (data) => {
        const response = await axiosInstance.post("/sessions", data);
        return response.data;
    },

    getActiveSessions: async () => {
        const response = await axiosInstance.get("/sessions/active");
        return response.data;
    },
    getMyRecentSessions: async (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 10,
            days: params.days || 30,
            search: params.search || "",
        }).toString();
        const response = await axiosInstance.get(`/sessions/my-recent?${query}`);
        return response.data;
    },

    getSessionById: async (id) => {
        const response = await axiosInstance.get(`/sessions/${id}`);
        return response.data;
    },

    joinSession: async (id) => {
        const response = await axiosInstance.post(`/sessions/${id}/join`);
        return response.data;
    },
    joinByCode: async (inviteCode) => {
        const response = await axiosInstance.post(`/sessions/join-by-code`, { inviteCode });
        return response.data;
    },
    leaveSession: async (id) => {
        const response = await axiosInstance.post(`/sessions/${id}/leave`);
        return response.data;
    },
    endSession: async (id) => {
        const response = await axiosInstance.post(`/sessions/${id}/end`);
        return response.data;
    },
    getStreamToken: async () => {
        const response = await axiosInstance.get(`/chat/token`);
        return response.data;
    },
};
