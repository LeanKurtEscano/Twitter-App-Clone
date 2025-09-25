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
import { UserItem } from "./UserCard";

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
                            {filteredUsers.map((user) => (
                                <UserItem key={user.id} user={user} />
                            ))}
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