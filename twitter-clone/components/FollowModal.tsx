import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Image,
} from "react-native";
import { User } from "@/types";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
interface FollowModalProps {
    isVisible: boolean;
    users: User[] | undefined;
    onClose: () => void;
    apiUrl: string;
    clerkId: string;
    header: string;
}

const FollowModal = ({
    header,
    apiUrl,
    isVisible,
    users,
    onClose,
    clerkId,
}: FollowModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const { followUser } = useProfile();
    const { currentUser } = useCurrentUser();


    console.log("Followers Modal users:", currentUser?.following);

    useEffect(() => {
        if (users) {
            const filtered = users.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [users, searchQuery]);

    const renderUserItem = (user: User) => {
        const isFollowed = currentUser?.following?.some(followedUser => followedUser.followedId === user.id);
        const isUser = currentUser?.id === user.id;
        return (
            <TouchableOpacity
                key={user.id}
                className="flex-row items-center py-3 px-4"
                onPress={() => {

                    console.log("Navigate to user:", user.username);
                }}
            >
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

                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text className="font-bold text-base text-black">
                            {user.firstName} {user.lastName}
                        </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">@{user.username}</Text>
                </View>
                {isUser ? (null) : (
                    <TouchableOpacity
                        activeOpacity={1}
                        className={`px-4 py-1.5 rounded-full border ${isFollowed
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300 bg-white'
                            }`}
                        onPress={() => {
                            followUser(user.id);
                        }}
                    >
                        <Text className={`font-medium text-sm ${isFollowed ? 'text-white' : 'text-black'
                            }`}>
                            {isFollowed ? 'Unfollow' : 'Follow'}
                        </Text>
                    </TouchableOpacity>

                )}


            </TouchableOpacity>

        )
    };

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">

                <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-blue-500 text-lg font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-black">{header}</Text>
                    <View className="w-16" />
                </View>

                <View className="px-4 py-3 border-b border-gray-100">
                    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                        <Text className="text-gray-400 mr-2">🔍</Text>
                        <TextInput
                            className="flex-1 text-base"
                            placeholder="Search people"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>


                <ScrollView className="flex-1">
                    {loading ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <ActivityIndicator size="large" color="#1DA1F2" />
                            <Text className="text-gray-500 mt-2">Loading...</Text>
                        </View>
                    ) : filteredUsers && filteredUsers.length > 0 ? (
                        <View className="py-2">
                            {filteredUsers.map(renderUserItem)}
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className="text-gray-500 text-lg">
                                {searchQuery ? "No users found" : "No users to show"}
                            </Text>
                            {searchQuery && (
                                <Text className="text-gray-400 text-sm mt-1">
                                    Try searching for a different name
                                </Text>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default FollowModal;