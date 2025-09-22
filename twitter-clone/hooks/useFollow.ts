import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/config/axiosInstance";
const expo_url = process.env.EXPO_PUBLIC_IP_URL;
const useFollow = () => {
    const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
    const userApi = useApiClient(`${expo_url}/api/user`);
    const [header, setHeader] = useState('');
    const [apiUrl, setApiUrl] = useState('');


    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['followData', apiUrl],
        queryFn: async () => {
            const response = await userApi.get(apiUrl);
            return response.data;
        },
        enabled: !!apiUrl,
    });

    return {

        data,
        isLoading,
        error,
        refetch,
        isFollowModalVisible,
        openFollowModal: () => setIsFollowModalVisible(true),
        closeFollowModal: () => setIsFollowModalVisible(false),
        setHeader,
        header,
        apiUrl,
        setApiUrl,
    }
}

export default useFollow