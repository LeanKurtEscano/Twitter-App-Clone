import { Notification } from "@/types";
import { formatDate } from "@/lib/util";
import { Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";

interface NotificationCardProps {
  notification: Notification;
  onDelete: (notificationId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onDelete, onMarkAsRead }: NotificationCardProps) => {
  const getNotificationText = () => {
    const name = `${notification.from.firstName} ${notification.from.lastName}`;
    switch (notification.type) {
      case "like":
        return `${name} liked your post`;
      case "comment":
        return `${name} commented on your post`;
      case "follow":
        return `${name} started following you`;
      default:
        return "";
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return <Feather name="heart" size={20} color="#E0245E" />;
      case "comment":
        return <Feather name="message-circle" size={20} color="#1DA1F2" />;
      case "follow":
        return <Feather name="user-plus" size={20} color="#17BF63" />;
      default:
        return <Feather name="bell" size={20} color="#657786" />;
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(notification.id),
      },
    ]);
  };

  const handlePress = () => {
    // Mark as read when tapped
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`border-b border-gray-100 ${notification.isRead ? 'bg-white' : 'bg-blue-50/30'}`}
    >
      <View className="flex-row p-4">
        {/* Unread indicator dot */}
        {!notification.isRead && (
          <View className="absolute left-2 top-1/2 -translate-y-1/2">
            <View className="size-2 rounded-full bg-blue-500" />
          </View>
        )}

        <View className="relative mr-3 ml-2">
          <Image
            source={{ uri: notification.from.profilePicture }}
            className="size-12 rounded-full"
          />

          <View className="absolute -bottom-1 -right-1 size-6 rounded-full bg-white items-center justify-center shadow-sm">
            {getNotificationIcon()}
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1">
              <Text className="text-gray-900 text-base leading-5 mb-1">
                <Text className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                  {notification.from.firstName} {notification.from.lastName}
                </Text>
                <Text className="text-gray-500"> @{notification.from.username}</Text>
              </Text>
              <Text className={`text-sm mb-2 ${!notification.isRead ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>
                {getNotificationText()}
              </Text>
            </View>

            <TouchableOpacity className="ml-2 p-1" onPress={handleDelete}>
              <Feather name="trash" size={16} color="#E0245E" />
            </TouchableOpacity>
          </View>

          {notification.post && (
            <View className="bg-gray-50 rounded-lg p-3 mb-2">
              <Text className="text-gray-700 text-sm mb-1" numberOfLines={3}>
                {notification.post.content}
              </Text>
              {notification.post.image && (
                <Image
                  source={{ uri: notification.post.image }}
                  className="w-full h-32 rounded-lg mt-2"
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {notification.comment && (
            <View className="bg-blue-50 rounded-lg p-3 mb-2">
              <Text className="text-gray-600 text-xs mb-1">Comment:</Text>
              <Text className="text-gray-700 text-sm" numberOfLines={2}>
                &ldquo;{notification.comment.content}&rdquo;
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-xs">{formatDate(notification.createdAt)}</Text>
            
            {!notification.isRead && (
              <View className="flex-row items-center">
                <View className="size-1.5 rounded-full bg-blue-500 mr-1" />
                <Text className="text-blue-600 text-xs font-medium">New</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;