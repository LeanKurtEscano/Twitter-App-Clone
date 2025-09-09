import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";

import {router} from "expo-router";
import Swiper from "react-native-swiper";
import {useRef} from "react";
const Onboarding = () => {

    const swiperRef = useRef<Swiper>(null);
    return(
        <SafeAreaView className="flex h-full items-center justify-between">

            <TouchableOpacity onPress={()=> router.replace("/(auth)/sign-up")}

            className="w-full flex justify-end items-end p-5"
            >

                <Text className="text-black text-md font-JakartaBold">Skip</Text>


            </TouchableOpacity>

            <Swiper ref={swiperRef} loop={false}>

                dot = {<View className=" w-[32px] h-[4px] mx-1 bg-[#E2E8F0]"></View>}

            </Swiper>



        </SafeAreaView>
    )
}

export default  Onboarding ;