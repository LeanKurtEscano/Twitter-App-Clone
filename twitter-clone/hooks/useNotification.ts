import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/config/axiosInstance";
import { useUser } from "@clerk/clerk-expo";
import { Notification } from "@/types";

const IP_URL = process.env.EXPO_PUBLIC_IP_URL;

export const useNotifications = () => {
  const notificationApi = useApiClient(`${IP_URL}/api/notifications`);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasMarkedAsRead = useRef(false);

  // Fetch initial notifications
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Notification[]>({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const response = await notificationApi.get(`/user/${user?.id}`);
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Mark all as read when notifications are loaded
  useEffect(() => {
    if (notificationsData && !hasMarkedAsRead.current && user?.id) {
      const unreadNotifications = notificationsData.filter(n => !n.isRead);
      
      if (unreadNotifications.length > 0) {
        hasMarkedAsRead.current = true;
        markAllAsReadMutation.mutate();
      }
    }
  }, [notificationsData, user?.id]);

 
  useEffect(() => {
    if (!user?.id) return;

    const EventSource = require("react-native-sse");
    
    const eventSource = new EventSource(
      `${IP_URL}/api/notifications/stream/${user.id}`,
      {
        headers: {
          
        },
      }
    );

    eventSource.addEventListener("connected", (event: any) => {
      console.log("SSE Connected:", event.data);
    });

    eventSource.addEventListener("notification", (event: any) => {
      const newNotification: Notification = JSON.parse(event.data);
      console.log("New notification received:", newNotification);
      
      // Add new notification to the top of the list
      queryClient.setQueryData<Notification[]>(
        ["notifications", user.id],
        (old = []) => [newNotification, ...old]
      );
    });

    eventSource.addEventListener("error", (event: any) => {
      console.error("SSE Error:", event);
    });

    eventSourceRef.current = eventSource;

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, [user?.id, queryClient]);

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.patch(`/user/${user?.id}/read-all`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", user?.id] });
      
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
        user?.id,
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          ["notifications", user?.id],
          previousNotifications.map((n) => ({ ...n, isRead: true }))
        );
      }

      return { previousNotifications };
    },
    onError: (err, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", user?.id],
          context.previousNotifications
        );
      }
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.delete(`/${notificationId}`),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", user?.id] });
      
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
        user?.id,
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          ["notifications", user?.id],
          previousNotifications.filter((n) => n.id !== notificationId)
        );
      }

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", user?.id],
          context.previousNotifications
        );
      }
    },
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