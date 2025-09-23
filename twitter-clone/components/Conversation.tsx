import { useMessage } from "@/hooks/useMessage";
import { User } from "@/types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ConversationProps {
  profileUser: User | undefined;
  isChatOpen: boolean;
  closeChatModal: () => void;
  myUserId: string; 
}

const Conversation = ({ profileUser, isChatOpen, closeChatModal, myUserId }: ConversationProps) => {
  const { messages, newMessage, setNewMessage, sendMessage } = useMessage(
    myUserId,
    profileUser?.id ?? ""
  );

  return (
    <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          <TouchableOpacity onPress={closeChatModal} className="mr-3">
            <Feather name="arrow-left" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <Image source={{ uri: profileUser?.profilePicture }} className="size-10 rounded-full mr-3" />
          <View>
            <Text className="font-semibold text-gray-900">
              {profileUser?.firstName} {profileUser?.lastName}
            </Text>
            <Text className="text-gray-500 text-sm">@{profileUser?.username}</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 px-4 py-4">


           <Text className="text-center text-gray-400 text-sm mb-4">
                  This is the beginning of your conversation with {profileUser?.username}
                </Text>
          {messages.map((msg, idx) => (
            <View
              key={idx}
              className={`flex-row mb-3 ${msg.fromId === myUserId ? "justify-end" : ""}`}
            >
              {msg.fromId !== myUserId && (
                <Image source={{ uri: profileUser?.profilePicture }} className="size-8 rounded-full mr-2" />
              )}
              <View className={`max-w-xs ${msg.fromId === myUserId ? "items-end" : ""}`}>
                <View
                  className={`rounded-2xl px-4 py-3 ${
                    msg.fromId === myUserId ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <Text className={msg.fromId === myUserId ? "text-white" : "text-gray-900"}>
                    {msg.content}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3">
            <TextInput
              className="flex-1 text-base"
              placeholder="Start a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            className={`size-10 rounded-full items-center justify-center ${
              newMessage.trim() ? "bg-blue-500" : "bg-gray-300"
            }`}
            disabled={!newMessage.trim()}
          >
            <Feather name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default Conversation;
