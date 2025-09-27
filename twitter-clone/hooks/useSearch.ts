

import { useQuery } from '@tanstack/react-query'

const ip_url = process.env.EXPO_PUBLIC_IP_URL;
import { useState } from 'react';
import { useApiClient } from '@/config/axiosInstance';

export const useSearch = (topic:string) => {
   const [hasSearched, setHasSearched] = useState(false);    
   const [searchQuery, setSearchQuery] = useState('');
  
  const apiService = topic === "user" ? useApiClient(`${ip_url}/api/user`) : useApiClient(`${ip_url}/api/posts`);
   
 const { data, isLoading, refetch, error, isError } = useQuery({
  queryKey: ['search', topic, searchQuery],
  queryFn: async () => {
    
    try {
      const response = await apiService.get( topic === "top" ? `/search?query=${searchQuery}&topic=${topic}` : `/search?query=${searchQuery}`);
      console.log('✅ Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Search error:', error);
     
      throw error;
    }
  },
  enabled: false
});




return { data, isLoading, refetchSearchPost: refetch, setSearchQuery, searchQuery, hasSearched, setHasSearched, error, isError};

};
