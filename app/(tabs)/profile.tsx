import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarPickerOverlay from "../components/AvatarPickerOverlay";
import ProfileEditOverlay from "../components/ProfileEditOverlay";
import { authService, User } from "../services/authService";
import { Friend, friendsService } from "../services/friendsService";
import { ImageItem, imagesService } from "../services/imagesService";
import { ExtendedProfile, profileService } from "../services/profileService";
import { tokenStorage } from "../services/tokenStorage";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const token = await tokenStorage.getToken();

      if (!token) {
        router.replace("/auth");
        return;
      }

      // Load user profile
      const authResult = await authService.verifyToken(token);
      if (!authResult.success || !authResult.data?.user) {
        await tokenStorage.removeToken();
        router.replace("/auth");
        return;
      }

      setUser(authResult.data.user);
      setProfile(authResult.data.profile || null);

      // Load additional profile data
      const [profileResult, friendsResult, imagesResult] =
        await Promise.allSettled([
          profileService.getMyProfile(token),
          friendsService.getFriendsList(token, "accepted", 1, 5),
          imagesService.getMyImages(token, 1, 6),
        ]);

      // Handle profile data
      if (profileResult.status === "fulfilled" && profileResult.value.success) {
        setProfile(
          profileResult.value.data?.profile || authResult.data.profile || null
        );
      }

      // Handle friends data
      if (friendsResult.status === "fulfilled" && friendsResult.value.success) {
        setFriends(friendsResult.value.data || []);
        setFriendsCount(friendsResult.value.data?.length || 0);
      }

      // Handle images data
      if (imagesResult.status === "fulfilled" && imagesResult.value.success) {
        setImages(imagesResult.value.data || []);
        setImagesCount(imagesResult.value.data?.length || 0);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger le profil");
      router.replace("/auth");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadProfileData();
  };

  const handleEditProfile = () => {
    setShowEditOverlay(true);
  };

  const handleAvatarClick = () => {
    setShowAvatarPicker(true);
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    // Update profile state immediately
    if (profile) {
      // If empty string, treat as null for display purposes
      const updatedProfile = { ...profile, avatar: avatarUrl || null };
      setProfile(updatedProfile);
    }

    setShowAvatarPicker(false);

    // Optionally refresh profile data to ensure consistency
    try {
      await loadProfileData();
    } catch (error) {}
  };

  const handleProfileUpdate = async (updatedProfile: ExtendedProfile) => {
    // Mettre à jour le profil immédiatement
    setProfile(updatedProfile);
    setShowEditOverlay(false);

    // Optionnel : recharger toutes les données pour s'assurer de la cohérence
    try {
      await loadProfileData();
    } catch (error) {
      // L'erreur n'est pas critique car on a déjà mis à jour les données localement
    }
  };

  const handleViewFriends = () => {
    Alert.alert("Amis", "Page des amis en cours de développement");
  };

  const handleViewImages = () => {
    Alert.alert("Photos", "Galerie de photos en cours de développement");
  };

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            await tokenStorage.removeToken();
            router.replace("/auth");
          } catch (error) {}
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary-bg justify-center items-center">
        <Ionicons name="person-circle-outline" size={80} color="#F5C74D" />
        <Text className="text-primary-text text-lg font-bold mt-4">
          Chargement du profil...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-bg">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#F5C74D"
              colors={["#F5C74D"]}
            />
          }
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6 bg-primary-bg">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Text className="text-primary-text text-2xl font-bold">
                  Mon Profil
                </Text>
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="ml-3 p-1"
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={20} color="#F5C74D" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleLogout} className="p-2">
                <Ionicons name="log-out-outline" size={24} color="#F5C74D" />
              </TouchableOpacity>
            </View>

            {/* Profile Avatar & Info */}
            <View className="items-center mb-6">
              <TouchableOpacity
                onPress={handleAvatarClick}
                className="w-24 h-24 rounded-full bg-surface-elevated items-center justify-center mb-4 relative border-2 border-border-strong"
                activeOpacity={0.7}
              >
                {profile?.avatar ? (
                  <Image
                    source={{ uri: profile.avatar }}
                    className="w-24 h-24 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={40} color="#A3A3B4" />
                )}

                {/* Camera icon overlay */}
                <View className="absolute bottom-0 right-0 w-6 h-6 bg-surface-pressed rounded-full items-center justify-center border-2 border-primary-bg">
                  <Ionicons name="camera" size={12} color="#C4C4D1" />
                </View>
              </TouchableOpacity>

              <Text className="text-primary-text text-xl font-bold mb-1">
                @{profile?.alias || "Utilisateur"}
              </Text>

              <Text className="text-text-secondary text-sm opacity-70 mb-3">
                {user?.email}
              </Text>

              {profile?.description && (
                <Text className="text-text-secondary text-center text-sm opacity-90 px-4">
                  {profile.description}
                </Text>
              )}
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-around mb-6">
              <TouchableOpacity
                onPress={handleViewFriends}
                className="items-center"
              >
                <Text className="text-text-primary text-lg font-bold">
                  {friendsCount}
                </Text>
                <Text className="text-text-secondary text-xs opacity-70">
                  Amis
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleViewImages}
                className="items-center"
              >
                <Text className="text-text-primary text-lg font-bold">
                  {imagesCount}
                </Text>
                <Text className="text-text-secondary text-xs opacity-70">
                  Photos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Sections */}
          <View className="px-6 py-4">
            {/* Recent Photos Section */}
            {images.length > 0 && (
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-primary text-lg font-bold">
                    Photos récentes
                  </Text>
                  <TouchableOpacity onPress={handleViewImages}>
                    <Text className="text-text-muted text-sm opacity-70">
                      Voir tout
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap justify-between">
                  {images.slice(0, 6).map((image) => (
                    <TouchableOpacity
                      key={image.id}
                      className="w-[30%] aspect-square rounded-[15px] overflow-hidden mb-2 bg-surface-elevated border border-border-subtle"
                    >
                      <Image
                        source={{ uri: image.image_link }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      {image.is_pinned && (
                        <View className="absolute top-2 right-2 bg-surface-pressed rounded-full p-1">
                          <Ionicons name="star" size={12} color="#F5C74D" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Friends Section */}
            {friends.length > 0 && (
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-primary text-lg font-bold">
                    Amis
                  </Text>
                  <TouchableOpacity onPress={handleViewFriends}>
                    <Text className="text-text-muted text-sm opacity-70">
                      Voir tout
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap">
                  {friends.slice(0, 4).map((friend) => (
                    <View
                      key={friend.id}
                      className="w-[22%] items-center mr-4 mb-3"
                    >
                      <View className="w-12 h-12 rounded-full bg-surface-elevated items-center justify-center mb-1 border border-border-subtle">
                        {friend.avatar ? (
                          <Image
                            source={{ uri: friend.avatar }}
                            className="w-12 h-12 rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="person" size={20} color="#A3A3B4" />
                        )}
                      </View>
                      <Text
                        className="text-text-secondary text-xs text-center font-medium"
                        numberOfLines={1}
                      >
                        @{friend.alias}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Empty States */}
            {images.length === 0 && (
              <View className="items-center py-8">
                <Ionicons name="images-outline" size={48} color="#7A7A8A" />
                <Text className="text-text-muted text-center mt-2">
                  Aucune photo pour le moment
                </Text>
                <TouchableOpacity className="mt-2">
                  <Text className="text-text-muted text-sm font-medium">
                    Ajouter une photo
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {friends.length === 0 && (
              <View className="items-center py-8">
                <Ionicons name="people-outline" size={48} color="#7A7A8A" />
                <Text className="text-text-muted text-center mt-2">
                  Aucun ami pour le moment
                </Text>
                <TouchableOpacity className="mt-2">
                  <Text className="text-text-muted text-sm font-medium">
                    Rechercher des amis
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Profile Edit Overlay */}
        <ProfileEditOverlay
          visible={showEditOverlay}
          onClose={() => setShowEditOverlay(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Avatar Picker Overlay */}
        <AvatarPickerOverlay
          visible={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          currentAvatar={profile?.avatar}
          onAvatarUpdate={handleAvatarUpdate}
        />
      </SafeAreaView>
    </View>
  );
}
