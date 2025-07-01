import React from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { BottomNavBar } from "../components/BottomNavBar";

export default function MainLayout() {
  return (
    <View className="flex-1 bg-background-primary">
      {/* Contenu principal avec padding bottom pour la nav bar */}
      <View className="flex-1" style={{ paddingBottom: 90 }}>
        <Slot />
      </View>
      
      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </View>
  );
}