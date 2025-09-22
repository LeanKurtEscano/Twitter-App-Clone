// utils/userSync.ts
import { userAuthApi } from "@/config/apiConfig";
import { Alert } from "react-native";

export const syncUserDataToBackend = async (userData: any, strategy: string) => {
    console.log("🚀 syncUserDataToBackend called with:", { userData: userData?.id, strategy });

    try {
        const provider =
            strategy === "oauth_google"
                ? "google"
                : strategy === "oauth_apple"
                    ? "apple"
                    : "unknown";

        const json_data = {
            clerkUserId: userData.id,
            email: userData.emailAddresses[0]?.emailAddress,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImage: userData.imageUrl,
            provider,
        };

        console.log("📤 Sending data to backend:", json_data);
        console.log("🌐 API endpoint:", "/register");

        const response = await userAuthApi.post("/register", json_data);

        console.log("✅ Backend response:", response.data);
        console.log("📊 Response status:", response.status);

        return response.data;
    } catch (error: any) {
        console.error("❌ Error syncing user data:", error);
        console.error("📋 Error details:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
}