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
        return `liked your post`;
      case "comment":
        return `commented on your post`;
      case "follow":
        return `started following you`;
      default:
        return "";
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return { icon: "heart", color: "#E0245E", bg: "#FEE2E2" };
      case "comment":
        return { icon: "message-circle", color: "#1DA1F2", bg: "#DBEAFE" };
      case "follow":
        return { icon: "user-plus", color: "#10B981", bg: "#D1FAE5" };
      default:
        return { icon: "bell", color: "#6B7280", bg: "#F3F4F6" };
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
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const iconConfig = getNotificationIcon();

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`border-b border-gray-200 ${notification.isRead ? 'bg-white' : 'bg-blue-50/50'}`}
    >
      <View className="flex-row items-start px-4 py-3">
        {/* Unread indicator dot - Larger and better positioned */}
        {!notification.isRead && (
          <View className="pt-2 pr-2">
            <View className="size-2.5 rounded-full bg-blue-500" />
          </View>
        )}

        {/* Profile Picture with Icon Badge */}
        <View className="relative mr-3">
          <Image
            source={{ uri: notification.from.profilePicture }}
            className="size-12 rounded-full bg-gray-200"
          />
          
          {/* Icon Badge - Better positioning and sizing */}
          <View 
            className="absolute -bottom-0.5 -right-0.5 size-7 rounded-full items-center justify-center border-2 border-white"
            style={{ backgroundColor: iconConfig.bg }}
          >
            <Feather name={iconConfig.icon as any} size={14} color={iconConfig.color} />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 pt-0.5">
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1 pr-2">
              <Text className="text-gray-900 leading-5">
                <Text className={`font-semibold text-[15px] ${!notification.isRead ? 'text-gray-900' : 'text-gray-800'}`}>
                  {notification.from.firstName} {notification.from.lastName}
                </Text>
                <Text className="text-gray-500 text-[15px]"> {getNotificationText()}</Text>
              </Text>
              
              <Text className="text-gray-400 text-xs mt-0.5">
                @{notification.from.username} · {formatDate(notification.createdAt)}
              </Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity 
              className="p-2 -mr-2 -mt-1" 
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Post Preview */}
          {notification.post && (
            <View className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-2">
              <Text className="text-gray-700 text-[13px] leading-5" numberOfLines={3}>
                {notification.post.content}
              </Text>
              {notification.post.image && (
                <Image
                  source={{ uri: notification.post.image }}
                  className="w-full h-32 rounded-lg mt-2 bg-gray-200"
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {/* Comment Preview */}
          {notification.comment && (
            <View className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 mt-2">
              <View className="flex-row items-center mb-1">
                <Feather name="message-square" size={12} color="#60A5FA" />
                <Text className="text-blue-600 text-xs font-medium ml-1">Comment</Text>
              </View>
              <Text className="text-gray-700 text-[13px] leading-5" numberOfLines={2}>
                &ldquo;{notification.comment.content}&rdquo;
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;