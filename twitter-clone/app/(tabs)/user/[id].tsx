import EditProfileModal from "@/components/EditProfileModal";
import PostsList from "@/components/PostsList";
import SignOutButton from "@/components/SignOutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import useFollow from "@/hooks/useFollow";
import FollowModal from "@/components/FollowModal";
import { Followers } from "@/types";
import Conversation from "@/components/Conversation";
const UserProfileScreen = () => {

  const insets = useSafeAreaInsets();
   
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const {
    isFollowModalVisible,
    openFollowModal,
    closeFollowModal,
    setHeader,
    header,
    setApiUrl,
    apiUrl,
    data,

  } = useFollow();

  const {
    profileUser,
    isLoading: isProfileLoading,
    error,
    userPostsData,
    userPostsLoading,
    userPostsError,
    userPostRefetch,
    followUser,
    refetchProfileUser
  } = useProfile();

  if (isProfileLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }



  const handleFollow = (userId: string) => {
    followUser(userId);
    Alert.alert("Followed", `You are now following ${profileUser?.username}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {profileUser?.firstName} {profileUser?.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">{userPostsData?.length} Posts</Text>
        </View>
        <SignOutButton />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={userPostsLoading}
            onRefresh={() => {
              refetchProfileUser();
              userPostRefetch();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              profileUser?.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: profileUser?.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />

            {/* Container for both buttons */}
            <View className="flex-row gap-2 pb-3 items-center">
              {/* Mail Button */}
              <TouchableOpacity
              onPress={() => setIsChatOpen(true)}
                className="bg-[#1DA1F2] rounded-full p-1.5 active:bg-blue-600"
                activeOpacity={1}
              >
                <View className="items-center justify-center">
                  <Ionicons
                    name="mail"
                    size={19}
                    color="white"
                  />
                </View>
              </TouchableOpacity>

              {/* Follow Button */}
              <TouchableOpacity
                className="bg-[#1DA1F2] rounded-full px-5 py-2"
                activeOpacity={1}
                onPress={() => {
                  handleFollow(profileUser?.id);
                }}
              >
                <Text className="text-white font-bold text-sm">
                  {profileUser?.followers?.some((follower: Followers) => follower.followerId === currentUser?.id) ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {profileUser?.firstName} {profileUser?.lastName}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <View className="flex-row items-center mb-1">
              <Text className="text-gray-500 mr-2 ">@{profileUser?.username}</Text>

              {currentUser?.followers?.some((follower: Followers) => follower.followerId === profileUser?.id) && (
                <Text className="text-md  bg-slate-100 p-1 font-medium text-[#6e767d]">
                  Follows you
                </Text>

              )}


            </View>




            <Text className="text-gray-900 mb-3">{profileUser?.bio}</Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{profileUser?.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(profileUser?.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity onPress={() => {
                setHeader("Following");
                setApiUrl(`/${profileUser.id}/following`);
                openFollowModal();

              }} className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">{profileUser.following?.length}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setHeader("Followers");
                setApiUrl(`/${profileUser.id}/followers`);
                openFollowModal();
              }}>
                <Text className="text-gray-900">
                  <Text className="font-bold">{profileUser.followers?.length}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={profileUser?.username} />
      </ScrollView>

      <FollowModal
        isVisible={isFollowModalVisible}
        onClose={closeFollowModal}
        apiUrl={apiUrl}
        users={data}
        clerkId={currentUser?.clerkId!}
        header={header}
      />

      <Conversation
      isChatOpen={isChatOpen}
      closeChatModal={() => setIsChatOpen(false)}
        profileUser={profileUser}
        myUserId={currentUser?.id!}
      />
    </SafeAreaView>
  );
};

export default UserProfileScreen;