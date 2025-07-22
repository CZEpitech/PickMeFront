import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExtendedProfile,
  UpdateProfileRequest,
  profileService,
} from "../services/profileService";
import { tokenStorage } from "../services/tokenStorage";

interface ProfileEditOverlayProps {
  visible: boolean;
  onClose: () => void;
  profile: ExtendedProfile | null;
  onProfileUpdate: (updatedProfile: ExtendedProfile) => void;
}

// Données prédéfinies
const COUNTRIES = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Luxembourg",
  "Monaco",
  "États-Unis",
  "Royaume-Uni",
  "Allemagne",
  "Espagne",
  "Italie",
  "Pays-Bas",
  "Portugal",
  "Autriche",
  "Suède",
  "Norvège",
  "Danemark",
  "Pologne",
  "République tchèque",
  "Hongrie",
  "Grèce",
  "Turquie",
  "Maroc",
  "Tunisie",
  "Algérie",
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Madagascar",
  "Mauritanie",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Tchad",
  "République centrafricaine",
  "République démocratique du Congo",
  "République du Congo",
  "Gabon",
  "Guinée équatoriale",
  "Burundi",
  "Rwanda",
  "Djibouti",
  "Comores",
  "Seychelles",
  "Maurice",
];

const LANGUAGES = [
  "Français",
  "English",
  "Español",
  "Deutsch",
  "Italiano",
  "Nederlands",
  "Português",
  "Svenska",
  "Norsk",
  "Dansk",
  "Polski",
  "Čeština",
  "Magyar",
  "Ελληνικά",
  "Türkçe",
  "العربية",
  "Русский",
  "中文",
  "日本語",
  "한국어",
  "हिन्दी",
  "Bahasa Indonesia",
  "ไทย",
  "Tiếng Việt",
];

const PRONOUNS = [
  "il/lui",
  "elle/elle",
  "iel/ellui",
  "il ou elle",
  "aucun pronom préféré",
  "they/them",
  "he/him",
  "she/her",
  "ze/zir",
  "xe/xem",
];

