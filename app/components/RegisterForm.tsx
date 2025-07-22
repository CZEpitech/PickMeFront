import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Logo from "./Logo";
import { authService } from "../services/authService";
import { tokenStorage } from "../services/tokenStorage";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    
    if (!email || !alias || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.register({ email, password, alias });
      
      if (result.success) {
        Alert.alert("Succès", "Inscription réussie ! Vous pouvez maintenant vous connecter.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.back();
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
          <View className="mb-8">
            <View className="mb-4">
              <View className="bg-primary-variant bg-opacity-32 border-2 border-primary-text rounded-[29px] h-[38px] justify-center px-4">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="EMAIL"
                  placeholderTextColor="#F5C74D"
                  className="text-primary-text text-center text-[13px] font-semibold"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
            
            <View className="mb-4">
              <View className="bg-primary-variant bg-opacity-32 border-2 border-primary-text rounded-[29px] h-[38px] justify-center px-4">
                <TextInput
                  value={alias}
                  onChangeText={setAlias}
                  placeholder="ALIAS"
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
            
            <View className="mb-4">
              <View className="bg-primary-variant bg-opacity-32 border-2 border-primary-text rounded-[29px] h-[38px] justify-center px-4">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="CONFIRM PASSWORD"
                  placeholderTextColor="#F5C74D"
                  className="text-primary-text text-center text-[13px] font-semibold"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Bouton d'inscription */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={`bg-primary-text rounded-[29px] h-[38px] justify-center ${isLoading ? 'opacity-50' : ''}`}
            >
              <Text className="text-[#8894B9] text-center text-[13px] font-bold">
                {isLoading ? 'INSCRIPTION...' : 'REGISTER'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleLogin} className="mt-3">
              <Text className="text-primary-text text-center text-[11px] font-medium">
                already have an account?{" "}
                <Text className="underline">click here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}