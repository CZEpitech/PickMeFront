import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [isRefreshing, setIsRefreshing] = useState(false);

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
                Accueil
              </Text>
              <TouchableOpacity className="p-2">
                <Ionicons name="search-outline" size={24} color="#A3A3B4" />
              </TouchableOpacity>
            </View>

            {/* Welcome Card */}
            <View className="bg-surface-elevated rounded-[20px] p-6 mb-6 border border-border-subtle">
              <View className="flex-row items-center mb-4">
                <Ionicons name="heart" size={24} color="#A3A3B4" />
                <Text className="text-primary-text text-lg font-bold ml-3">
                  Bienvenue sur PickMe !
                </Text>
              </View>
              <Text className="text-text-secondary opacity-90 text-sm leading-5">
                Découvrez de nouvelles personnes, créez des connexions et vivez
                des expériences inoubliables.
              </Text>
            </View>
          </View>

          {/* Content Sections */}
          <View className="px-6 py-4">
            {/* Quick Actions */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Actions rapides
              </Text>

              <View className="flex-row justify-between mb-4">
                <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 flex-1 mr-2 items-center border border-border-subtle">
                  <Ionicons
                    name="add-circle-outline"
                    size={32}
                    color="#C4C4D1"
                  />
                  <Text className="text-text-primary text-sm font-semibold mt-2">
                    Ajouter
                  </Text>
                  <Text className="text-text-muted text-xs mt-1">
                    Utilisez la navbar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 flex-1 ml-2 items-center border border-border-subtle">
                  <Ionicons name="people-outline" size={32} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2">
                    Événements
                  </Text>
                  <Text className="text-text-muted text-xs mt-1">
                    Utilisez la navbar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Activity */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Activité récente
              </Text>

              <View className="bg-surface-elevated rounded-[15px] p-4 items-center border border-border-subtle">
                <Ionicons name="time-outline" size={48} color="#7A7A8A" />
                <Text className="text-text-secondary text-center mt-3">
                  Aucune activité récente
                </Text>
                <Text className="text-text-muted text-xs text-center mt-1 opacity-70">
                  Commencez à explorer pour voir du contenu ici
                </Text>
              </View>
            </View>

            {/* Suggestions */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Suggestions
              </Text>

              <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle">
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="person-outline" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">
                    Complétez votre profil
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Utilisez la navbar pour accéder au profil
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle">
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="search-outline" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">
                    Recherchez des amis
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Utilisez la navbar pour la recherche
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>
            </View>

            {/* Contenu supplémentaire pour tester le scroll */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Contenu de test
              </Text>
              {Array.from({ length: 10 }, (_, i) => (
                <View
                  key={i}
                  className="bg-surface-elevated rounded-[15px] p-4 mb-3 border border-border-subtle"
                >
                  <Text className="text-text-primary">
                    Élément de test {i + 1}
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    Ceci est du contenu de test pour vérifier que le scroll
                    fonctionne correctement derrière la navbar.
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
