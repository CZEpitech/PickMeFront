import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function IndexScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule un temps de chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-primary">
        <Text className="text-base text-text-secondary">Chargement...</Text>
      </View>
    );
  }

  // Redirection basée sur l'état d'authentification
  if (user) {
    return <Redirect href="./main/profile" />;
  } else {
    return <Redirect href="./auth" />;
  }
}
