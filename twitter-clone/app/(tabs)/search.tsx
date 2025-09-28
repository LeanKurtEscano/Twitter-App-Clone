import React, { useState, useEffect } from 'react';
import { Feather } from "@expo/vector-icons";
import { View, TextInput, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSearch } from '@/hooks/useSearch';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import CommentsModal from '@/components/CommentsModal';
import SearchTabs from '@/components/SearchTabs';
import { UserItem } from '@/components/UserCard';

const SearchScreen = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [hasSearched, setHasSearched] = useState(false);

  const { currentUser } = useCurrentUser();
  const { data, isLoading, setSearchQuery, searchQuery, refetchSearchPost } = useSearch(activeTab);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  console.log('Search data:', data);
  console.log('Data type:', typeof data);
  console.log('Is array?', Array.isArray(data));
  
  // Handle different possible data structures
  const searchResults = React.useMemo(() => {
    if (!data) return [];


    if (Array.isArray(data)) {
      return data;
    }

    if (data.posts && Array.isArray(data.posts)) {
      return data.posts;
    }

    console.warn('Unexpected data structure:', data);
    return [];
  }, [data]);

  const postMap: Map<string, Post> = activeTab === 'posts'
    ? new Map(searchResults.map((p: Post) => [p.id, p]))
    : new Map();

  const selectedPost = selectedPostId ? searchResults.find((p: Post) => p.id === selectedPostId) : null;

  const { toggleLike, deletePost, checkIsLiked } = usePosts();

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setHasSearched(true);
    }
  };

  // This useEffect will trigger the search when searchQuery changes
  useEffect(() => {
    if (hasSearched && searchQuery) {
      refetchSearchPost();
    }
  }, [searchQuery, hasSearched, refetchSearchPost, activeTab, setActiveTab]);

  const handleInputChange = (text: string) => {
    setSearchInput(text);
    if (text.trim() === '') {
      setHasSearched(false);
      setSearchQuery('');
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (searchQuery && hasSearched) {
      refetchSearchPost();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search Twitter"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={searchInput}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* NAVIGATION TABS - Only show when user has searched */}
      {hasSearched && (
        <SearchTabs activeTab={activeTab} setActiveTab={handleTabPress} />
      )}


      {!hasSearched && (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-center text-lg font-medium text-gray-400">
            Try Searching for people, topics, keywords
          </Text>
        </View>
      )}

      {/* SEARCH RESULTS */}
      {hasSearched && (
        <ScrollView className="flex-1">
          <View className="p-4">
            <Text className="text-gray-600 mb-4">
              Search results for: "{searchQuery}"
            </Text>

            {/* Loading State */}
            {isLoading && (
              <Text className="text-center text-gray-500 py-8">
                Loading...
              </Text>
            )}

            {/* Debug Info - Remove this in production */}
            <Text className="text-xs text-gray-400 mb-2">
              Debug: Found {searchResults.length} results, Tab: {activeTab}
            </Text>

            {/* No Results */}
            {!isLoading && searchResults.length === 0 && (
              <Text className="text-center text-gray-500 py-8">
                No results found for "{searchQuery}"
              </Text>
            )}

            {activeTab === "user" ? (
              <>
                {/* User search results - implement user cards here */}
                {searchResults.map((user: any) => (
                  <View key={user.id} className="p-2 border-b border-gray-100">
                    <UserItem user={user} key={user.id} />
                  </View>
                ))}
              </>
            ) : (
              <>
                {/* Post search results */}
                {searchResults.map((post: Post) => (
                  <View key={post.id}>
                    <PostCard
                      key={post.id}
                      onPostUpdate={refetchSearchPost} // Add 
                      post={post}
                      onLike={toggleLike}
                      onDelete={deletePost}
                      onComment={(post: Post) => setSelectedPostId(post.id)}
                      currentUser={currentUser}
                      isLiked={post.retweetOf ? checkIsLiked(post?.retweetOf.likes, currentUser) : checkIsLiked(post.likes, currentUser)}
                      postMap={postMap}
                    />
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      )}

      {/* Comments Modal - Move outside of ScrollView */}
      {selectedPost && (
        <CommentsModal
          selectedPost={selectedPost}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;