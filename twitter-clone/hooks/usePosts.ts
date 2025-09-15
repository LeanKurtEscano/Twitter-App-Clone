import { useApiClient } from "@/config/axiosInstance";
import { useUser } from "@clerk/clerk-expo";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
export const usePosts = () => {

    const postApi = useApiClient("http://192.168.1.16:8080/api/posts");
    
    const user = useUser();
    const queryClient = useQueryClient();

    const { data: postsData, isLoading, error,refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await postApi.get('/');
            return response.data;
        }
    });

    const likePostMutation = useMutation({
        mutationFn: async (postId:String) => {
            const response = await postApi.post(`/${postId}/like`,{
                userClerkId: user.user?.id
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });

    
    const deletePostMutation = useMutation({
        mutationFn: async (postId:String) => {
            const response = await postApi.delete(`/${postId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['userPosts'] });
        }
    });


    const checkIsLiked = (postLikes:string[], currentUser:any) => {
        const isLiked = currentUser && postLikes.includes(currentUser.id);

        return isLiked;
    }

    return {
        posts: postsData || [],
        isLoading,
        error,
        refetch,
        toggleLike: (postId: string) => likePostMutation.mutate(postId),
        deletePost: (postId: string) => deletePostMutation.mutate(postId),
        checkIsLiked
    }

    
}

