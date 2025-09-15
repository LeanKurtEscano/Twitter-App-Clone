import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert,Linking } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { useApiClient } from "@/config/axiosInstance";

export const useCreatePost = () => {
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
     const { user } = useUser();
    const queryClient = useQueryClient();

    const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL;
    const CLOUDINARY_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET;
     const postApi = useApiClient("http://192.168.1.16:8080/api/posts");
     const uploadToCloudinary = async (imageUri: string): Promise<string> => {
        try {
            const formData = new FormData();
        
            const uriParts = imageUri.split('.');
            const fileType = uriParts[uriParts.length - 1].toLowerCase();
            
            formData.append('file', {
                uri: imageUri,
                type: `image/${fileType}`,
                name: `upload.${fileType}`,
            } as any);
            
            formData.append('upload_preset', CLOUDINARY_PRESET ?? "");
            

            const response = await fetch(CLOUDINARY_URL ?? "", {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.secure_url; 
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    };


    const createPostMutation = useMutation({
         mutationFn: async (postData: { content: string; imageUri: string | null }) => {
         

           

             let imageUrl: string | null = null;

                 if (postData.imageUri) {
                imageUrl = await uploadToCloudinary(postData.imageUri);
              
            }

              const requestData = {
                clerkUserId: user?.id,
                content: postData.content,
                image: imageUrl,
            };

            const response = await postApi.post("/posts", requestData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response;
          

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
        try {
          
            const currentPermission = useCamera
                ? await ImagePicker.getCameraPermissionsAsync()
                : await ImagePicker.getMediaLibraryPermissionsAsync();

            let permissionResult = currentPermission;

         
            if (currentPermission.status !== 'granted') {
                permissionResult = useCamera
                    ? await ImagePicker.requestCameraPermissionsAsync()
                    : await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            // Handle permission denial
            if (permissionResult.status !== 'granted') {
                const source = useCamera ? 'camera' : 'photo library';
                
                // Check if user denied with "Don't ask again"
                if (!permissionResult.canAskAgain) {
                    Alert.alert(
                        "Permission Required",
                        `Permission to access ${source} was permanently denied. Please enable it in your device settings.`,
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Open Settings", onPress: () => Linking.openSettings() }
                        ]
                    );
                } else {
                    Alert.alert(
                        "Permission needed", 
                        `Please grant permission to access your ${source}`
                    );
                }
                return; // Important: Return early to prevent further execution
            }

            const pickerOptions: ImagePicker.ImagePickerOptions = {
                allowsEditing: true,
                aspect: [16, 9] as [number, number],
                quality: 0.8,
            };

            const result = useCamera
                ? await ImagePicker.launchCameraAsync(pickerOptions)
                : await ImagePicker.launchImageLibraryAsync({
                    ...pickerOptions, 
                    mediaTypes: ["images"],
                });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
            }

        } catch (error) {
            console.error("Error in image picker:", error);
            Alert.alert("Error", "Something went wrong while accessing the image picker.");
        }
    };


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