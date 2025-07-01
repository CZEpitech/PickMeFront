import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ScreenWrapper } from "../components";

export default function FriendsScreen() {
  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 border-b border-border-primary">
        <Text className="text-text-primary text-xl font-bold">Amis</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Section principale */}
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-24 h-24 rounded-full bg-background-tertiary items-center justify-center mb-6">
            <Ionicons name="people" size={48} color="#8E8E93" />
          </View>
          
          <Text className="text-text-primary text-2xl font-bold text-center mb-4">
            Fonctionnalité à venir
          </Text>
          
          <Text className="text-text-muted text-center text-base">
            La gestion des amis sera bientôt disponible.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}