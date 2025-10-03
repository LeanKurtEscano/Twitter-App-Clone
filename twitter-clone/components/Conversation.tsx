import { useMessage } from "@/hooks/useMessage";
import { User } from "@/types";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
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
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    sendMessage();
    // Optionally scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

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
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-center text-gray-400 text-sm">
                This is the beginning of your conversation with @{profileUser?.username}
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-center text-gray-400 text-sm mb-4">
                This is the beginning of your conversation with @{profileUser?.username}
              </Text>
              {messages.map((msg, idx) => (
                <View
                  key={`${msg.timestamp}-${idx}`}
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
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
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
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
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