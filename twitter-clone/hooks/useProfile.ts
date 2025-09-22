import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/config/axiosInstance";
import { useCurrentUser } from "./useCurrentUser";
import { useUser } from "@clerk/clerk-expo";
import { useUserProfileStore } from "@/store";



const IP_URL = process.env.EXPO_PUBLIC_IP_URL;
export const useProfile = () => {
  const profileApi = useApiClient(`${IP_URL}/api/user`);
  const userApi = useApiClient(`${IP_URL}/api/user`);
  const postApi = useApiClient(`${IP_URL}/api/posts`);
  const selectedUsername = useUserProfileStore(
    (state) => state.selectedUsername
  );
  const selectedUserClerkId = useUserProfileStore(
    (state) => state.selectedUserClerkId
  );
  const queryClient = useQueryClient();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });

  const useUser1 = useUser();
  
  const { currentUser } = useCurrentUser();

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => profileApi.put(`/profile/${useUser1.user?.id}`, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
    },
  });

   const { data: userPostsData, isLoading: userPostsLoading, error: userPostsError, refetch: userPostRefetch } = useQuery({
    queryKey: ["userProfileposts"],
    queryFn: async () => {
    
      const response = await postApi.get(`/user/${selectedUsername}`);
      return response.data;
    }
  });


    const { data: profileUser, isLoading, error,refetch } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await userApi.get(`/me/${selectedUserClerkId}`);
            return response.data;
        }
    });


    


    const followMutation = useMutation({
      mutationFn: (userId: string) => userApi.post(`/${currentUser?.id}/follow/${userId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      },
    })

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    profileUser,
    isLoading,
    error,
    userPostsData,
     userPostsLoading,
    userPostsError,
    userPostRefetch,
    refetchProfileUser: refetch,
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    followUser : (userId: string) => followMutation.mutate(userId),
  };
};