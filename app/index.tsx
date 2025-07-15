import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Logo from "./components/Logo";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary-bg">
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="mb-12">
          <Logo />
        </View>
        
        {/* Texte d'accueil */}
        <View className="mb-12 w-full max-w-sm mx-auto">
          <Text className="text-primary-text text-center text-[24px] font-semibold mb-4">
            Bienvenu sur PicMe
          </Text>
          <Text className="text-primary-text text-center text-[16px] font-medium opacity-80">
            Connectez-vous avec vos amis
          </Text>
        </View>

        {/* Boutons */}
        <View className="w-full max-w-sm mx-auto space-y-4 gap-4">
          <TouchableOpacity
            onPress={() => router.push("/auth")}
            className="bg-primary-text rounded-[29px] h-[45px] justify-center"
          >
            <Text className="text-[#8894B9] text-center text-[15px] font-bold">
              SE CONNECTER
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="bg-primary-variant bg-opacity-32 border-2 border-primary-text rounded-[29px] h-[45px] justify-center"
          >
            <Text className="text-primary-text text-center text-[15px] font-bold">
              S'INSCRIRE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
