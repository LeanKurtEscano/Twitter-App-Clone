import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {SplashScreen, Stack} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../../global.css"


const Layout = () => {


    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}

export default Layout;