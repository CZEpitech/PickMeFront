import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("./auth");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header avec safe area respectée */}
        <View className="flex-row justify-between items-center px-5 py-4 bg-white shadow-sm">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-bold text-gray-900">
              Bienvenue sur PickMe!
            </Text>
          </View>
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-md"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold">Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Profil Section */}
        <View className="bg-white m-5 p-5 rounded-xl shadow-lg">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Mon Profil
          </Text>

          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-700 flex-1">
              ID Utilisateur:
            </Text>
            <Text className="text-base text-gray-600 flex-2 text-right">
              {user.id}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-700 flex-1">
              Email:
            </Text>
            <Text className="text-base text-gray-600 flex-2 text-right">
              {user.email}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-700 flex-1">
              Alias:
            </Text>
            <Text className="text-base text-gray-600 flex-2 text-right">
              {user.alias}
            </Text>
          </View>

          {user.birthdate && (
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-700 flex-1">
                Date de naissance:
              </Text>
              <Text className="text-base text-gray-600 flex-2 text-right">
                {new Date(user.birthdate).toLocaleDateString("fr-FR")}
              </Text>
            </View>
          )}

          {user.pays && (
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-700 flex-1">
                Pays:
              </Text>
              <Text className="text-base text-gray-600 flex-2 text-right">
                {user.pays}
              </Text>
            </View>
          )}

          {user.langue && (
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-700 flex-1">
                Langue:
              </Text>
              <Text className="text-base text-gray-600 flex-2 text-right">
                {user.langue}
              </Text>
            </View>
          )}

          {user.description && (
            <View className="py-3 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-700 mb-2">
                Description:
              </Text>
              <Text className="text-base text-gray-600">
                {user.description}
              </Text>
            </View>
          )}

          {user.pronous && (
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-700 flex-1">
                Pronoms:
              </Text>
              <Text className="text-base text-gray-600 flex-2 text-right">
                {user.pronous}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between items-center py-3">
            <Text className="text-base font-semibold text-gray-700 flex-1">
              Profil public:
            </Text>
            <Text className="text-base text-gray-600 flex-2 text-right">
              {user.is_public ? "Oui" : "Non"}
            </Text>
          </View>
        </View>

        {/* Actions Section */}
        <View className="bg-white mx-5 mb-5 p-5 rounded-xl shadow-lg">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Actions rapides
          </Text>

          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center mb-3">
            <Text className="text-white text-base font-semibold">
              Modifier le profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center mb-3">
            <Text className="text-white text-base font-semibold">
              Voir mes images
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center">
            <Text className="text-white text-base font-semibold">Mes amis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
