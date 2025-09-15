
import {SplashScreen, Stack} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css"
import { useState } from 'react';
import { tokenCache } from '@clerk/clerk-expo/token-cache'

import { ClerkProvider } from '@clerk/clerk-expo'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export default function RootLayout() {
    const [queryClient] = useState(() => new QueryClient());
    return  (
        <ClerkProvider tokenCache={tokenCache}>
            <QueryClientProvider client={queryClient}>

        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name = "(auth)" options={{ headerShown: false }}/>
        </Stack>
        </QueryClientProvider>
        </ClerkProvider>
    )

}