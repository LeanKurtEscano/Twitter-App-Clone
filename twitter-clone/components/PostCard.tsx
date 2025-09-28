import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/lib/util";
import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfileStore } from "@/store";
import { RetweetModal } from "./RetweetModal";
import { use, useState } from "react";
import { useRetweet } from "@/hooks/useRetweet";
import { useRetweetQuoteStore } from "@/store";
import QuoteRetweetModal from "./QuoteModal";
import { useRetweetModalStore } from "@/store";
interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
  postMap: Map<string, Post>;
  onPostUpdate?: () => void; // New prop for post update callback
  currentUser: User;
}

const PostCard = ({ currentUser, onDelete, onLike, post, isLiked, onComment, postMap, onPostUpdate }: PostCardProps) => {
  const isOwnPost = post.user.id === currentUser.id;
  const isOwnPostRetweet = post.retweetOf ? post.retweetOf.user.id === currentUser.id : false;
  const setSelectedUserClerkId = useUserProfileStore((state) => state.setSelectedUserClerkId);
  const setSelectedUsername = useUserProfileStore((state) => state.setSelectedUsername);
  const router = useRouter();
  const { handleRetweetPost } = useRetweet();

  const [isRetweetModalVisible, setIsRetweetModalVisible] = useState(false);
   
  const isVisible = useRetweetModalStore((state) => state.isVisible);
  const original = post.retweetOf ? postMap.get(post.retweetOf.id) : post;
   

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const clearRetweetQuote = useRetweetQuoteStore((state) => state.clearRetweetQuote);

  const hasRetweeted = Array.from(postMap.values()).some(
    p => p.retweetOf?.id === (post.retweetOf ? post.retweetOf.id : post.id) && p.user.id === currentUser.id
  )


  const noOfRetweets = Array.from(postMap.values()).filter(
    p => p.retweetOf?.id === (post.retweetOf ? post.retweetOf.id : post.id)
  ).length;






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

              {post.user.username} reposted

            </Text>

          </View>

          <View className="flex-row p-4">

            <TouchableOpacity activeOpacity={1} onPress={() => isOwnPost ? router.push("/(tabs)/profile") : goToUserProfile(post.user.clerkId)}>
              <Image
                source={{ uri: post.content ? post.user.profilePicture : post.retweetOf?.user.profilePicture || "" }}
                className="w-12 h-12 rounded-full mr-3"
              />
            </TouchableOpacity>

            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  <Text className="font-bold text-lg text-gray-900 mr-1">
                    {post.content ? post.user.firstName : post.retweetOf?.user.firstName} {post.content ? post.user.lastName : post.retweetOf?.user.lastName}
                  </Text>
                  <Text className="text-gray-500 text-lg ml-1">
                    @{post.content ? post.user.username : post.retweetOf?.user.username} · {formatDate(post.content ? post.createdAt : post.retweetOf?.createdAt)}
                  </Text>
                </View>
                {isOwnPost && (
                  <TouchableOpacity onPress={handleDelete}>
                    <Feather name="trash" size={20} color="#657786" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Quote retweet content - show retweeter's content if it exists */}
              {post.content && (
                <Text className="text-gray-900 text-base leading-5 mb-3">{post.content}</Text>
              )}

              {/* Conditional rendering for quote retweet vs regular retweet */}
              {post.content ? (
                // Quote retweet - wrap original post in a box
                <View className="border border-gray-200 rounded-2xl p-3 mb-3">
                  <View className="flex-row items-center mb-2">
                    <TouchableOpacity activeOpacity={1} onPress={() => isOwnPostRetweet ? router.push("/(tabs)/profile") : goToUserProfile(post.retweetOf?.user?.clerkId ?? "")}>
                      <Image
                        source={{ uri: post.retweetOf?.user.profilePicture || "" }}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    </TouchableOpacity>
                    <Text className="font-bold text-base text-gray-900 mr-1">
                      {post.retweetOf?.user.firstName} {post.retweetOf?.user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-base">
                      @{post.retweetOf?.user.username} · {formatDate(post.retweetOf?.createdAt)}
                    </Text>
                  </View>

                  {post?.retweetOf?.content && (
                    <Text className="text-gray-900 text-base leading-5 mb-2">{post.retweetOf.content}</Text>
                  )}

                  {post?.retweetOf?.image && (
                    <Image
                      source={{ uri: post.retweetOf.image }}
                      className="w-full h-48 rounded-xl"
                      resizeMode="cover"
                    />
                  )}
                </View>
              ) : (
                // Regular retweet - show original post content directly
                <>
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
                </>
              )}

              <View className="flex-row justify-between max-w-xs">
                <TouchableOpacity className="flex-row items-center" onPress={() => onComment(post.retweetOf!)}>
                  <Feather name="message-circle" size={18} color="#657786" />
                  <Text className="text-gray-500 text-sm ml-2">

                    {formatNumber(original?.comments?.length || 0)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  clearRetweetQuote();
                  setSelectedPostId(post.retweetOf ? post.retweetOf.id : post.id);
                  setIsRetweetModalVisible(true);

                }} className="flex-row items-center">
                  <Feather name="repeat" size={18} color={hasRetweeted ? "green" : "#657786"} />
                  <Text className="text-gray-500 text-sm ml-2">{formatNumber(noOfRetweets)} </Text>
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
              <TouchableOpacity className="flex-row items-center" onPress={() => {onComment(post); }}>
                <Feather name="message-circle" size={18} color="#657786" />
                <Text className="text-gray-500 text-sm ml-2">
                  {formatNumber(post.comments?.length || 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { 
                setIsRetweetModalVisible(true); clearRetweetQuote()
                 setSelectedPostId(post.retweetOf ? post.retweetOf.id : post.id);;
                 }} className="flex-row items-center">
                <Feather name="repeat" size={18} color={hasRetweeted ? "green" : "#657786"} />
                <Text className="text-gray-500 text-sm ml-2">{formatNumber(noOfRetweets)}</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} className="flex-row items-center" onPress={() => { onLike(post.id);  onPostUpdate?.();}}>
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
        postToQuote={post.retweetOf ? post.retweetOf : post}
        isVisible={isRetweetModalVisible}
        onPostUpdate={onPostUpdate}
        onClose={() => setIsRetweetModalVisible(false)}
        onRepost={() => post?.retweetOf ? handleRetweetPost(post.retweetOf.id) : handleRetweetPost(post.id)}

        isRetweeted={hasRetweeted}
      />  

      <QuoteRetweetModal
        isVisible={isVisible}
      />

    </View>
  );
};

export default PostCard;