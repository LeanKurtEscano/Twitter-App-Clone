import { useQuery } from "@tanstack/react-query"

import { useApiClient } from "@/config/axiosInstance"
import { useUser } from "@clerk/clerk-expo";
export const useCurrentUser = () => {

    const userApi = useApiClient("http://192.168.1.16:8080/api/user");
    
    const clerkUser = useUser();

    console.log("Clerk User ID:", clerkUser.user?.id);
    const { data: currentUser, isLoading, error,refetch } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await userApi.get(`/me/${clerkUser.user?.id}`);
            return response.data;
        }
    });

    console.log("Error fetching current user:", error);

   

    return { currentUser, isLoading, error, refetch};


}