import { useClerk } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const useSignOut = (clerkId: String) => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          AsyncStorage.removeItem(`synced_${clerkId}`);
          signOut();
        },

      },
    ]);
  };

  return { handleSignOut };
};