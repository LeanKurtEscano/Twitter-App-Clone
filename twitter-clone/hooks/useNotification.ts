import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/config/axiosInstance";
import { useUser } from "@clerk/clerk-expo";
import { Notification } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { useCurrentUser } from "./useCurrentUser";
const IP_URL = process.env.EXPO_PUBLIC_IP_URL;

export const useNotifications = () => {
  const notificationApi = useApiClient(`${IP_URL}/api/notifications`);
  const queryClient = useQueryClient();
  const { currentUser:user  } = useCurrentUser();
  const { getToken } = useAuth();
  const eventSourceRef = useRef<any>(null);
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
      const response = await notificationApi.get(`/user/${user?.clerkId}`);
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

  // SSE Setup
  useEffect(() => {
    if (!user?.id) return;

    const setupSSE = async () => {
      try {
        const token = await getToken();
        
        // Import EventSource properly
        const EventSourceModule = require("react-native-sse");
        const EventSource = EventSourceModule.default || EventSourceModule;
        
        const eventSource = new EventSource(
          `${IP_URL}/api/notifications/stream/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
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
      } catch (error) {
        console.error("Error setting up SSE:", error);
      }
    };

    setupSSE();

    return () => {
      console.log("Closing SSE connection");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [user?.id, queryClient, getToken]);

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.patch(`/user/${user?.id}/read-all`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", user?.id] });
      {/* const previousNotifications = queryClient.getQueryData<Notification[]>([
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
      }*/}
      
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

    const markAllAsRead = () => markAllAsReadMutation.mutate();

  return {
    notifications: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    markAllAsRead,
    deleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};