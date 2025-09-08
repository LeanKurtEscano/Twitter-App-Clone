import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Text, View } from "react-native";
export default function HomeScreen() {
  return (
      <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-blue-500">
              Welcome to Nativewind!
          </Text>
      </View>
  )
}
