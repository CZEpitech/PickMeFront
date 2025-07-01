import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../components";
import { useAuth, useFriends, useUserImages } from "../hooks";

interface UserImage {
  id: string;
  image_link: string;
  is_pinned: boolean;
  created_at: string;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { images, loading, refreshing, refreshImages, getRecentPhotosCount } =
    useUserImages();
  const { getFriendsCount } = useFriends();
  const screenWidth = Dimensions.get("window").width;

  const onRefresh = refreshImages;

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("../auth");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("../profile-edit");
  };

  const handleAddBio = () => {
    router.push("../profile-edit");
  };

  const handleAddLocation = () => {
    Alert.alert("Localisation", "Fonctionnalité à venir");
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Découvrez le profil de ${user?.alias} sur PickMe !`,
        title: `Profil de ${user?.alias}`,
      });
    } catch (error) {
      console.error("❌ Error sharing profile:", error);
    }
  };

  const getInitials = (alias: string) => {
    return alias.substring(0, 2).toUpperCase();
  };

  const renderAvatar = () => {
    const recentCount = getRecentPhotosCount();

    return (
      <View className="items-center mb-4">
        <View className="relative">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-24 h-24 rounded-full"
              onError={() => console.log("❌ Avatar failed to load")}
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
              <Text className="text-black text-2xl font-bold">
                {getInitials(user?.alias || "U")}
              </Text>
            </View>
          )}

          {/* Badge pour les photos récentes */}
          {recentCount > 0 && (
            <View className="absolute -bottom-1 left-1/2 -ml-4 bg-orange-500 rounded-full px-2 py-1 flex-row items-center">
              <Ionicons
                name="flame"
                size={12}
                color="white"
                style={{ marginRight: 4 }}
              />
              <Text className="text-white text-xs font-bold">
                {recentCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderActionButtons = () => {
    return (
      <View className="flex-row mb-6 px-4">
        <TouchableOpacity
          onPress={handleAddBio}
          className="flex-1 bg-transparent border border-white rounded-full py-3 px-4 mr-2"
        >
          <View className="flex-row items-center justify-center">
            <Feather
              name="edit-3"
              size={14}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white text-center text-sm font-medium">
              {user?.description ? "Modifier la bio" : "Ajouter une bio"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAddLocation}
          className="flex-1 bg-transparent border border-white rounded-full py-3 px-4 ml-2"
        >
          <View className="flex-row items-center justify-center">
            <Feather
              name="map-pin"
              size={14}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white text-center text-sm font-medium">
              Ajouter la localisation
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStats = () => {
    return (
      <View className="flex-row justify-center mb-6">
        <View className="items-center mx-8">
          <Text className="text-white text-2xl font-bold">{images.length}</Text>
          <Text className="text-text-muted text-sm">PickMes</Text>
        </View>

        <View className="items-center mx-8">
          <Text className="text-white text-2xl font-bold">
            {getFriendsCount()}
          </Text>
          <Text className="text-text-muted text-sm">Amis</Text>
        </View>
      </View>
    );
  };

  const renderShareButton = () => {
    return (
      <TouchableOpacity
        onPress={handleShareProfile}
        className="mx-4 mb-6 bg-background-tertiary rounded-xl py-4"
      >
        <View className="flex-row items-center justify-center">
          <Feather
            name="share"
            size={18}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white text-base font-medium">
            Partager le Profil
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeletonPhotos = () => {
    // Configuration BeReal - Rectangle d'or en mode portrait
    // Notre grille ajoute px-4 (16px de chaque côté) = 32px total
    const totalPadding = 32;
    const availableWidth = screenWidth - totalPadding;
    const gap = 4; // Gap entre photos comme BeReal
    const photoWidth = (availableWidth - gap * 2) / 3; // 3 photos par ligne
    const photoHeight = photoWidth * 1.618; // Rectangle d'or en mode portrait (φ = 1.618)

    // Créer 5 lignes de 3 photos chacune
    const rows = Array.from({ length: 5 }, (_, rowIndex) => (
      <View key={rowIndex} className="flex-row mb-1" style={{ gap: gap }}>
        {Array.from({ length: 3 }, (_, photoIndex) => (
          <View
            key={photoIndex}
            className="rounded-xl"
            style={{
              width: photoWidth,
              height: photoHeight,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#8E8E93", // Gris iOS plus subtil
              borderStyle: "dashed",
            }}
          />
        ))}
      </View>
    ));

    return <View className="px-4">{rows}</View>;
  };

  const renderPhotosGrid = () => {
    if (images.length === 0) {
      return (
        <View>
          {/* Squelettes BeReal-like */}
          {renderSkeletonPhotos()}
        </View>
      );
    }

    // Disposition BeReal avec rectangle d'or pour les vraies photos
    const totalPadding = 32; // Même calcul que les squelettes
    const availableWidth = screenWidth - totalPadding;
    const gap = 4;
    const photoWidth = (availableWidth - gap * 2) / 3; // 3 photos par ligne, taille uniforme
    const photoHeight = photoWidth * 1.618; // Rectangle d'or en mode portrait

    const rows: React.ReactElement[] = [];
    let currentRow: React.ReactElement[] = [];

    images.forEach((image) => {
      // 3 photos par ligne maximum
      if (currentRow.length >= 3) {
        rows.push(
          <View
            key={rows.length}
            className="flex-row mb-1"
            style={{ gap: gap }}
          >
            {currentRow}
          </View>
        );
        currentRow = [];
      }

      currentRow.push(
        <TouchableOpacity
          key={image.id}
          className="relative"
          style={{ width: photoWidth, height: photoHeight }}
          onPress={() => Alert.alert("Image", "Fonctionnalité à venir")}
        >
          <Image
            source={{ uri: image.image_link }}
            className="w-full h-full rounded-xl"
            onError={() => console.log("❌ Image failed to load:", image.id)}
          />
          {image.is_pinned && (
            <View className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full w-5 h-5 items-center justify-center">
              <Ionicons name="star" size={10} color="white" />
            </View>
          )}
        </TouchableOpacity>
      );
    });

    // Ajouter la dernière ligne si elle n'est pas vide
    if (currentRow.length > 0) {
      rows.push(
        <View key={rows.length} className="flex-row mb-1" style={{ gap: gap }}>
          {currentRow}
        </View>
      );
    }

    return <View className="px-4">{rows}</View>;
  };

  if (!user) {
    return (
      <ScreenWrapper>
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-text-secondary">Chargement...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* Header avec déconnexion */}
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity onPress={handleEditProfile}>
          <Feather name="settings" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Avatar avec badge */}
        {renderAvatar()}

        {/* Nom */}
        <Text className="text-white text-2xl font-bold text-center mb-4">
          {user.alias}
        </Text>

        {/* Description si elle existe */}
        {user.description && (
          <Text className="text-text-secondary text-center mb-6 px-8 text-base">
            {user.description}
          </Text>
        )}

        {/* Boutons d'action */}
        {renderActionButtons()}

        {/* Statistiques */}
        {renderStats()}

        {/* Bouton partager */}
        {renderShareButton()}

        {/* Message informatif */}
        <Text className="text-text-muted text-center text-xs mb-6 px-8">
          Vos PickMes sont privés et éphémères sauf s&apos;ils sont marqués avec
          ⭐
        </Text>

        {/* Grid de photos */}
        {renderPhotosGrid()}
      </ScrollView>
    </ScreenWrapper>
  );
}
