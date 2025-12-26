import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { useAuth } from "@clerk/clerk-react";

export const useProfile = () => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const token = await getToken();
            const response = await axiosInstance.get("/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        refetchOnWindowFocus: true,
    });
};
