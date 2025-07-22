import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { profileService } from "../services/profileService";
import { tokenStorage } from "../services/tokenStorage";

interface AvatarPickerOverlayProps {
  visible: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export default function AvatarPickerOverlay({
  visible,
  onClose,
  currentAvatar,
  onAvatarUpdate,
}: AvatarPickerOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de votre permission pour accéder à votre galerie photo."
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de votre permission pour accéder à votre appareil photo."
      );
      return false;
    }
    return true;
  };

  const uploadImageToAPI = async (imageUri: string): Promise<string | null> => {
    try {
      setUploadProgress(0);

      const token = await tokenStorage.getToken();
      if (!token) {
        Alert.alert("Erreur", "Session expirée, veuillez vous reconnecter");
        return null;
      }

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // For now, we'll use the local URI directly in the profile
      // In a real production environment, you would:
      // 1. Upload the image to a cloud storage service (AWS S3, Cloudinary, etc.)
      // 2. Get back a public URL
      // 3. Update the profile with that public URL

      const profileUpdateResult = await profileService.updateMyProfile(token, {
        avatar: imageUri,
      });

      if (profileUpdateResult.success) {
        return imageUri;
      } else {
        Alert.alert(
          "Erreur",
          profileUpdateResult.message ||
            "Erreur lors de la mise à jour du profil"
        );
        return null;
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur inattendue s'est produite lors de l'upload"
      );
      return null;
    }
  };

  const handleImagePicker = useCallback(
    async (source: "camera" | "gallery") => {
      setIsLoading(true);

      try {
        let hasPermission = true;

        if (source === "camera") {
          hasPermission = await requestCameraPermissions();
        } else {
          hasPermission = await requestPermissions();
        }

        if (!hasPermission) {
          setIsLoading(false);
          return;
        }

        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1] as [number, number],
          quality: 0.8,
          base64: false,
        };

        let result;

        if (source === "camera") {
          result = await ImagePicker.launchCameraAsync(options);
        } else {
          result = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];

          const uploadedUrl = await uploadImageToAPI(asset.uri);

          if (uploadedUrl) {
            onAvatarUpdate(uploadedUrl);
            Alert.alert(
              "Succès",
              "Votre photo de profil a été mise à jour avec succès !",
              [{ text: "OK", onPress: onClose }]
            );
          }
        }
      } catch (error) {
        Alert.alert("Erreur", "Impossible d'ouvrir le sélecteur d'images");
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    },
    [onAvatarUpdate, onClose]
  );

  const handleRemoveAvatar = useCallback(async () => {
    Alert.alert(
      "Supprimer la photo",
      "Êtes-vous sûr de vouloir supprimer votre photo de profil ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);

            try {
              const token = await tokenStorage.getToken();
              if (!token) {
                Alert.alert(
                  "Erreur",
                  "Session expirée, veuillez vous reconnecter"
                );
                return;
              }

              // Update profile to remove avatar - try empty string since API requires string
              const result = await profileService.updateMyProfile(token, {
                avatar: "",
              });

              if (result.success) {
                onAvatarUpdate("");
                Alert.alert(
                  "Photo supprimée",
                  "Votre photo de profil a été supprimée.",
                  [{ text: "OK", onPress: onClose }]
                );
              } else {
                Alert.alert(
                  "Erreur",
                  result.message || "Erreur lors de la suppression de la photo"
                );
              }
            } catch (error) {
              Alert.alert("Erreur", "Une erreur inattendue s'est produite");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }, [onAvatarUpdate, onClose]);

  const showImagePickerOptions = () => {
    const options = [
      "Annuler",
      "Prendre une photo",
      "Choisir depuis la galerie",
    ];

    if (currentAvatar) {
      options.push("Supprimer la photo actuelle");
    }

    if (Platform.OS === "ios") {
      const { ActionSheetIOS } = require("react-native");
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
          destructiveButtonIndex: currentAvatar ? 3 : undefined,
          title: "Photo de profil",
        },
        (buttonIndex: number) => {
          switch (buttonIndex) {
            case 1:
              handleImagePicker("camera");
              break;
            case 2:
              handleImagePicker("gallery");
              break;
            case 3:
              if (currentAvatar) handleRemoveAvatar();
              break;
          }
        }
      );
    } else {
      Alert.alert("Photo de profil", "Que souhaitez-vous faire ?", [
        { text: "Annuler", style: "cancel" },
        {
          text: "Prendre une photo",
          onPress: () => handleImagePicker("camera"),
        },
        {
          text: "Choisir depuis la galerie",
          onPress: () => handleImagePicker("gallery"),
        },
        ...(currentAvatar
          ? [
              {
                text: "Supprimer la photo",
                style: "destructive" as const,
                onPress: handleRemoveAvatar,
              },
            ]
          : []),
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <SafeAreaView className="w-full max-w-sm mx-4">
          <View className="bg-primary-bg rounded-[20px] p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-primary-text text-lg font-bold">
                Photo de profil
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#7A7A8A" />
              </TouchableOpacity>
            </View>

            {/* Current Avatar Preview */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 rounded-full bg-surface-elevated items-center justify-center mb-4 overflow-hidden border-2 border-border-subtle">
                {currentAvatar ? (
                  <Image
                    source={{ uri: currentAvatar }}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={60} color="#A3A3B4" />
                )}
              </View>

              {isLoading && (
                <View className="items-center">
                  <ActivityIndicator size="small" color="#A3A3B4" />
                  <Text className="text-text-muted text-xs mt-2">
                    Upload en cours... {uploadProgress}%
                  </Text>
                </View>
              )}
            </View>

            {/* Action Button */}
            <TouchableOpacity
              onPress={showImagePickerOptions}
              disabled={isLoading}
              className={`bg-surface-elevated rounded-[15px] h-12 justify-center items-center mb-4 border border-border-subtle ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={currentAvatar ? "create-outline" : "camera-outline"}
                  size={20}
                  color="#C4C4D1"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-text-primary text-sm font-bold">
                  {currentAvatar ? "Modifier la photo" : "Ajouter une photo"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Info Text */}
            <Text className="text-text-muted text-xs text-center leading-4">
              Votre photo de profil sera visible par les autres utilisateurs.
              Assurez-vous qu'elle respecte les conditions d'utilisation.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
