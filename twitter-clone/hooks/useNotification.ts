import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/config/axiosInstance";
import { useUser } from "@clerk/clerk-expo";

export const useNotifications = () => {
  const notificationApi = useApiClient("http://192.168.1.16:8080/api/notifications");
  const queryClient = useQueryClient();
  const user = useUser();
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.get(`/user/${user.user?.id}`),
    select: (res) => res.data,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationApi.delete(`/${notificationId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    notifications: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};