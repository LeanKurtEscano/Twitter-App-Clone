import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather'
import { useSignOut } from '@/hooks/useSignOut'
import { useUser } from '@clerk/clerk-expo'
const SignOutButton = () => {
    const { user } = useUser();
    const  {handleSignOut} = useSignOut(user?.id || "");
  return (
   <TouchableOpacity onPress={handleSignOut}>
      <Feather name="log-out" size={24} color={"#E0245E"} />
    </TouchableOpacity>
  )
}

export default SignOutButton