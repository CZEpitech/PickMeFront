import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface TabItem {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TABS: TabItem[] = [
  {
    name: "home",
    route: "/main/home",
    icon: "home-outline",
    iconFocused: "home",
    label: "Accueil",
  },
  {
    name: "discover",
    route: "/main/discover",
    icon: "compass-outline",
    iconFocused: "compass",
    label: "Découvrir",
  },
  {
    name: "friends",
    route: "/main/friends",
    icon: "people-outline",
    iconFocused: "people",
    label: "Amis",
  },
  {
    name: "profile",
    route: "/main/profile",
    icon: "person-outline",
    iconFocused: "person",
    label: "Profil",
  },
];

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const isTabActive = (tabRoute: string) => {
    return pathname === tabRoute || pathname.startsWith(tabRoute);
  };

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0">
      {/* iOS-style background avec blur effect simulé */}
      <View 
        className="bg-background-secondary border-t border-border-primary"
        style={{
          paddingBottom: Platform.OS === "ios" ? 34 : 16, // Safe area bottom pour iOS
          paddingTop: 8,
        }}
      >
        <View className="flex-row justify-around items-center px-4">
          {TABS.map((tab) => {
            const isActive = isTabActive(tab.route);
            
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => handleTabPress(tab.route)}
                className="items-center justify-center py-1 px-2 min-w-0 flex-1"
                activeOpacity={0.6}
              >
                {/* Icône avec style iOS */}
                <View className="items-center justify-center mb-1">
                  <Ionicons
                    name={isActive ? tab.iconFocused : tab.icon}
                    size={24}
                    color={isActive ? "#FFFFFF" : "#8E8E93"}
                  />
                </View>
                
                {/* Label avec typographie iOS */}
                <Text
                  className={`text-xs font-medium ${
                    isActive ? "text-text-primary" : "text-text-muted"
                  }`}
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    letterSpacing: -0.2,
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};