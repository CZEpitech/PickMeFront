import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, Card, Input, ScreenWrapper } from "./components";
import { useAuthForm } from "./hooks";

export default function AuthScreen() {
  const {
    isLogin,
    formData,
    loading,
    validationErrors,
    setIsLogin,
    updateFormData,
    handleSubmit,
    resetForm,
  } = useAuthForm();

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <ScreenWrapper>
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
          <Card className="mb-lg">
            <View className="mb-lg text-center">
              <Text className="text-2xl font-bold text-text-primary text-center mb-xs">
                {isLogin ? "Connexion" : "Inscription"}
              </Text>
              <Text className="text-base text-text-secondary text-center">
                {isLogin
                  ? "Connectez-vous à votre compte"
                  : "Créez votre compte PickMe"}
              </Text>
            </View>

            <View>
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={validationErrors.email}
              />

              {!isLogin && (
                <Input
                  label="Alias"
                  placeholder="votre_alias"
                  value={formData.alias}
                  onChangeText={(value) => updateFormData("alias", value)}
                  autoCapitalize="none"
                  error={validationErrors.alias}
                />
              )}

              <Input
                label="Mot de passe"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                secureTextEntry
                error={validationErrors.password}
              />

              {!isLogin && (
                <Input
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    updateFormData("confirmPassword", value)
                  }
                  secureTextEntry
                  error={validationErrors.confirmPassword}
                />
              )}

              <View className="mt-lg">
                <Button
                  title={
                    loading
                      ? "Chargement..."
                      : isLogin
                        ? "Se connecter"
                        : "S'inscrire"
                  }
                  onPress={handleSubmit}
                  disabled={loading}
                  className="w-full"
                />
              </View>

              <View className="mt-lg pt-md border-t border-border-primary">
                <Button
                  title={
                    isLogin
                      ? "Pas encore de compte ? S'inscrire"
                      : "Déjà un compte ? Se connecter"
                  }
                  variant="outline"
                  onPress={handleToggleMode}
                  className="w-full"
                />
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
