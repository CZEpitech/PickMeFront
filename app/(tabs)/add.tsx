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

export default function Add() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddPhoto = () => {
    Alert.alert(
      "Ajouter une photo",
      "Fonctionnalité en cours de développement"
    );
  };

  const handleCreateEvent = () => {
    Alert.alert(
      "Créer un événement",
      "Fonctionnalité en cours de développement"
    );
  };

  const handleCreatePost = () => {
    Alert.alert("Créer un post", "Fonctionnalité en cours de développement");
  };

  const handleFindFriends = () => {
    Alert.alert(
      "Rechercher des amis",
      "Fonctionnalité en cours de développement"
    );
  };

  const handleCreateStory = () => {
    Alert.alert("Créer une story", "Fonctionnalité en cours de développement");
  };

  const handleJoinGroup = () => {
    Alert.alert(
      "Rejoindre un groupe",
      "Fonctionnalité en cours de développement"
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
                Créer & Ajouter
              </Text>
              <TouchableOpacity className="p-2">
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#A3A3B4"
                />
              </TouchableOpacity>
            </View>

            {/* Quick Create */}
            <View className="bg-surface-elevated rounded-[20px] p-6 mb-6 border border-border-subtle">
              <View className="flex-row items-center mb-4">
                <Ionicons name="flash" size={24} color="#A3A3B4" />
                <Text className="text-text-primary text-lg font-bold ml-3">
                  Création rapide
                </Text>
              </View>
              <Text className="text-text-secondary opacity-90 text-sm leading-5">
                Choisissez ce que vous souhaitez créer ou ajouter à votre profil
                PickMe.
              </Text>
            </View>
          </View>

          {/* Content Sections */}
          <View className="px-6 py-4">
            {/* Main Actions */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Actions principales
              </Text>

              {/* Add Photo */}
              <TouchableOpacity
                onPress={handleAddPhoto}
                className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle"
              >
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="camera" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">
                    Ajouter une photo
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Partagez vos plus beaux moments
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>

              {/* Create Event */}
              <TouchableOpacity
                onPress={handleCreateEvent}
                className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle"
              >
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="calendar" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">
                    Créer un événement
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Organisez une rencontre ou activité
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>

              {/* Create Post */}
              <TouchableOpacity
                onPress={handleCreatePost}
                className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle"
              >
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="chatbubble" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">
                    Créer un post
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Partagez vos pensées et actualités
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>
            </View>

            {/* Social Actions */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Actions sociales
              </Text>

              {/* Find Friends */}
              <TouchableOpacity
                onPress={handleFindFriends}
                className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle"
              >
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="people" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">
                    Rechercher des amis
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Trouvez de nouvelles connexions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>

              {/* Create Story */}
              <TouchableOpacity
                onPress={handleCreateStory}
                className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center mb-3 border border-border-subtle"
              >
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="play-circle" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">
                    Créer une story
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Partagez votre journée en temps réel
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>

              {/* Join Group */}
              <TouchableOpacity
                onPress={handleJoinGroup}
                className="bg-surface-elevated rounded-[15px] p-4 flex-row items-center border border-border-subtle"
              >
                <View className="w-12 h-12 bg-surface-pressed rounded-full items-center justify-center mr-4">
                  <Ionicons name="globe" size={20} color="#C4C4D1" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold">
                    Rejoindre un groupe
                  </Text>
                  <Text className="text-text-muted text-sm">
                    Participez à des communautés
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7A7A8A" />
              </TouchableOpacity>
            </View>

            {/* Quick Templates */}
            <View className="mb-6">
              <Text className="text-text-primary text-lg font-bold mb-4">
                Templates rapides
              </Text>

              <View className="flex-row flex-wrap justify-between">
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Template",
                      "Sortie restaurant - Template en cours de développement"
                    )
                  }
                  className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle"
                >
                  <Ionicons name="restaurant" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2 text-center">
                    Sortie Restaurant
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Template",
                      "Activité sportive - Template en cours de développement"
                    )
                  }
                  className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle"
                >
                  <Ionicons name="fitness" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2 text-center">
                    Activité Sportive
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Template",
                      "Café rencontre - Template en cours de développement"
                    )
                  }
                  className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle"
                >
                  <Ionicons name="cafe" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2 text-center">
                    Café Rencontre
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Template",
                      "Sortie culture - Template en cours de développement"
                    )
                  }
                  className="bg-surface-elevated rounded-[15px] p-4 w-[48%] mb-3 items-center border border-border-subtle"
                >
                  <Ionicons name="library" size={24} color="#C4C4D1" />
                  <Text className="text-text-primary text-sm font-semibold mt-2 text-center">
                    Sortie Culture
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Section */}
            <View className="bg-surface-elevated rounded-[15px] p-4 border border-border-subtle">
              <View className="flex-row items-center mb-2">
                <Ionicons name="bulb" size={20} color="#A3A3B4" />
                <Text className="text-text-primary font-semibold ml-2">
                  Conseils
                </Text>
              </View>
              <Text className="text-text-secondary text-sm leading-5">
                • Ajoutez des photos de qualité pour attirer plus de monde{"\n"}
                • Décrivez clairement vos événements{"\n"}• Restez authentique
                dans vos posts{"\n"}• Interagissez avec la communauté
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
