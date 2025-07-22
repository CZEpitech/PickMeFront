import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Party() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCreateEvent = () => {
    Alert.alert(
      "Créer un événement",
      "Fonctionnalité en cours de développement"
    );
  };

  const handleJoinEvent = (eventName: string) => {
    Alert.alert(
      "Rejoindre l'événement",
      `Rejoindre "${eventName}" - Fonctionnalité en cours de développement`
    );
  };

  return (
    <View className="flex-1 bg-primary-bg">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              tintColor="#F5C74D"
              colors={["#F5C74D"]}
            />
          }
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6 bg-primary-bg">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-primary-text text-2xl font-bold">
                Événements
              </Text>
              <TouchableOpacity onPress={handleCreateEvent} className="p-2">
                <Ionicons name="add-circle-outline" size={24} color="#F5C74D" />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View className="flex-row justify-around mb-6">
              <View className="items-center">
                <Text className="text-text-primary text-lg font-bold">12</Text>
                <Text className="text-text-secondary text-xs opacity-70">
                  Événements
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-text-primary text-lg font-bold">5</Text>
                <Text className="text-text-secondary text-xs opacity-70">
                  Participations
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-text-primary text-lg font-bold">2</Text>
                <Text className="text-text-secondary text-xs opacity-70">
                  Organisés
                </Text>
              </View>
            </View>
          </View>

          {/* Content Sections */}
          <View className="px-6 py-4">
            {/* Create Event Button */}
            <TouchableOpacity
              onPress={handleCreateEvent}
              className="bg-surface-elevated rounded-[15px] h-12 justify-center flex-row items-center mb-6 border border-border-subtle"
            >
              <Ionicons
                name="add"
                size={20}
                color="#C4C4D1"
                style={{ marginRight: 8 }}
              />
              <Text className="text-text-primary text-sm font-bold">
                Créer un événement
              </Text>
            </TouchableOpacity>

            {/* Upcoming Events */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Événements à venir
              </Text>

              {/* Event Card 1 */}
              <TouchableOpacity
                onPress={() => handleJoinEvent("Soirée Dansante")}
                className="bg-surface-elevated rounded-[15px] p-4 mb-3 border border-border-subtle"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base">
                      Soirée Dansante
                    </Text>
                    <Text className="text-text-muted text-sm">
                      Samedi 25 Juillet • 20h00
                    </Text>
                  </View>
                  <View className="bg-surface-pressed rounded-full px-2 py-1">
                    <Text className="text-text-primary text-xs font-semibold">
                      24 participants
                    </Text>
                  </View>
                </View>
                <Text className="text-text-secondary opacity-80 text-sm mb-3">
                  Venez danser et rencontrer de nouvelles personnes dans une
                  ambiance festive !
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="#7A7A8A" />
                  <Text className="text-text-muted text-sm ml-1">
                    Centre-ville, Club Paradise
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Event Card 2 */}
              <TouchableOpacity
                onPress={() => handleJoinEvent("Café Rencontre")}
                className="bg-surface-elevated rounded-[15px] p-4 mb-3 border border-border-subtle"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base">
                      Café Rencontre
                    </Text>
                    <Text className="text-text-muted text-sm">
                      Dimanche 26 Juillet • 15h00
                    </Text>
                  </View>
                  <View className="bg-surface-pressed rounded-full px-2 py-1">
                    <Text className="text-text-primary text-xs font-semibold">
                      8 participants
                    </Text>
                  </View>
                </View>
                <Text className="text-text-secondary opacity-80 text-sm mb-3">
                  Un moment convivial autour d'un café pour faire connaissance
                  en petit comité.
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="#7A7A8A" />
                  <Text className="text-text-muted text-sm ml-1">
                    Café Central, Place du Marché
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* My Events */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Mes événements
              </Text>

              <TouchableOpacity
                onPress={() => handleJoinEvent("Pique-nique au Parc")}
                className="bg-surface-elevated rounded-[15px] p-4 mb-3 border border-border-subtle"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base">
                      Pique-nique au Parc
                    </Text>
                    <Text className="text-text-muted text-sm">
                      Organisé par vous • Samedi 1er Août
                    </Text>
                  </View>
                  <View className="bg-primary-text rounded-full px-2 py-1">
                    <Text className="text-primary-bg text-xs font-semibold">
                      Organisateur
                    </Text>
                  </View>
                </View>
                <Text className="text-text-secondary opacity-80 text-sm mb-3">
                  Profitez d'une belle journée ensoleillée pour un pique-nique
                  convivial au parc.
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#7A7A8A"
                    />
                    <Text className="text-text-muted text-sm ml-1">
                      Parc de la Ville
                    </Text>
                  </View>
                  <Text className="text-text-primary text-sm font-semibold">
                    12 participants
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Categories */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Catégories d'événements
              </Text>

              <View className="flex-row flex-wrap justify-between">
                <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle">
                  <Ionicons name="musical-notes" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2">
                    Musique
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle">
                  <Ionicons name="restaurant" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2">
                    Gastronomie
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle">
                  <Ionicons name="fitness" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2">
                    Sport
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle">
                  <Ionicons name="book" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2">
                    Culture
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
