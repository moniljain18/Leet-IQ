import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export const useProfile = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const response = await axiosInstance.get("/users/profile");
            return response.data;
        },
        staleTime: 1000, // 1 second - make it more dynamic
        refetchOnWindowFocus: true,
    });
};
