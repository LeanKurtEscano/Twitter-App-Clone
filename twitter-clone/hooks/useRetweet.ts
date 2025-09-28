import { useApiClient } from "@/config/axiosInstance";
import { LikeUser } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";


const IP_URL = process.env.EXPO_PUBLIC_IP_URL;
export const useRetweet = () => {
  const postApi = useApiClient(`${IP_URL}/api/posts`);
  const {currentUser } = useCurrentUser();
  const queryClient = useQueryClient();


  const retweetPostMutation = useMutation({
    mutationFn: async ({ postId, comment }: { postId: string; comment?: string | null }) => {

      console.log("Retweeting postId:", postId, "with comment:", comment);
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
     queryClient.refetchQueries({ queryKey: ["search"], exact: false });
    },
  });

  return {
    handleRetweetPost: (postId: string, comment?: string) => retweetPostMutation.mutate({ postId, comment }),
  };
};
