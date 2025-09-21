import { useApiClient } from "@/config/axiosInstance";
import { LikeUser } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";

export const useRetweet = () => {
  const postApi = useApiClient("http://192.168.1.16:8080/api/posts");
  const {currentUser } = useCurrentUser();
  const queryClient = useQueryClient();


  const retweetPostMutation = useMutation({
    mutationFn: async ({ postId, comment }: { postId: string; comment?: string | null }) => {
      const response = await postApi.post(`/${postId}/retweet`, {
        userId: currentUser?.id,
        comment: comment || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
       queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return {
    handleRetweetPost: (postId: string, comment?: string) => retweetPostMutation.mutate({ postId, comment }),
  };
};
