import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { tokenStorage } from "../services/tokenStorage";

// Custom Tab Bar Component intégré
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabIcons = {
    home: require("../../assets/images/home_icon.png"),
    party: require("../../assets/images/partyhorn_icon.png"),
    add: require("../../assets/images/add_icon.png"),
    notifications: require("../../assets/images/ring_icon.png"), // Garde l'icône existante pour l'instant
    profile: require("../../assets/images/user_icon.png"),
  };

  const tabSizes = {
    home: { width: 28, height: 25 },
    party: { width: 25, height: 25 },
    add: { width: 30, height: 30 },
    notifications: { width: 33, height: 24 },
    profile: { width: 22, height: 24 },
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        pointerEvents: "box-none", // Changé de 'none' à 'box-none'
      }}
    >
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
          pointerEvents: "auto",
        }}
      >
        <View
          style={{
            backgroundColor: "#F5C74D",
            borderRadius: 28,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 22,
            paddingVertical: 7,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 35,
            }}
          >
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              const onPress = () => {
                if (!isFocused) {
                  try {
                    navigation.navigate(route.name);
                  } catch (error) {
                    console.error(`❌ [CUSTOM_TAB] Navigation failed:`, error);
                  }
                } else {
                }
              };

              const onPressIn = () => {};

              const onPressOut = () => {};

              const iconSource = tabIcons[route.name as keyof typeof tabIcons];
              const size = tabSizes[route.name as keyof typeof tabSizes];

              if (!iconSource || !size) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                    minHeight: 40,
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={iconSource}
                      style={{
                        width: size.width,
                        height: size.height,
                        opacity: isFocused ? 1 : 0.5,
                        transform: isFocused
                          ? [{ scale: 1.1 }]
                          : [{ scale: 1 }],
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await tokenStorage.getToken();
      if (!token) {
        router.replace("/auth");
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      router.replace("/auth");
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#1A1B3A" }}>
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={(props) => <CustomTabBar {...props} />}
          initialRouteName="home"
        >
          {/* Réorganisation de l'ordre des tabs */}
          <Tabs.Screen
            name="home"
            options={{
              title: "Accueil",
            }}
          />

          <Tabs.Screen
            name="party"
            options={{
              title: "Événements",
            }}
          />
          <Tabs.Screen
            name="add"
            options={{
              title: "Ajouter",
            }}
          />

          <Tabs.Screen
            name="notifications"
            options={{
              title: "Recherche",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profil",
            }}
          />
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}
