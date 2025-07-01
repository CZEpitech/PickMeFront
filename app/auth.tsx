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
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    alias: "",
  });

  const { login, register } = useAuth();

  // Validation en temps réel
  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          error = "Format d'email invalide";
        }
        break;
      case "password":
        if (value && value.length < 6) {
          error = "Au moins 6 caractères requis";
        }
        break;
      case "alias":
        if (value && value.length < 3) {
          error = "Au moins 3 caractères requis";
        } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Lettres, chiffres et _ uniquement";
        }
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

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
        const result = await register(
          formData.email,
          formData.password,
          formData.alias
        );
        if (result.success) {
          Alert.alert(
            "Succès",
            "Compte créé avec succès! Vous pouvez maintenant vous connecter.",
            [{ text: "OK", onPress: () => setIsLogin(true) }]
          );
          setFormData({ email: "", password: "", alias: "" });
        } else {
          Alert.alert(
            "Erreur",
            result.message || "Erreur lors de la création du compte"
          );
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
    // Validation en temps réel pendant la saisie
    if (!isLogin) {
      validateField(field, value);
    }
  };

  // Fonction pour obtenir le style du champ selon la validation
  const getInputStyle = (field: string) => {
    if (isLogin)
      return "border border-gray-300 rounded-lg p-3 text-base bg-gray-50";

    const hasError = validationErrors[field as keyof typeof validationErrors];
    const hasValue = formData[field as keyof typeof formData];

    if (hasError) {
      return "border border-red-400 rounded-lg p-3 text-base bg-red-50";
    } else if (hasValue && !hasError) {
      return "border border-green-400 rounded-lg p-3 text-base bg-green-50";
    }
    return "border border-gray-300 rounded-lg p-3 text-base bg-gray-50";
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
                className={getInputStyle("email")}
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {!isLogin && validationErrors.email ? (
                <Text className="text-red-500 text-sm mt-1">
                  {validationErrors.email}
                </Text>
              ) : null}
            </View>

            {!isLogin && (
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-700 mb-2">
                  Alias
                </Text>
                <TextInput
                  className={getInputStyle("alias")}
                  value={formData.alias}
                  onChangeText={(value) => updateFormData("alias", value)}
                  placeholder="votre_alias"
                  autoCapitalize="none"
                />
                {validationErrors.alias ? (
                  <Text className="text-red-500 text-sm mt-1">
                    {validationErrors.alias}
                  </Text>
                ) : null}
                <Text className="text-gray-500 text-xs mt-1">
                  Minimum 3 caractères, lettres, chiffres et _ uniquement
                </Text>
              </View>
            )}

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-700 mb-2">
                Mot de passe
              </Text>
              <TextInput
                className={getInputStyle("password")}
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                placeholder="Votre mot de passe"
                secureTextEntry
                autoComplete="password"
              />
              {!isLogin && validationErrors.password ? (
                <Text className="text-red-500 text-sm mt-1">
                  {validationErrors.password}
                </Text>
              ) : null}
              {!isLogin && (
                <Text className="text-gray-500 text-xs mt-1">
                  Minimum 6 caractères requis
                </Text>
              )}
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
                setValidationErrors({ email: "", password: "", alias: "" });
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
