import React, { ReactNode } from "react";
import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  activeTab?: 'home' | 'party' | 'add' | 'notifications' | 'profile';
  onTabPress?: (tab: string) => void;
}

export default function AuthenticatedLayout({ 
  children, 
  activeTab = 'home',
  onTabPress
}: AuthenticatedLayoutProps) {
  
  const handleNavPress = (tab: string) => {
    if (onTabPress) {
      onTabPress(tab);
    } else {
      // Default navigation behavior
      Alert.alert("Navigation", `Navigation vers ${tab} à implémenter`);
    }
  };

  return (
    <View className="flex-1 bg-primary-bg">
      <SafeAreaView className="flex-1" edges={['top']}>
        {children}
      </SafeAreaView>
    </View>
  );
}