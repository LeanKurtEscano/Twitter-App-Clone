import { create } from "zustand";



interface ProfileViewState {
    selectedUsername: string | null;
    setSelectedUsername: (username: string | null) => void;
    selectedUserClerkId: string | null;
    setSelectedUserClerkId: (id: string | null) => void;
}


export const useUserProfileStore = create<ProfileViewState>((set) => ({
    selectedUserClerkId: null,
    selectedUsername: null,
    setSelectedUserClerkId: (id) => set({ selectedUserClerkId: id }),
    setSelectedUsername: (username) => set({ selectedUsername: username }),
}));                                   