import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,

} from 'react-native';
import { formatDate } from '@/lib/util';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRetweetModalStore } from '@/store';
import { useRetweetQuoteStore } from '@/store';

import { useRetweet } from '@/hooks/useRetweet';
import { Post } from '@/types';

interface QuoteModalProps {
     isVisible?: boolean;
      
}

const QuoteRetweetModal = ({ isVisible}: QuoteModalProps) => {
    const { handleRetweetPost } = useRetweet();
    const { currentUser } = useCurrentUser();
    const [comment, setComment] = useState('');
    const { closeModal } = useRetweetModalStore();
    const post = useRetweetQuoteStore((state) => state.post);
    const clearRetweetQuote = useRetweetQuoteStore((state) => state.clearRetweetQuote);
    const handleRetweetPostWithComment = () => {
        handleRetweetPost(post?.id, comment);
        clearRetweetQuote();
        closeModal();
    }

    const handleClose = () => {
        clearRetweetQuote();
        closeModal();
    };


    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <SafeAreaView className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200 bg-white">
                    <TouchableOpacity onPress={handleClose}>
                        <Text className="text-gray-600 text-lg font-normal">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRetweetPostWithComment}
                        className={`px-6 py-2 rounded-full ${comment.trim() ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        disabled={!comment.trim()}
                    >
                        <Text className={`text-base font-bold ${comment.trim() ? 'text-white' : 'text-gray-500'
                            }`}>
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-4 bg-white" showsVerticalScrollIndicator={false}>
                    {/* User input area */}
                    <View className="flex-row pt-4 pb-4 gap-3">
                        <Image
                            source={{ uri: currentUser?.profilePicture }}
                            className="w-12 h-12 rounded-full"
                        />
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Add a comment..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-gray-900 text-xl min-h-[80px] font-normal"
                            multiline
                            textAlignVertical="top"
                            style={{ fontSize: 20, lineHeight: 24 }}
                        />
                    </View>

                    {/* Quoted post */}
                    <View className="border border-gray-300 rounded-2xl p-4 ml-15 mb-4 bg-white">
                        <View className="flex-row gap-3">
                            <Image
                                source={{ uri: post?.user.profilePicture }}
                                className="w-6 h-6 rounded-full"
                            />
                            <View className="flex-1">
                                <View className="flex-row items-center gap-1 mb-2">
                                    <Text className="font-bold text-gray-900 text-base">
                                        {post?.user.firstName} {post?.user.lastName}
                                    </Text>

                                    <Text className="text-gray-500 text-base ml-1">
                                        @{post?.user.username}
                                    </Text>
                                    <Text className="text-gray-500 text-base mx-1">·</Text>
                                    <Text className="text-gray-500 text-base">{formatDate(post?.createdAt)}</Text>
                                </View>

                                <Text className="text-gray-900 text-base leading-normal mb-3">
                                    {post?.content}
                                </Text>

                                {post?.image && (
                                    <Image
                                        source={{ uri: post.image }}
                                        className="w-full rounded-2xl"
                                        style={{ aspectRatio: 16 / 9, maxHeight: 240 }}
                                        resizeMode="cover"
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default QuoteRetweetModal;