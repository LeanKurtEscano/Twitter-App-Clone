import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/lib/util";
import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfileStore } from "@/store";
import { RetweetModal } from "./RetweetModal";
import { useState } from "react";
import { useRetweet } from "@/hooks/useRetweet";
interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
 postMap: Map<string, Post>;

  currentUser: User;
}

const PostCard = ({ currentUser, onDelete, onLike, post, isLiked, onComment, postMap }: PostCardProps) => {
  const isOwnPost = post.user.id === currentUser.id;
  const setSelectedUserClerkId = useUserProfileStore((state) => state.setSelectedUserClerkId);
  const setSelectedUsername = useUserProfileStore((state) => state.setSelectedUsername);
  const router = useRouter();

  const { handleRetweetPost } = useRetweet();

  const [isRetweetModalVisible, setIsRetweetModalVisible] = useState(false);
  
   const original = post.retweetOf ? postMap.get(post.retweetOf.id) : post
  const handleQuote = () => {



  }

  const goToUserProfile = (clerkId: string) => {
    setSelectedUserClerkId(clerkId);
    setSelectedUsername(post.user.username);
    router.push({
      pathname: "/(tabs)/user/[id]",
      params: { id: clerkId },
    });
  }


  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(post.id),
      }
    ]);
  };

  return (
    <View className="border-b border-gray-100 bg-white">

      {post.retweetOf ? (

        <View className="relative pt-3">
          <View className="flex-row items-center pt-3 absolute left-14 mb-1">
            <Feather name="repeat" size={14} color="#657786" />

            <Text className="text-gray-400 font-bold  text-md ml-1">

              {post.retweetOf?.user.firstName} {post.retweetOf?.user.lastName} reposted

            </Text>

          </View> 

          <View className="flex-row p-4">


            <TouchableOpacity activeOpacity={1} onPress={() => isOwnPost ? router.push("/(tabs)/profile") : goToUserProfile(post.user.clerkId)}>
              <Image
                source={{ uri: post.retweetOf?.user.profilePicture || "" }}
                className="w-12 h-12 rounded-full mr-3"
              />
            </TouchableOpacity>

            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  <Text className="font-bold text-lg text-gray-900 mr-1">
                    {post.retweetOf?.user.firstName} {post.retweetOf?.user.lastName}
                  </Text>
                  <Text className="text-gray-500 text-lg ml-1">
                    @{post.retweetOf?.user.username} · {formatDate(post.retweetOf?.createdAt)}
                  </Text>
                </View>
                {isOwnPost && (
                  <TouchableOpacity onPress={handleDelete}>
                    <Feather name="trash" size={20} color="#657786" />
                  </TouchableOpacity>
                )}
              </View>

              {post?.retweetOf?.content && (
                <Text className="text-gray-900 text-base leading-5 mb-3">{post.retweetOf.content}</Text>
              )}

              {post?.retweetOf?.image && (
                <Image
                  source={{ uri: post.retweetOf.image }}
                  className="w-full h-64 rounded-2xl mb-3"
                  resizeMode="cover"
                />
              )}

              <View className="flex-row justify-between max-w-xs">
                <TouchableOpacity className="flex-row items-center" onPress={() => onComment(post.retweetOf!)}>
                  <Feather name="message-circle" size={18} color="#657786" />
                  <Text className="text-gray-500 text-sm ml-2">
                   
                    {formatNumber(original?.comments?.length || 0)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsRetweetModalVisible(true)} className="flex-row items-center">
                  <Feather name="repeat" size={18} color="#657786" />
                  <Text className="text-gray-500 text-sm ml-2">0 </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} className="flex-row items-center" onPress={() => onLike(post.retweetOf!.id)}>
                  {isLiked ? (
                    <AntDesign name="heart" size={18} color={isLiked ? "red" : "#657786"} />
                  ) : (
                    <Feather name="heart" size={18} color="#657786" />
                  )}

                  <Text className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                    {formatNumber(post.retweetOf?.likes?.length || 0)} 
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Feather name="share" size={18} color="#657786" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>

      ) : (
        <View className="flex-row p-4">
          <TouchableOpacity activeOpacity={1} onPress={() => isOwnPost ? router.push("/(tabs)/profile") : goToUserProfile(post.user.clerkId)}>
            <Image
              source={{ uri: post.user.profilePicture || "" }}
              className="w-12 h-12 rounded-full mr-3"
            />
          </TouchableOpacity>

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <Text className="font-bold text-gray-900 mr-1">
                  {post.user.firstName} {post.user.lastName}
                </Text>
                <Text className="text-gray-500 ml-1">
                  @{post.user.username} · {formatDate(post.createdAt)}
                </Text>
              </View>
              {isOwnPost && (
                <TouchableOpacity onPress={handleDelete}>
                  <Feather name="trash" size={20} color="#657786" />
                </TouchableOpacity>
              )}
            </View>

            {post?.content && (
              <Text className="text-gray-900 text-base leading-5 mb-3">{post.content}</Text>
            )}

            {post?.image && (
              <Image
                source={{ uri: post.image }}
                className="w-full h-64 rounded-2xl mb-3"
                resizeMode="cover"
              />
            )}

            <View className="flex-row justify-between max-w-xs">
              <TouchableOpacity className="flex-row items-center" onPress={() => onComment(post)}>
                <Feather name="message-circle" size={18} color="#657786" />
                <Text className="text-gray-500 text-sm ml-2">
                  {formatNumber(post.comments?.length || 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsRetweetModalVisible(true)} className="flex-row items-center">
                <Feather name="repeat" size={18} color="#657786" />
                <Text className="text-gray-500 text-sm ml-2">0</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} className="flex-row items-center" onPress={() => onLike(post.id)}>
                {isLiked ? (
                  <AntDesign name="heart" size={18} color={isLiked ? "red" : "#657786"} />
                ) : (
                  <Feather name="heart" size={18} color="#657786" />
                )}

                <Text className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                  {formatNumber(post.likes?.length || 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Feather name="share" size={18} color="#657786" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      )}

      <RetweetModal
        isVisible={isRetweetModalVisible}
        onClose={() => setIsRetweetModalVisible(false)}
        onRepost={() => handleRetweetPost(post.id)}
        onQuote={handleQuote}
      />
    </View>
  );
};

export default PostCard;