import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: sessionApi.createSession,
        onSuccess: () => toast.success("Session created successfully!"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
    });

    return result;
};

export const useActiveSessions = () => {
    const result = useQuery({
        queryKey: ["activeSessions"],
        queryFn: sessionApi.getActiveSessions,
        refetchInterval: 3000, // Poll every 3 seconds
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        staleTime: 0, // Always consider data stale
    });

    return result;
};

export const useMyRecentSessions = (page = 1, limit = 10, days = 30, search = "") => {
    const result = useQuery({
        queryKey: ["myRecentSessions", page, limit, days, search],
        queryFn: () => sessionApi.getMyRecentSessions({ page, limit, days, search }),
    });

    return result;
};

export const useSessionById = (id) => {
    const result = useQuery({
        queryKey: ["session", id],
        queryFn: () => sessionApi.getSessionById(id),
        enabled: !!id,
        refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
    });

    return result;
};

export const useJoinByCode = () => {
    const result = useMutation({
        mutationKey: ["joinByCode"],
        mutationFn: sessionApi.joinByCode,
        onSuccess: () => toast.success("Joined session successfully!"),
        onError: (error) => toast.error(error.response?.data?.message || "Invalid or inactive invite code"),
    });

    return result;
};

export const useJoinSession = () => {
    const result = useMutation({
        mutationKey: ["joinSession"],
        mutationFn: sessionApi.joinSession,
        onSuccess: () => toast.success("Joined session successfully!"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
    });

    return result;
};

export const useLeaveSession = () => {
    const result = useMutation({
        mutationKey: ["leaveSession"],
        mutationFn: sessionApi.leaveSession,
        onSuccess: () => toast.success("Left session successfully!"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to leave session"),
    });

    return result;
};

export const useEndSession = () => {
    const result = useMutation({
        mutationKey: ["endSession"],
        mutationFn: sessionApi.endSession,
        onSuccess: () => toast.success("Session ended successfully!"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
    });

    return result;
};
