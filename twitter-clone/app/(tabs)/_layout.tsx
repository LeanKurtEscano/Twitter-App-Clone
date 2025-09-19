import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, Tabs } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import Feather from '@expo/vector-icons/Feather'
const TabsLayout = () => {


    const {isSignedIn} = useAuth()

    if(!isSignedIn) {
        return <Redirect href={'/(auth)'} />
    }
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1DA1F2' }}>
        <Tabs.Screen name="index" 
        options={{ tabBarIcon: ({color,size}) => <Feather name='home' size={size} color={color}/> }} />
        <Tabs.Screen name="search" options={{ tabBarIcon: ({color,size}) => <Feather name='search' size={size} color={color}/> }} />
        <Tabs.Screen name="messages" options={{ tabBarIcon: ({color,size}) => <Feather name='mail' size={size} color={color}/> }} />
        <Tabs.Screen name="notification" options={{ tabBarIcon: ({color,size}) => <Feather name='bell' size={size} color={color}/> }} />
        <Tabs.Screen name="profile" options={{ tabBarIcon: ({color,size}) => <Feather name='user' size={size} color={color}/> }} />
        <Tabs.Screen name="user/[id]"options={{  href: null, }}/>

    </Tabs>
  )
}

export default TabsLayout