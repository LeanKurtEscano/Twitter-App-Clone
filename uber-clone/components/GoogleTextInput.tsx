
import { View, Image } from "react-native";


import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

const GoogleTextInput = ({
                             icon,
                             initialLocation,
                             containerStyle,
                             textInputBackgroundColor,
                             handlePress,
                         }: GoogleInputProps) => {
    return (
        <View
            className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
        >

        </View>
    );
};

export default GoogleTextInput;