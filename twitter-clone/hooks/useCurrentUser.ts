import { useQuery } from "@tanstack/react-query"

import { useApiClient } from "@/config/axiosInstance"
import { useUser } from "@clerk/clerk-expo";



const IP_URL = process.env.EXPO_PUBLIC_IP_URL;
export const useCurrentUser = () => {

    const userApi = useApiClient(`${IP_URL}/api/user`);

    const clerkUser = useUser();


    const { data: currentUser, isLoading, error,refetch } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await userApi.get(`/me/${clerkUser.user?.id}`);
            return response.data;
        }
    });



    return { currentUser, isLoading, error, refetch};


}