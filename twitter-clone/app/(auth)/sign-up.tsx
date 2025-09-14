import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View, Modal, TouchableOpacity, Pressable } from "react-native";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();

    // Separate state for each piece of data
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    // Modal states
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Verification states
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSignUp = async () => {
        if (!isLoaded) return;

        // Basic validation
        if (!userName.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }
        if (!userEmail.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        if (!userPassword.trim()) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        try {
            console.log("Starting signup process...");

            await signUp.create({
                emailAddress: userEmail,
                password: userPassword,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            console.log("Showing verification modal...");
            setShowVerificationModal(true);
            setVerificationError("");
            setVerificationCode("");

        } catch (err) {
            console.log("Signup error:", err);
            Alert.alert( "Failed to create account");
        }
    };

    const handleVerifyCode = async () => {
        if (!isLoaded) return;

        if (!verificationCode.trim()) {
            setVerificationError("Please enter the verification code");
            return;
        }

        setIsVerifying(true);
        setVerificationError("");

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });

                setShowVerificationModal(false);
                setShowSuccessModal(true);

            } else {
                setVerificationError("Verification failed. Please try again.");
            }
        } catch (err) {
            console.log("Verification error:", err);
            setVerificationError( "Invalid verification code");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCodeChange = (code:string) => {
        setVerificationCode(code);
        if (verificationError) {
            setVerificationError("");
        }
    };

    const closeVerificationModal = () => {
        setShowVerificationModal(false);
        setVerificationCode("");
        setVerificationError("");
    };

    const navigateToHome = () => {
        setShowSuccessModal(false);
        router.push("/(root)/(tabs)/home");
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                        Create Your Account
                    </Text>
                </View>

                <View className="p-5">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        icon={icons.person}
                        value={userName}
                        onChangeText={setUserName}
                    />

                    <InputField
                        label="Email"
                        placeholder="Enter email"
                        icon={icons.email}
                        textContentType="emailAddress"
                        value={userEmail}
                        onChangeText={setUserEmail}
                    />

                    <InputField
                        label="Password"
                        placeholder="Enter password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        textContentType="password"
                        value={userPassword}
                        onChangeText={setUserPassword}
                    />

                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignUp}
                        className="mt-6"
                    />

                    <OAuth />

                    <Link
                        href="/sign-in"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        Already have an account?{" "}
                        <Text className="text-primary-500">Log In</Text>
                    </Link>
                </View>

                {/* Custom Verification Modal */}
                <Modal
                    visible={showVerificationModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeVerificationModal}
                >
                    <View className="flex-1 bg-black/50 justify-center items-center px-4">
                        <Pressable
                            className="absolute inset-0"
                            onPress={closeVerificationModal}
                        />
                        <View className="bg-white rounded-2xl p-7 w-full max-w-sm relative">
                            <Text className="font-JakartaExtraBold text-2xl mb-2">
                                Verification
                            </Text>
                            <Text className="font-Jakarta mb-5 text-gray-600">
                                We've sent a verification code to {userEmail}.
                            </Text>

                            <InputField
                                label="Code"
                                icon={icons.lock}
                                placeholder="12345"
                                value={verificationCode}
                                keyboardType="numeric"
                                onChangeText={handleCodeChange}
                                maxLength={6}
                            />

                            {verificationError ? (
                                <Text className="text-red-500 text-sm mt-2 mb-2">
                                    {verificationError}
                                </Text>
                            ) : null}

                            <CustomButton
                                title={isVerifying ? "Verifying..." : "Verify Email"}
                                onPress={handleVerifyCode}
                                className="mt-4 bg-success-500"
                                disabled={isVerifying}
                            />

                            <TouchableOpacity
                                onPress={closeVerificationModal}
                                className="mt-3"
                            >
                                <Text className="text-center text-gray-500">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Custom Success Modal */}
                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={navigateToHome}
                >
                    <View className="flex-1 bg-black/50 justify-center items-center px-4">
                        <View className="bg-white rounded-2xl p-7 w-full max-w-sm items-center">
                            <Image
                                source={images.check}
                                className="w-[110px] h-[110px] my-5"
                            />
                            <Text className="text-3xl font-JakartaBold text-center">
                                Verified
                            </Text>
                            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2 mb-5">
                                You have successfully verified your account.
                            </Text>
                            <CustomButton
                                title="Browse Home"
                                onPress={navigateToHome}
                                className="w-full"
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

export default SignUp;