import { create } from "zustand";

import { AppComment, Post } from "@/types";
import { User } from "@/types";


interface ProfileViewState {
    selectedUsername: string | null;
    setSelectedUsername: (username: string | null) => void;
    selectedUserClerkId: string | null;
    setSelectedUserClerkId: (id: string | null) => void;
}

interface RetweetModalState {
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}
interface SearchState {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
} 


interface RetweetQuoteState {
  post: Post | null;               
  storeRetweetQuote: (post: Post | null) => void;
  
  clearRetweetQuote: () => void; 
}



export const useUserProfileStore = create<ProfileViewState>((set) => ({
    selectedUserClerkId: null,
    selectedUsername: null,
    setSelectedUserClerkId: (id) => set({ selectedUserClerkId: id }),
    setSelectedUsername: (username) => set({ selectedUsername: username }),
}));             


export const useSearchStore = create<SearchState>((set) => ({
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),
}));

export const useRetweetQuoteStore = create<RetweetQuoteState>((set) => ({
  post: null, 

  storeRetweetQuote: (post) => set({ post }),
  clearRetweetQuote: () => set({ post: null }), 
}));



export const useRetweetModalStore = create<RetweetModalState>((set) => ({
  isVisible: false,
  openModal: () => set({ isVisible: true }),
  closeModal: () => set({ isVisible: false }),
}));