import {View, Text, SafeAreaView} from "react-native";
import {Redirect} from "expo-router";
import { useAuth } from '@clerk/clerk-expo'
const Page = () => {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href="/(root)/(tabs)/home" />
    }
  // @ts-ignore
    return <Redirect href="/(auth)/welcome"/>;
}

export default  Page ;