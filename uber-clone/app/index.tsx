import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from '@clerk/clerk-expo'

const Page = () => {
    const { isSignedIn, isLoaded } = useAuth();

    // Wait for Clerk to load before making any decisions
    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (isSignedIn) {
        return <Redirect href="/(root)/(tabs)/home" />;
    }

    return <Redirect href="/(auth)/welcome" />;
};

export default Page;