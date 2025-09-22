import { useApiClient } from "@/config/axiosInstance";
import { LikeUser } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const IP_URL = process.env.EXPO_PUBLIC_IP_URL;
export const usePosts = (username?: string) => {
  const postApi = useApiClient(`${IP_URL}/api/posts`);
  const user = useUser();
  const queryClient = useQueryClient();


  const { data: postsData, isLoading: allLoading, error: allError, refetch: allRefetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await postApi.get("/allPosts");
      return response.data;
    },
    enabled: !username, 
  });


  const { data: userPostsData, isLoading: userLoading, error: userError, refetch: userPostRefetch } = useQuery({
    queryKey: ["posts", username],
    queryFn: async () => {
      if (!username) return [];
      const response = await postApi.get(`/user/${username}`);
      return response.data;
    },
    enabled: !!username, 
  });

 
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await postApi.post(`/${postId}/like`, {
        userClerkId: user.user?.id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) queryClient.invalidateQueries({ queryKey: ["posts", username] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await postApi.delete(`/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) queryClient.invalidateQueries({ queryKey: ["posts", username] });
    },
  });

  const checkIsLiked = (postLikes: LikeUser[], currentUser: any) => {
    return postLikes.some((user) => user.id === currentUser.id);
  };

  const posts = username ? userPostsData || [] : postsData || [];
  const isLoading = username ? userLoading : allLoading;
  const error = username ? userError : allError;
  const refetch = username ? userPostRefetch : allRefetch;

  return {
    posts,
    isLoading,
    error,
    refetch,
    toggleLike: (postId: string) => likePostMutation.mutate(postId),
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    checkIsLiked,
  };
};
