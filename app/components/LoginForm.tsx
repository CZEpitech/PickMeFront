import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Logo from "./Logo";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    Alert.alert("Connexion", "Placeholder - Backend non fonctionnel");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-bg">
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="mb-8">
          <Logo />
        </View>
        
        <View className="w-full max-w-sm mx-auto">
          {/* Champs de saisie */}
          <View className="mb-6">
            <View className="mb-4">
              <View className="bg-primary-variant bg-opacity-32 border-2 border-primary-text rounded-[29px] h-[38px] justify-center px-4">
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="USERNAME"
                  placeholderTextColor="#F5C74D"
                  className="text-primary-text text-center text-[13px] font-semibold"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <View className="mb-4">
              <View className="bg-primary-variant bg-opacity-32 border-2 border-primary-text rounded-[29px] h-[38px] justify-center px-4">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="PASSWORD"
                  placeholderTextColor="#F5C74D"
                  className="text-primary-text text-center text-[13px] font-semibold"
                  secureTextEntry
                />
              </View>
            </View>
            
            <TouchableOpacity className="mt-2">
              <Text className="text-primary-text text-center text-[11px] font-medium">
                forgot your password?{" "}
                <Text className="underline">click here</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bouton de connexion */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-primary-text rounded-[29px] h-[38px] justify-center"
            >
              <Text className="text-[#8894B9] text-center text-[13px] font-bold">
                LOGIN
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleRegister} className="mt-3">
              <Text className="text-primary-text text-center text-[11px] font-medium">
                don't have an account?{" "}
                <Text className="underline">click here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}