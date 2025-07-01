import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ScreenWrapper } from "../components";

export default function DiscoverScreen() {
  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 border-b border-border-primary">
        <Text className="text-text-primary text-xl font-bold">Découvrir</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Section principale */}
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-20 h-20 rounded-full bg-background-tertiary items-center justify-center mb-6">
            <Ionicons name="compass" size={40} color="#8E8E93" />
          </View>
          
          <Text className="text-text-primary text-2xl font-bold text-center mb-4">
            Découvrir
          </Text>
          
          <Text className="text-text-muted text-center text-base mb-8">
            Explorez les PickMes publics de la communauté et découvrez de nouveaux profils.
          </Text>

          {/* Fonctionnalités à venir */}
          <View className="w-full max-w-sm">
            <Text className="text-text-secondary text-lg font-semibold mb-4">
              Prochainement :
            </Text>
            
            <View className="space-y-3">
              {[
                { icon: "globe-outline", text: "Explorer les PickMes publics" },
                { icon: "people-outline", text: "Découvrir de nouveaux utilisateurs" },
                { icon: "trending-up-outline", text: "Tendances et populaires" },
                { icon: "location-outline", text: "Découvrir par localisation" },
              ].map((item, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center mr-3">
                    <Ionicons name={item.icon as any} size={20} color="#8E8E93" />
                  </View>
                  <Text className="text-text-secondary flex-1">{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}