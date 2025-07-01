import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Input, ScreenWrapper, Section } from "./components";
import { useAuth } from "./context/AuthContext";
import { ProfileUpdateData, ProfileValidationErrors } from "./types/auth";

const COUNTRIES = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "US", name: "États-Unis", flag: "🇺🇸" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
  { code: "ES", name: "Espagne", flag: "🇪🇸" },
  { code: "IT", name: "Italie", flag: "🇮🇹" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "JP", name: "Japon", flag: "🇯🇵" },
  { code: "AU", name: "Australie", flag: "🇦🇺" },
  { code: "BR", name: "Brésil", flag: "🇧🇷" },
  { code: "MX", name: "Mexique", flag: "🇲🇽" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱" },
  { code: "BE", name: "Belgique", flag: "🇧🇪" },
  { code: "CH", name: "Suisse", flag: "🇨🇭" },
  { code: "SE", name: "Suède", flag: "🇸🇪" },
  { code: "NO", name: "Norvège", flag: "🇳🇴" },
  { code: "DK", name: "Danemark", flag: "🇩🇰" },
  { code: "FI", name: "Finlande", flag: "🇫🇮" },
  { code: "PL", name: "Pologne", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
];

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const PRONOUNS = [
  "il/lui",
  "elle/elle",
  "iel/ielle",
  "they/them",
  "he/him",
  "she/her",
  "autre",
];

export default function ProfileEditScreen() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showPronounsPicker, setShowPronounsPicker] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<ProfileUpdateData>({
    alias: "",
    birthdate: "",
    pays: "",
    langue: "",
    description: "",
    avatar: "",
    pronous: "",
    is_public: false,
  });
  const [validationErrors, setValidationErrors] =
    useState<ProfileValidationErrors>({});

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        alias: user.alias || "",
        birthdate: user.birthdate || "",
        pays: user.pays || "",
        langue: user.langue || "",
        description: user.description || "",
        avatar: user.avatar || "",
        pronous: user.pronous || "",
        is_public: user.is_public || false,
      });
      // Initialiser les langues sélectionnées
      if (user.langue) {
        setSelectedLanguages(user.langue.split(", ").filter(Boolean));
      }
    }
  }, [user]);

  // Validation des champs
  const validateField = (field: string, value: string | boolean) => {
    let error = "";

    switch (field) {
      case "alias":
        if (typeof value === "string") {
          if (value.length < 3) {
            error = "Au moins 3 caractères requis";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            error = "Lettres, chiffres et _ uniquement";
          }
        }
        break;
      case "birthdate":
        if (typeof value === "string" && value) {
          const date = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          if (isNaN(date.getTime())) {
            error = "Format de date invalide";
          } else if (age < 18) {
            error = "Vous devez avoir au moins 18 ans";
          } else if (age > 120) {
            error = "Âge invalide";
          }
        }
        break;
      case "description":
        if (typeof value === "string" && value.length > 500) {
          error = "Maximum 500 caractères";
        }
        break;
      case "avatar":
        if (typeof value === "string" && value) {
          const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
          if (!urlRegex.test(value)) {
            error = "URL d'image invalide";
          }
        }
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (typeof value === "string") {
      validateField(field, value);
    }
  };

  // Gestion du DatePicker
  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Sélectionner une date";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const getSelectedDate = () => {
    if (formData.birthdate) {
      return new Date(formData.birthdate);
    }
    // Date par défaut : 25 ans
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 25);
    return defaultDate;
  };

  const openDatePicker = () => {
    const currentDate = formData.birthdate
      ? new Date(formData.birthdate)
      : getSelectedDate();
    setTempDate(currentDate);
    setShowDatePicker(true);
  };

  const confirmDateSelection = () => {
    // Validation de l'âge
    const today = new Date();
    const age = today.getFullYear() - tempDate.getFullYear();
    const monthDiff = today.getMonth() - tempDate.getMonth();
    const dayDiff = today.getDate() - tempDate.getDate();

    // Calcul précis de l'âge
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < 18) {
      Alert.alert(
        "Âge invalide",
        "Vous devez avoir au moins 18 ans pour utiliser cette application."
      );
      return;
    }

    if (actualAge > 120) {
      Alert.alert(
        "Date invalide",
        "Veuillez entrer une date de naissance valide."
      );
      return;
    }

    const dateString = tempDate.toISOString().split("T")[0];
    updateFormData("birthdate", dateString);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  // Fonctions pour les pickers
  const getCountryDisplay = (countryCode: string) => {
    if (!countryCode) return "Sélectionner un pays";
    const country = COUNTRIES.find(
      (c) => c.code === countryCode || c.name === countryCode
    );
    return country ? `${country.flag} ${country.name}` : countryCode;
  };

  const getLanguagesDisplay = () => {
    if (selectedLanguages.length === 0) return "Sélectionner des langues";
    return selectedLanguages
      .map((code) => {
        const lang = LANGUAGES.find((l) => l.code === code);
        return lang ? `${lang.flag} ${lang.name}` : code;
      })
      .join(", ");
  };

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages((prev) => {
      const newLangs = prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode];
      updateFormData("langue", newLangs.join(", "));
      return newLangs;
    });
  };

  const selectCountry = (country: (typeof COUNTRIES)[0]) => {
    updateFormData("pays", country.code);
    setShowCountryPicker(false);
  };

  const selectPronouns = (pronouns: string) => {
    updateFormData("pronous", pronouns);
    setShowPronounsPicker(false);
  };

  const handleSubmit = async () => {
    // Validation de tous les champs
    const fieldsToValidate = ["alias", "birthdate", "description", "avatar"];
    let hasErrors = false;

    for (const field of fieldsToValidate) {
      const fieldValue = formData[field as keyof ProfileUpdateData];
      if (!validateField(field, fieldValue as string)) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    if (!formData.alias?.trim()) {
      Alert.alert("Erreur", "L'alias est requis");
      return;
    }

    setLoading(true);

    try {
      // Préparer les données à envoyer (ne pas envoyer les champs vides)
      const dataToUpdate: ProfileUpdateData = {};

      if (formData.alias?.trim()) dataToUpdate.alias = formData.alias.trim();
      if (formData.birthdate?.trim())
        dataToUpdate.birthdate = formData.birthdate.trim();
      if (formData.pays?.trim()) dataToUpdate.pays = formData.pays.trim();
      if (formData.langue?.trim()) dataToUpdate.langue = formData.langue.trim();
      if (formData.description?.trim())
        dataToUpdate.description = formData.description.trim();
      if (formData.avatar?.trim()) dataToUpdate.avatar = formData.avatar.trim();
      if (formData.pronous?.trim())
        dataToUpdate.pronous = formData.pronous.trim();
      dataToUpdate.is_public = formData.is_public;

      console.log("📝 Submitting profile update:", dataToUpdate);

      const result = await updateProfile(dataToUpdate);

      if (result.success) {
        Alert.alert(
          "Succès",
          result.message || "Profil mis à jour avec succès !",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Erreur",
          result.message || "Erreur lors de la mise à jour"
        );
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      Alert.alert("Erreur", "Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler",
      "Êtes-vous sûr de vouloir annuler les modifications ?",
      [
        { text: "Continuer l'édition", style: "cancel" },
        {
          text: "Annuler",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
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
      <SafeAreaView className="flex-1">
        {/* Header avec navigation */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-primary">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Ionicons name="chevron-back" size={24} color="#9CA3AF" />
            <Text className="text-text-secondary text-base ml-1">Retour</Text>
          </TouchableOpacity>

          <Text className="text-text-primary text-lg font-semibold">
            Modifier le profil
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-full ${loading ? "bg-gray-600" : "bg-primary"}`}
          >
            <Text
              className={`text-sm font-medium ${loading ? "text-gray-400" : "text-black"}`}
            >
              {loading ? "..." : "Sauvegarder"}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 40,
            }}
          >
            {/* Description de la page */}
            <View className="mb-6">
              <Text className="text-text-secondary text-base text-center">
                Modifiez vos informations personnelles
              </Text>
            </View>

            {/* Informations de base */}
            <Section title="Informations de base" className="mb-6">
              <Card className="p-4">
                <Input
                  label="Alias *"
                  placeholder="Votre alias unique"
                  value={formData.alias}
                  onChangeText={(value) => updateFormData("alias", value)}
                  error={validationErrors.alias}
                  autoCapitalize="none"
                />

                {/* DatePicker pour la date de naissance */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Date de naissance
                  </Text>
                  <TouchableOpacity
                    onPress={openDatePicker}
                    className={`h-12 px-4 border rounded-lg bg-background-tertiary flex-row items-center justify-between ${
                      validationErrors.birthdate
                        ? "border-red-500"
                        : "border-border-primary"
                    }`}
                  >
                    <Text
                      className={`text-base ${formData.birthdate ? "text-text-primary" : "text-text-muted"}`}
                    >
                      {formatDateForDisplay(formData.birthdate || "")}
                    </Text>
                    <Text className="text-text-muted text-xl">📅</Text>
                  </TouchableOpacity>
                  {validationErrors.birthdate && (
                    <Text className="text-red-500 text-sm mt-1">
                      {validationErrors.birthdate}
                    </Text>
                  )}
                </View>

                {/* Pays Picker */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Pays
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCountryPicker(true)}
                    className="h-12 px-4 border border-border-primary rounded-lg bg-background-tertiary flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base ${formData.pays ? "text-text-primary" : "text-text-muted"}`}
                    >
                      {getCountryDisplay(formData.pays || "")}
                    </Text>
                    <Text className="text-text-muted text-xl">🌍</Text>
                  </TouchableOpacity>
                </View>

                {/* Langues Picker */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Langues
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowLanguagePicker(true)}
                    className="min-h-12 px-4 py-3 border border-border-primary rounded-lg bg-background-tertiary flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base flex-1 ${selectedLanguages.length > 0 ? "text-text-primary" : "text-text-muted"}`}
                      numberOfLines={2}
                    >
                      {getLanguagesDisplay()}
                    </Text>
                    <Text className="text-text-muted ml-3 text-xl">🗣️</Text>
                  </TouchableOpacity>
                </View>

                {/* Pronoms Picker */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Pronoms
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPronounsPicker(true)}
                    className="h-12 px-4 border border-border-primary rounded-lg bg-background-tertiary flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base ${formData.pronous ? "text-text-primary" : "text-text-muted"}`}
                    >
                      {formData.pronous || "Sélectionner des pronoms"}
                    </Text>
                    <Text className="text-text-muted text-xl">👤</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </Section>

            {/* Description */}
            <Section title="Description" className="mb-6">
              <Card className="p-4">
                <Input
                  label="À propos de moi"
                  placeholder="Décrivez-vous en quelques mots..."
                  value={formData.description}
                  onChangeText={(value) => updateFormData("description", value)}
                  error={validationErrors.description}
                  multiline
                  numberOfLines={4}
                  textContentType="none"
                />
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-text-muted text-sm">
                    {formData.description?.length || 0}/500 caractères
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className={`h-1 rounded-full mr-2 ${
                        (formData.description?.length || 0) > 400
                          ? "bg-red-500"
                          : (formData.description?.length || 0) > 300
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: Math.min(
                          ((formData.description?.length || 0) / 500) * 80,
                          80
                        ),
                      }}
                    />
                  </View>
                </View>
              </Card>
            </Section>

            {/* Avatar */}
            <Section title="Photo de profil" className="mb-6">
              <Card className="p-4">
                {/* Prévisualisation de l'avatar */}
                {formData.avatar && (
                  <View className="items-center mb-4">
                    <Image
                      source={{ uri: formData.avatar }}
                      className="w-20 h-20 rounded-full bg-background-secondary"
                      onError={() => {
                        // En cas d'erreur de chargement, on peut afficher un placeholder
                      }}
                    />
                    <Text className="text-text-muted text-sm mt-2">Aperçu</Text>
                  </View>
                )}

                <Input
                  label="URL de l'avatar"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.avatar}
                  onChangeText={(value) => updateFormData("avatar", value)}
                  error={validationErrors.avatar}
                  keyboardType="url"
                  autoCapitalize="none"
                />
                <Text className="text-text-muted text-sm mt-2">
                  Formats supportés : JPG, PNG, GIF, WebP
                </Text>
              </Card>
            </Section>

            {/* Confidentialité */}
            <Section title="Confidentialité" className="mb-6">
              <Card className="p-4">
                <View className="flex-row items-center justify-between py-3">
                  <View className="flex-1 mr-4">
                    <Text className="text-text-primary text-base font-medium">
                      Profil public
                    </Text>
                    <Text className="text-text-secondary text-sm mt-1">
                      Permettre aux autres utilisateurs de voir votre profil
                    </Text>
                  </View>
                  <Switch
                    value={formData.is_public}
                    onValueChange={(value) =>
                      updateFormData("is_public", value)
                    }
                    trackColor={{ false: "#767577", true: "#3B82F6" }}
                    thumbColor={formData.is_public ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </Card>
            </Section>

            {/* Bouton d'annulation */}
            <View className="mt-4">
              <Button
                title="Annuler les modifications"
                variant="outline"
                onPress={handleCancel}
                disabled={loading}
                className="w-full"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modals pour les pickers */}

        {/* Modal DatePicker */}
        <Modal
          visible={showDatePicker}
          animationType="slide"
          presentationStyle="overFullScreen"
          transparent={true}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-background-primary rounded-3xl mx-6 overflow-hidden">
              {/* Header */}
              <View className="px-6 py-4 border-b border-border-primary">
                <Text className="text-xl font-bold text-text-primary text-center">
                  Date de naissance
                </Text>
                <Text className="text-text-secondary text-sm text-center mt-1">
                  Vous devez avoir au moins 18 ans
                </Text>
              </View>

              {/* DatePicker */}
              <View className="px-6 py-8">
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                  style={{
                    backgroundColor: "transparent",
                  }}
                />
              </View>

              {/* Boutons */}
              <View className="flex-row border-t border-border-primary">
                <TouchableOpacity
                  onPress={cancelDateSelection}
                  className="flex-1 py-4 border-r border-border-primary"
                >
                  <Text className="text-text-secondary text-center text-lg font-medium">
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDateSelection}
                  className="flex-1 py-4"
                >
                  <Text className="text-primary text-center text-lg font-medium">
                    Confirmer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Pays */}
        <Modal
          visible={showCountryPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-row justify-between items-center px-6 py-4 border-b border-border-primary">
              <Text className="text-xl font-bold text-text-primary">
                Sélectionner un pays
              </Text>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectCountry(item)}
                  className="flex-row items-center px-6 py-4 border-b border-border-secondary"
                >
                  <Text className="text-2xl mr-4">{item.flag}</Text>
                  <Text className="text-base text-text-primary flex-1">
                    {item.name}
                  </Text>
                  {formData.pays === item.code && (
                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>

        {/* Modal Langues */}
        <Modal
          visible={showLanguagePicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-row justify-between items-center px-6 py-4 border-b border-border-primary">
              <Text className="text-xl font-bold text-text-primary">
                Sélectionner des langues
              </Text>
              <TouchableOpacity
                onPress={() => setShowLanguagePicker(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleLanguage(item.code)}
                  className="flex-row items-center px-6 py-4 border-b border-border-secondary"
                >
                  <Text className="text-2xl mr-4">{item.flag}</Text>
                  <Text className="text-base text-text-primary flex-1">
                    {item.name}
                  </Text>
                  {selectedLanguages.includes(item.code) && (
                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              )}
            />
            <View className="px-6 py-4 bg-background-secondary">
              <Text className="text-text-muted text-sm text-center">
                {selectedLanguages.length} langue
                {selectedLanguages.length !== 1 ? "s" : ""} sélectionnée
                {selectedLanguages.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Modal Pronoms */}
        <Modal
          visible={showPronounsPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-row justify-between items-center px-6 py-4 border-b border-border-primary">
              <Text className="text-xl font-bold text-text-primary">
                Sélectionner des pronoms
              </Text>
              <TouchableOpacity
                onPress={() => setShowPronounsPicker(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={PRONOUNS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectPronouns(item)}
                  className="flex-row items-center justify-between px-6 py-4 border-b border-border-secondary"
                >
                  <Text className="text-base text-text-primary">{item}</Text>
                  {formData.pronous === item && (
                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              )}
            />
            <View className="p-6">
              <TouchableOpacity
                onPress={() => {
                  updateFormData("pronous", "");
                  setShowPronounsPicker(false);
                }}
                className="p-4 bg-background-secondary rounded-lg"
              >
                <Text className="text-text-secondary text-center">
                  Effacer la sélection
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
