import {View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions} from "react-native";
import {router} from "expo-router";
import {useRef, useState} from "react";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import {onboarding} from "@/constants";
import CustomButton from "@/components/CustomButton";

const { width } = Dimensions.get('window');

const Onboarding = () => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const isLastSlide = activeIndex === onboarding.length - 1;

    const handleNext = () => {
        if (isLastSlide) {
            router.replace("/(auth)/sign-up");
        } else {
            carouselRef.current?.next();
        }
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <View className="flex items-center justify-center px-5 h-full">
            <Image
                source={item.image}
                className="w-full h-[300px]"
                resizeMode="contain"
            />
            <View className="flex items-center justify-center w-full mt-10">
                <Text className="text-black text-3xl font-bold mx-10 text-center">
                    {item.title}
                </Text>
            </View>

            <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
                {item.description}
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex h-full items-center justify-between">
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-up")}
                className="w-full flex justify-end items-end p-5"
            >
                <Text className="text-black text-md font-JakartaBold">Skip</Text>
            </TouchableOpacity>

            <View className="flex-1 w-full">
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    width={width}
                    height={500}
                    autoPlay={false}
                    data={onboarding}
                    scrollAnimationDuration={300}
                    renderItem={renderItem}
                    onSnapToItem={(index) => setActiveIndex(index)}
                />

                {/* Custom Pagination */}
                <View className="flex-row justify-center items-center mt-5">
                    {onboarding.map((_, index) => (
                        <View
                            key={index}
                            className={`w-[32px] h-[4px] mx-1 rounded-full ${
                                index === activeIndex ? 'bg-[#0286FF]' : 'bg-[#E2E8F0]'
                            }`}
                        />
                    ))}
                </View>
            </View>

            <CustomButton
                title={isLastSlide ? "Get Started" : "Next"}
                onPress={handleNext}
                className="w-11/12 mt-10"
            />
        </SafeAreaView>
    );
};

export default Onboarding;