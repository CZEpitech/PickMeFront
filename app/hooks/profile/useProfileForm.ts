import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ProfileUpdateData, ProfileValidationErrors } from "../../types/auth";

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

interface UseProfileFormReturn {
  formData: ProfileUpdateData;
  validationErrors: ProfileValidationErrors;
  loading: boolean;
  selectedLanguages: string[];
  updateFormData: (field: string, value: string | boolean) => void;
  validateField: (field: string, value: string | boolean) => boolean;
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
  selectCountry: (country: (typeof COUNTRIES)[0]) => void;
  toggleLanguage: (langCode: string) => void;
  selectPronouns: (pronouns: string) => void;
  getCountryDisplay: (countryCode: string) => string;
  getLanguagesDisplay: () => string;
  formatDateForDisplay: (dateString: string) => string;
  COUNTRIES: typeof COUNTRIES;
  LANGUAGES: typeof LANGUAGES;
  PRONOUNS: typeof PRONOUNS;
}

export const useProfileForm = (): UseProfileFormReturn => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
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

  const validateField = (field: string, value: string | boolean): boolean => {
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

  const selectCountry = (country: (typeof COUNTRIES)[0]) => {
    updateFormData("pays", country.code);
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

  const selectPronouns = (pronouns: string) => {
    updateFormData("pronous", pronouns);
  };

  const getCountryDisplay = (countryCode: string): string => {
    if (!countryCode) return "Sélectionner un pays";
    const country = COUNTRIES.find(
      (c) => c.code === countryCode || c.name === countryCode
    );
    return country ? `${country.flag} ${country.name}` : countryCode;
  };

  const getLanguagesDisplay = (): string => {
    if (selectedLanguages.length === 0) return "Sélectionner des langues";
    return selectedLanguages
      .map((code) => {
        const lang = LANGUAGES.find((l) => l.code === code);
        return lang ? `${lang.flag} ${lang.name}` : code;
      })
      .join(", ");
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "Sélectionner une date";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
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

  return {
    formData,
    validationErrors,
    loading,
    selectedLanguages,
    updateFormData,
    validateField,
    handleSubmit,
    handleCancel,
    selectCountry,
    toggleLanguage,
    selectPronouns,
    getCountryDisplay,
    getLanguagesDisplay,
    formatDateForDisplay,
    COUNTRIES,
    LANGUAGES,
    PRONOUNS,
  };
};
