import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./context/AuthContext";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    alias: "",
  });
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis");
      return;
    }

    if (!isLogin && !formData.alias) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          router.replace("./home");
        } else {
          Alert.alert("Erreur", "Email ou mot de passe incorrect");
        }
      } else {
        const success = await register(
          formData.email,
          formData.password,
          formData.alias
        );
        if (success) {
          Alert.alert(
            "Succès",
            "Compte créé avec succès! Vous pouvez maintenant vous connecter.",
            [{ text: "OK", onPress: () => setIsLogin(true) }]
          );
          setFormData({ email: "", password: "", alias: "" });
        } else {
          Alert.alert("Erreur", "Erreur lors de la création du compte");
        }
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-xl p-6 shadow-lg mx-2">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              {isLogin ? "Connexion" : "Inscription"}
            </Text>

            <Text className="text-base text-gray-600 text-center mb-8">
              {isLogin
                ? "Connectez-vous à votre compte"
                : "Créez votre compte PickMe"}
            </Text>

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {!isLogin && (
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-700 mb-2">
                  Alias
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
                  value={formData.alias}
                  onChangeText={(value) => updateFormData("alias", value)}
                  placeholder="votre_alias"
                  autoCapitalize="none"
                />
              </View>
            )}

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-700 mb-2">
                Mot de passe
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                placeholder="Votre mot de passe"
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              className={`bg-blue-500 rounded-lg p-4 items-center mt-2 ${loading ? "opacity-60" : ""}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold">
                {loading
                  ? "Chargement..."
                  : isLogin
                    ? "Se connecter"
                    : "S'inscrire"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-5 items-center"
              onPress={() => {
                setIsLogin(!isLogin);
                setFormData({ email: "", password: "", alias: "" });
              }}
            >
              <Text className="text-blue-500 text-base">
                {isLogin
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
