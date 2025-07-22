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
                Poster mon PicMe !
              </Text>
              <TouchableOpacity className="p-2">
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#A3A3B4"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
