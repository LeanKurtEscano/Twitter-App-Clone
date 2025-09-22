import { use, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { useApiClient } from "@/config/axiosInstance";
import { useUser } from "@clerk/clerk-expo";


const IP_URL = process.env.EXPO_PUBLIC_IP_URL;

export const useComments = () => {
  const [commentText, setCommentText] = useState("");
  const commentsApi = useApiClient(`${IP_URL}/api/comments`);
  const clerkUser = useUser();
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {

        const response = await commentsApi.post("/comment",
             { clerkUserId: clerkUser?.user?.id, postId:postId, content: content });
        return response.data;
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to post comment. Try again.");
    },
  });

  const createComment = (postId: string) => {
    if (!commentText.trim()) {
      Alert.alert("Empty Comment", "Please write something before posting!");
      return;
    }

    createCommentMutation.mutate({ postId, content: commentText.trim() });
  };

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => { 
      const response = await commentsApi.delete(`/${commentId}`);   
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
    deleteComment: (commentId: string) => deleteMutation.mutate(commentId),
  };
};