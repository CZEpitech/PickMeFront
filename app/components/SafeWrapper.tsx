import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

// 📱 Wrapper principal pour les écrans
export const ScreenWrapper: React.FC<SafeWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <SafeAreaView
      className={`flex-1 bg-background-primary ${className}`}
      edges={["top"]}
    >
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};

// 🔝 Wrapper top uniquement
export const SafeTopWrapper: React.FC<SafeWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <SafeAreaView
      className={`bg-background-primary ${className}`}
      edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
};

// 🔽 Wrapper bottom uniquement
export const SafeBottomWrapper: React.FC<SafeWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <SafeAreaView
      className={`bg-background-primary ${className}`}
      edges={["bottom"]}
    >
      {children}
    </SafeAreaView>
  );
};
