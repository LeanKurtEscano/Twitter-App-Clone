import { Image, Text, TouchableOpacity, View } from "react-native";
import { User } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
import { router } from "expo-router";

interface UserItemProps {
  user: User;
}

export const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { currentUser } = useCurrentUser();
  const { followUser } = useProfile();
  

const goToUserProfile = (clerkId: string) => {
    router.push({
      pathname: "/(tabs)/user/[id]",
      params: { id: clerkId },
    });
  }
  const isFollowed = currentUser?.following?.some(
    (followedUser) => followedUser.followedId === user.id
  );
  const isUser = currentUser?.id === user.id;

  return (
    <TouchableOpacity
      key={user.id}
      className="flex-row items-center py-3 px-4"
      onPress={ () => isUser ? router.push("/(tabs)/profile") : goToUserProfile(user.clerkId) }
    >
      {/* Avatar */}
      <View className="mr-3">
        {user.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
            <Text className="text-gray-600 font-semibold text-lg">
              {user.firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="font-bold text-base text-black">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500 text-sm">@{user.username}</Text>
      </View>

      {/* Follow Button */}
      {!isUser && (
        <TouchableOpacity
          activeOpacity={0.8}
          className={`px-4 py-1.5 rounded-full border ${
            isFollowed ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-white"
          }`}
          onPress={() => followUser(user.id)}
        >
          <Text
            className={`font-medium text-sm ${
              isFollowed ? "text-white" : "text-black"
            }`}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
