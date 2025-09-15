import { Redirect, Stack } from 'expo-router'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { syncUserDataToBackend } from '@/lib/userSync' // Adjust path as needed

export default function AuthRoutesLayout() {
    const { isSignedIn, isLoaded } = useAuth()
    const { user } = useUser()
    const hasSyncedRef = useRef(false)

    const determineAuthStrategy = (user: any): string => {
        
        const externalAccounts = user?.externalAccounts || [];
        
        for (const account of externalAccounts) {
            if (account.provider === 'google') {
                return 'oauth_google';
            } else if (account.provider === 'apple') {
                return 'oauth_apple';
            }
        }
        
        return 'oauth_google'; 
    };

    useEffect(() => {
        const handleUserSync = async () => {
            if (isLoaded && isSignedIn && user && !hasSyncedRef.current) {
                console.log("🎯 User authenticated in AuthRoutesLayout, syncing before redirect:", {
                    userId: user.id,
                    email: user.emailAddresses[0]?.emailAddress
                });

                try {
                    // Check if we've already synced this user
                    const alreadySynced = await AsyncStorage.getItem(`synced_${user.id}`);
                    
                    if (!alreadySynced) {
                        const strategy = determineAuthStrategy(user);
                        console.log("🔄 Syncing user from AuthRoutesLayout with strategy:", strategy);
                        
                        await syncUserDataToBackend(user, strategy);
                        
                        // Mark as synced
                        await AsyncStorage.setItem(`synced_${user.id}`, 'true');
                        hasSyncedRef.current = true;
                        
                        console.log("✅ User sync completed from AuthRoutesLayout");
                    } else {
                        console.log("✅ User already synced, proceeding to redirect");
                    }
                } catch (error) {
                    console.error("❌ Error in user sync from AuthRoutesLayout:", error);
                 
                }
            }
        };

        handleUserSync();
    }, [isLoaded, isSignedIn, user]);

    if (isSignedIn) {
        return <Redirect href={'/(tabs)'} />
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}