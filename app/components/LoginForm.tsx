import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../services/authService";
import { tokenStorage } from "../services/tokenStorage";
import Logo from "./Logo";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });

      if (result.success && result.data?.token) {
        await tokenStorage.saveToken(result.data.token);
        Alert.alert("Succès", "Connexion réussie", [
          { text: "OK", onPress: () => router.replace("/(tabs)/home") },
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-bg">
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="mb-12">
          <Logo />
        </View>

        {/* Formulaire de connexion */}
        <View className="w-full max-w-sm mx-auto space-y-6 gap-6">
          <View>
            <Text className="text-primary-text text-[16px] font-medium mb-2">
              Email
            </Text>
            <TextInput
              className="bg-primary-variant bg-opacity-32 border border-primary-text rounded-[29px] h-[45px] px-4 text-primary-text"
              placeholder="Votre email"
              placeholderTextColor="#A3A3B4"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View>
            <Text className="text-primary-text text-[16px] font-medium mb-2">
              Mot de passe
            </Text>
            <TextInput
              className="bg-primary-variant bg-opacity-32 border border-primary-text rounded-[29px] h-[45px] px-4 text-primary-text"
              placeholder="Votre mot de passe"
              placeholderTextColor="#A3A3B4"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`rounded-[29px] h-[45px] justify-center ${
              isLoading ? "bg-gray-400" : "bg-primary-text"
            }`}
          >
            <Text className="text-[#8894B9] text-center text-[15px] font-bold">
              {isLoading ? "CONNEXION..." : "SE CONNECTER"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-primary-text text-[14px]">
              Pas encore de compte ?{" "}
            </Text>
            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
              <Text className="text-primary-text text-[14px] font-bold underline">
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
