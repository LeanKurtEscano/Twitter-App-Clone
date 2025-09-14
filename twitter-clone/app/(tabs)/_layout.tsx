import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

import Feather from '@expo/vector-icons/Feather'
const TabsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" 
        options={{ tabBarIcon: ({color,size}) => <Feather name='home' size={size} color={color}/> }} />
        <Tabs.Screen name="search" options={{ tabBarIcon: ({color,size}) => <Feather name='search' size={size} color={color}/> }} />
        <Tabs.Screen name="messages" options={{ tabBarIcon: ({color,size}) => <Feather name='mail' size={size} color={color}/> }} />
        <Tabs.Screen name="notification" options={{ tabBarIcon: ({color,size}) => <Feather name='bell' size={size} color={color}/> }} />
        <Tabs.Screen name="profile" options={{ tabBarIcon: ({color,size}) => <Feather name='user' size={size} color={color}/> }} />
    </Tabs>
  )
}

export default TabsLayout