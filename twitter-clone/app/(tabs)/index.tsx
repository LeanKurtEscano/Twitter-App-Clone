import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '@/components/SignOutButton'

const HomeScreen = () => {
  return (
    <SafeAreaView className='flex-1'>
      <SignOutButton/>
      <Text>HomeScreen</Text>
    </SafeAreaView>
  )
}

export default HomeScreen