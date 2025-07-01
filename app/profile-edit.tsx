import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  FlatList,
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
import { Card, Input, ScreenWrapper, Section } from "./components";
import { useDatePicker, useProfileForm } from "./hooks";

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
  const {
    formData,
    validationErrors,
    loading,
    selectedLanguages,
    updateFormData,
    handleSubmit,
    handleCancel,
    selectCountry,
    toggleLanguage,
    selectPronouns,
    getCountryDisplay,
    getLanguagesDisplay,
    COUNTRIES,
    LANGUAGES,
    PRONOUNS,
  } = useProfileForm();

  const {
    showDatePicker,
    tempDate,
    openDatePicker,
    onDateChange,
    confirmDateSelection,
    cancelDateSelection,
    formatDateForDisplay,
  } = useDatePicker();

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showPronounsPicker, setShowPronounsPicker] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header personnalisé */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-background-secondary border-b border-border-primary">
        <TouchableOpacity
          onPress={handleCancel}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          <Text className="text-text-primary text-base ml-1 font-medium">
            Retour
          </Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-text-primary">
          Modifier le profil
        </Text>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            loading ? "bg-accent-secondary" : "bg-accent-primary"
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">
            {loading ? "..." : "Sauver"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScreenWrapper>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Informations de base */}
            <Card className="mb-6">
              <Section title="Informations de base">
                <Input
                  label="Alias"
                  placeholder="Votre alias"
                  value={formData.alias || ""}
                  onChangeText={(value) => updateFormData("alias", value)}
                  error={validationErrors.alias}
                />

                {/* DatePicker pour la date de naissance */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Date de naissance
                  </Text>
                  <TouchableOpacity
                    onPress={() => openDatePicker(formData.birthdate)}
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
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                  {validationErrors.birthdate && (
                    <Text className="text-red-500 text-sm mt-1">
                      {validationErrors.birthdate}
                    </Text>
                  )}
                </View>

                {/* Sélecteur de pays */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Pays
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCountryPicker(true)}
                    className="h-12 px-4 border rounded-lg bg-background-tertiary flex-row items-center justify-between border-border-primary"
                  >
                    <Text className="text-text-primary text-base">
                      {getCountryDisplay(formData.pays || "")}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Sélecteur de langues */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Langues parlées
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowLanguagePicker(true)}
                    className="min-h-12 px-4 py-3 border rounded-lg bg-background-tertiary border-border-primary"
                  >
                    <Text className="text-text-primary text-base">
                      {getLanguagesDisplay()}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Sélecteur de pronoms */}
                <View className="mb-4">
                  <Text className="text-text-primary text-base mb-2 font-medium">
                    Pronoms
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPronounsPicker(true)}
                    className="h-12 px-4 border rounded-lg bg-background-tertiary flex-row items-center justify-between border-border-primary"
                  >
                    <Text className="text-text-primary text-base">
                      {formData.pronous || "Sélectionner des pronoms"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </Section>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <Section title="Description">
                <Input
                  label="À propos de moi"
                  placeholder="Décrivez-vous en quelques mots..."
                  value={formData.description || ""}
                  onChangeText={(value) => updateFormData("description", value)}
                  multiline
                  numberOfLines={4}
                  error={validationErrors.description}
                />
              </Section>
            </Card>

            {/* Paramètres de confidentialité */}
            <Card className="mb-6">
              <Section title="Confidentialité">
                <View className="flex-row items-center justify-between py-3">
                  <View className="flex-1">
                    <Text className="text-text-primary text-base font-medium">
                      Profil public
                    </Text>
                    <Text className="text-text-secondary text-sm mt-1">
                      Permettre aux autres utilisateurs de voir votre profil
                    </Text>
                  </View>
                  <Switch
                    value={formData.is_public || false}
                    onValueChange={(value) =>
                      updateFormData("is_public", value)
                    }
                    trackColor={{ false: "#767577", true: "#FF6B6B" }}
                    thumbColor={formData.is_public ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
              </Section>
            </Card>
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
              <View className="px-6 py-4">
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                />
              </View>

              {/* Boutons */}
              <View className="flex-row px-6 py-4 border-t border-border-primary">
                <TouchableOpacity
                  onPress={cancelDateSelection}
                  className="flex-1 mr-2 py-3 rounded-lg bg-background-tertiary"
                >
                  <Text className="text-text-secondary text-center font-semibold">
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    confirmDateSelection((dateString) =>
                      updateFormData("birthdate", dateString)
                    )
                  }
                  className="flex-1 ml-2 py-3 rounded-lg bg-accent-primary"
                >
                  <Text className="text-white text-center font-semibold">
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
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border-primary">
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-text-primary">
                Sélectionner un pays
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    selectCountry(item);
                    setShowCountryPicker(false);
                  }}
                  className="flex-row items-center px-5 py-4 border-b border-border-primary"
                >
                  <Text className="text-2xl mr-3">{item.flag}</Text>
                  <Text className="text-text-primary text-base flex-1">
                    {item.name}
                  </Text>
                  {formData.pays === item.code && (
                    <Ionicons name="checkmark" size={20} color="#FF6B6B" />
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
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border-primary">
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-text-primary">
                Sélectionner des langues
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleLanguage(item.code)}
                  className="flex-row items-center px-5 py-4 border-b border-border-primary"
                >
                  <Text className="text-2xl mr-3">{item.flag}</Text>
                  <Text className="text-text-primary text-base flex-1">
                    {item.name}
                  </Text>
                  {selectedLanguages.includes(item.code) && (
                    <Ionicons name="checkmark" size={20} color="#FF6B6B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>

        {/* Modal Pronoms */}
        <Modal
          visible={showPronounsPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border-primary">
              <TouchableOpacity onPress={() => setShowPronounsPicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-text-primary">
                Sélectionner des pronoms
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <FlatList
              data={PRONOUNS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    selectPronouns(item);
                    setShowPronounsPicker(false);
                  }}
                  className="flex-row items-center px-5 py-4 border-b border-border-primary"
                >
                  <Text className="text-text-primary text-base flex-1">
                    {item}
                  </Text>
                  {formData.pronous === item && (
                    <Ionicons name="checkmark" size={20} color="#FF6B6B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>
      </ScreenWrapper>
    </SafeAreaView>
  );
}