// Composants optimisés pour éviter les re-renders
const InputField = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = "default",
    error,
    maxLength,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    keyboardType?: any;
    error?: string;
    maxLength?: number;
  }) => (
    <View className="mb-4">
      <Text className="text-text-primary text-sm font-semibold mb-2">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7A7A8A"
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        className={`bg-surface-elevated border-2 ${
          error ? "border-red-500" : "border-border-subtle"
        } rounded-[15px] px-4 py-3 text-text-primary ${
          multiline ? "h-20 text-top" : "h-12"
        }`}
        style={multiline ? { textAlignVertical: "top" } : {}}
      />
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
      {maxLength && (
        <Text className="text-text-muted text-xs mt-1 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  )
);

const PickerField = React.memo(
  ({
    label,
    value,
    onPress,
    placeholder,
    error,
  }: {
    label: string;
    value: string;
    onPress: () => void;
    placeholder: string;
    error?: string;
  }) => (
    <View className="mb-4">
      <Text className="text-text-primary text-sm font-semibold mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className={`bg-surface-elevated border-2 ${
          error ? "border-red-500" : "border-border-subtle"
        } rounded-[15px] px-4 py-3 h-12 flex-row justify-between items-center`}
      >
        <Text
          className={`text-sm ${value ? "text-text-primary" : "text-text-muted"}`}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#7A7A8A" />
      </TouchableOpacity>
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  )
);

const DatePickerField = React.memo(
  ({
    label,
    value,
    onPress,
    placeholder,
    error,
  }: {
    label: string;
    value: string;
    onPress: () => void;
    placeholder: string;
    error?: string;
  }) => (
    <View className="mb-4">
      <Text className="text-text-primary text-sm font-semibold mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className={`bg-surface-elevated border-2 ${
          error ? "border-red-500" : "border-border-subtle"
        } rounded-[15px] px-4 py-3 h-12 flex-row justify-between items-center`}
      >
        <Text
          className={`text-sm ${value ? "text-text-primary" : "text-text-muted"}`}
        >
          {value ? new Date(value).toLocaleDateString("fr-FR") : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#7A7A8A" />
      </TouchableOpacity>
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  )
);

export default function ProfileEditOverlay({
  visible,
  onClose,
  profile,
  onProfileUpdate,
}: ProfileEditOverlayProps) {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    alias: "",
    birthdate: "",
    pays: "",
    langue: "",
    description: "",
    pronous: "",
    is_public: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (profile && visible) {
      const initialData = {
        alias: profile.alias || "",
        birthdate: profile.birthdate || "",
        pays: profile.pays || "",
        langue: profile.langue || "",
        description: profile.description || "",
        pronous: profile.pronous || "",
        is_public: profile.is_public,
      };
      setFormData(initialData);
      setErrors({});

      // Set initial date for picker
      if (profile.birthdate) {
        setSelectedDate(new Date(profile.birthdate));
      }
    }
  }, [profile, visible]);

  // Fonctions pour les pickers
  const showCountryPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", ...COUNTRIES],
          cancelButtonIndex: 0,
          title: "Choisir un pays",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            updateFormData("pays", COUNTRIES[buttonIndex - 1]);
          }
        }
      );
    } else {
      // Pour Android, on peut utiliser une Alert avec des boutons ou un modal custom
      Alert.alert(
        "Pays",
        "Sélection de pays (TODO: implémenter picker Android)"
      );
    }
  };

  const showLanguagePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", ...LANGUAGES],
          cancelButtonIndex: 0,
          title: "Choisir une langue",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            updateFormData("langue", LANGUAGES[buttonIndex - 1]);
          }
        }
      );
    } else {
      Alert.alert(
        "Langue",
        "Sélection de langue (TODO: implémenter picker Android)"
      );
    }
  };

  const showPronounsPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", ...PRONOUNS],
          cancelButtonIndex: 0,
          title: "Choisir des pronoms",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            updateFormData("pronous", PRONOUNS[buttonIndex - 1]);
          }
        }
      );
    } else {
      Alert.alert(
        "Pronoms",
        "Sélection de pronoms (TODO: implémenter picker Android)"
      );
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      updateFormData("birthdate", formattedDate);
    }
  };

  // Fonctions memoizées pour éviter les re-renders
  const updateFormData = useCallback(
    (key: keyof UpdateProfileRequest, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Callbacks memoizés pour les handlers
  const handleAliasChange = useCallback(
    (text: string) => updateFormData("alias", text),
    [updateFormData]
  );
  const handleDescriptionChange = useCallback(
    (text: string) => updateFormData("description", text),
    [updateFormData]
  );

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.alias || formData.alias.trim().length < 2) {
      newErrors.alias = "L'alias doit contenir au moins 2 caractères";
    }

    if (formData.alias && formData.alias.length > 30) {
      newErrors.alias = "L'alias ne peut pas dépasser 30 caractères";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description =
        "La description ne peut pas dépasser 500 caractères";
    }

    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        newErrors.birthdate = "Vous devez avoir au moins 13 ans";
      }

      if (birthDate > today) {
        newErrors.birthdate =
          "La date de naissance ne peut pas être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await tokenStorage.getToken();

      if (!token) {
        Alert.alert("Erreur", "Session expirée, veuillez vous reconnecter");
        onClose();
        return;
      }

      // Filtrer les champs vides pour n'envoyer que les données modifiées
      const updateData: UpdateProfileRequest = {};

      if (formData.alias && formData.alias !== profile?.alias) {
        updateData.alias = formData.alias;
      }
      if (formData.birthdate && formData.birthdate !== profile?.birthdate) {
        updateData.birthdate = formData.birthdate;
      }
      if (formData.pays && formData.pays !== profile?.pays) {
        updateData.pays = formData.pays;
      }
      if (formData.langue && formData.langue !== profile?.langue) {
        updateData.langue = formData.langue;
      }
      if (formData.description !== profile?.description) {
        updateData.description = formData.description;
      }
      if (formData.pronous && formData.pronous !== profile?.pronous) {
        updateData.pronous = formData.pronous;
      }
      if (formData.is_public !== profile?.is_public) {
        updateData.is_public = formData.is_public;
      }

      // Si aucun changement, on ferme juste l'overlay
      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      const result = await profileService.updateMyProfile(token, updateData);

      if (result.success && result.data) {
        // S'assurer que les données sont bien à jour avant de les passer au parent
        const updatedProfile: ExtendedProfile = {
          ...profile!,
          ...result.data,
          ...updateData,
        };

        onProfileUpdate(updatedProfile);
        Alert.alert("Succès", "Profil mis à jour avec succès", [
          { text: "OK", onPress: onClose },
        ]);
      } else {
        Alert.alert(
          "Erreur",
          result.message || "Erreur lors de la mise à jour du profil"
        );
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler les modifications",
      "Êtes-vous sûr de vouloir annuler ? Vos modifications seront perdues.",
      [
        { text: "Continuer l'édition", style: "cancel" },
        { text: "Annuler", style: "destructive", onPress: onClose },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-primary-bg">
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-border-subtle">
            <TouchableOpacity onPress={handleCancel} className="p-2 -ml-2">
              <Ionicons name="close" size={24} color="#7A7A8A" />
            </TouchableOpacity>

            <Text className="text-primary-text text-lg font-bold">
              Modifier le profil
            </Text>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className={`px-4 py-2 rounded-[15px] ${
                isLoading
                  ? "bg-surface-pressed"
                  : "bg-surface-elevated border border-border-subtle"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isLoading ? "text-text-muted" : "text-text-primary"
                }`}
              >
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 20 }}
            >
              <InputField
                label="Pseudo *"
                value={formData.alias || ""}
                onChangeText={handleAliasChange}
                placeholder="Votre nom d'utilisateur"
                error={errors.alias}
                maxLength={30}
              />

              <InputField
                label="Description"
                value={formData.description || ""}
                onChangeText={handleDescriptionChange}
                placeholder="Parlez-nous de vous..."
                multiline
                error={errors.description}
                maxLength={500}
              />

              <DatePickerField
                label="Date de naissance"
                value={formData.birthdate || ""}
                onPress={() => setShowDatePicker(true)}
                placeholder="Sélectionner une date"
                error={errors.birthdate}
              />

              <PickerField
                label="Pays"
                value={formData.pays || ""}
                onPress={showCountryPicker}
                placeholder="Sélectionner un pays"
              />

              <PickerField
                label="Langue"
                value={formData.langue || ""}
                onPress={showLanguagePicker}
                placeholder="Sélectionner une langue"
              />

              <PickerField
                label="Pronoms"
                value={formData.pronous || ""}
                onPress={showPronounsPicker}
                placeholder="Sélectionner des pronoms"
              />

              {/* Visibility Toggle */}
              <View className="mb-6">
                <Text className="text-text-primary text-sm font-semibold mb-3">
                  Visibilité du profil
                </Text>
                <View className="bg-surface-elevated border-2 border-border-subtle rounded-[15px] p-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-4">
                      <Text className="text-text-primary text-sm font-semibold">
                        Profil {formData.is_public ? "public" : "privé"}
                      </Text>
                      <Text className="text-text-muted text-xs mt-1">
                        {formData.is_public
                          ? "Visible par tous les utilisateurs"
                          : "Visible uniquement par vos amis"}
                      </Text>
                    </View>
                    <Switch
                      value={formData.is_public}
                      onValueChange={(value) =>
                        updateFormData("is_public", value)
                      }
                      trackColor={{ false: "#7A7A8A", true: "#F5C74D" }}
                      thumbColor={formData.is_public ? "#8894B9" : "#f4f3f4"}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
      </View>
    </Modal>
  );
}
