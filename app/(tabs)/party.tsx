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
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
