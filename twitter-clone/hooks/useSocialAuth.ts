import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import { userAuthApi } from "@/config/apiConfig";
import { useUser } from "@clerk/clerk-expo";

export const useSocialAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { startSSOFlow } = useSSO();



    const handleSocialAuth = async (
        strategy: "oauth_google" | "oauth_apple"
    ) => {
        console.log("🔐 Starting social auth with strategy:", strategy);
        setIsLoading(true);

        try {
            console.log("🔄 Calling startSSOFlow...");
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });

            console.log("📝 SSO Flow result:", { createdSessionId: !!createdSessionId, setActive: !!setActive });

            if (createdSessionId && setActive) {
                console.log("✅ Setting active session...");
                await setActive({ session: createdSessionId });
            }
        } catch (err: any) {
            console.error("❌ Error in social auth:", err);
            console.error("📋 Auth error details:", {
                message: err.message,
                name: err.name,
                stack: err.stack
            });

            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert(
                "Error",
                `Failed to sign in with ${provider}. Please try again.`
            );
        } finally {
            console.log("🏁 Social auth process completed");
            setIsLoading(false);
        }
    };

    return { isLoading, handleSocialAuth};
};