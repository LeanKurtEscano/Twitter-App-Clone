import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useApiClient } from "@/config/axiosInstance";

export const useCreatePost = () => {
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const queryClient = useQueryClient();


    const createPostMutation = useMutation({
         mutationFn: async (postData: { content: string; imageUri: string | null }) => {
            const formData = new FormData();

            const postApi = useApiClient("http://192.168.1.16:8080/api/posts");

            if(postData.content) formData.append("content", postData.content);
            if(postData.imageUri) {
                const uriParts= postData.imageUri.split('.');
                const fileType = uriParts[uriParts.length - 1].toLowerCase();

                const mimeTypeMap: Record<string, string> = {
                   
                    png: 'image/png',
                    gif: 'image/gif',
                    webp:'image/webp'
                };


                const mimeType = mimeTypeMap[fileType] || 'image/jpeg';

                formData.append("image", {
                    uri: postData.imageUri,
                    name: `image.${fileType}`,
                    type: mimeType
                } as any);

                  return postApi.post("/posts", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            }

    },

        onSuccess: () => {
            setContent("");
            setSelectedImage(null);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            Alert.alert("Success", "Post created successfully!");
        },
        onError: (error: any) => {
            console.error("Error creating post:", error);
            Alert.alert("Error", "There was an issue creating your post. Please try again.");
        }
    });

    const handleImagePicker = async (useCamera: boolean = false) => {
        const permissionResult = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();


            if(permissionResult.status !== 'granted') {
                const source = useCamera ? 'camera' : 'photo library';
                Alert.alert("Permission needed", `Please grant permission to access your ${source}`);
                return;
            }

            const pickerOptions = {
                allowsEditing: true,
                aspect: [16, 9] as [number, number],
                quality: 0.8,
            }

            const result = useCamera
                ? await ImagePicker.launchCameraAsync(pickerOptions)
                : await ImagePicker.launchImageLibraryAsync({
                    ...pickerOptions, mediaTypes: ["images"],
                });


            if(!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }


         


    }

     const createPost = () => {
                if(!content.trim() && !selectedImage) {
                    Alert.alert("Empty Post", "Please write something or select an image before.");
                    return;
                }


                const postData: { content: string, imageUri: string } = {
                    content: content.trim(),
                };


                if(selectedImage) {
                    postData.imageUri = selectedImage;
                }

            createPostMutation.mutate(postData);
        }

        return {
            content,
            setContent,
            selectedImage,
            isCreating: createPostMutation.isPending,
            pickImageFromGallery: () => handleImagePicker(false),
            takePhoto: () => handleImagePicker(true),
            removeImage : () => setSelectedImage(null),
            createPost
        }
}