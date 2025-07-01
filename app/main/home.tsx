import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ScreenWrapper } from "../components";

export default function HomeScreen() {
  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 border-b border-border-primary">
        <Text className="text-text-primary text-xl font-bold">Accueil</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Section principale */}
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-24 h-24 rounded-full bg-background-tertiary items-center justify-center mb-6">
            <Ionicons name="home" size={48} color="#8E8E93" />
          </View>

          <Text className="text-text-primary text-2xl font-bold text-center mb-4">
            Accueil PickMe
          </Text>

          <Text className="text-text-muted text-center text-base mb-8">
            Le feed social de PickMe arrive bientôt ! Découvrez les PickMes de
            vos amis et de la communauté.
          </Text>

          {/* Fonctionnalités à venir */}
          <View className="w-full max-w-sm">
            <Text className="text-text-secondary text-lg font-semibold mb-4">
              Prochainement :
            </Text>

            <View className="space-y-3">
              {[
                { icon: "people-outline", text: "Feed des amis" },
                { icon: "heart-outline", text: "Réactions aux PickMes" },
                { icon: "chatbubble-outline", text: "Commentaires" },
                { icon: "flash-outline", text: "Stories éphémères" },
                {
                  icon: "notifications-outline",
                  text: "Notifications en temps réel",
                },
              ].map((item, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center mr-3">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#8E8E93"
                    />
                  </View>
                  <Text className="text-text-secondary flex-1">
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Message encourageant */}
          <View className="mt-12 p-4 bg-background-secondary rounded-xl w-full max-w-sm">
            <Text className="text-text-primary text-center font-medium mb-2">
              💡 En attendant
            </Text>
            <Text className="text-text-muted text-center text-sm">
              Explorez votre profil et ajoutez vos premiers PickMes pour être
              prêt quand le feed social sera disponible !
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
