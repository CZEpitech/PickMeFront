import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  alias: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  alias?: string;
}

interface UseAuthFormReturn {
  isLogin: boolean;
  formData: FormData;
  loading: boolean;
  validationErrors: ValidationErrors;
  setIsLogin: (isLogin: boolean) => void;
  updateFormData: (field: keyof FormData, value: string) => void;
  handleSubmit: () => Promise<void>;
  validateField: (field: keyof FormData, value: string) => boolean;
  resetForm: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    alias: "",
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const validateField = (field: keyof FormData, value: string): boolean => {
    let error = "";

    switch (field) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "Email requis";
        } else if (!emailRegex.test(value)) {
          error = "Format d'email invalide";
        }
        break;

      case "password":
        if (!value) {
          error = "Mot de passe requis";
        } else if (value.length < 6) {
          error = "Au moins 6 caractères requis";
        }
        break;

      case "confirmPassword":
        if (!isLogin) {
          if (!value) {
            error = "Confirmation requise";
          } else if (value !== formData.password) {
            error = "Les mots de passe ne correspondent pas";
          }
        }
        break;

      case "alias":
        if (!isLogin) {
          if (!value) {
            error = "Alias requis";
          } else if (value.length < 3) {
            error = "Au moins 3 caractères requis";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            error = "Lettres, chiffres et _ uniquement";
          }
        }
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      alias: "",
    });
    setValidationErrors({});
  };

  const handleSubmit = async () => {
    // Validation complète
    const fieldsToValidate: (keyof FormData)[] = isLogin
      ? ["email", "password"]
      : ["email", "password", "confirmPassword", "alias"];

    let hasErrors = false;
    for (const field of fieldsToValidate) {
      if (!validateField(field, formData[field])) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        console.log("🔑 Attempting login...");
        const success = await login(formData.email, formData.password);
        if (success) {
          console.log("✅ Login successful");
          router.replace("./main/profile");
        } else {
          Alert.alert("Erreur", "Email ou mot de passe incorrect");
        }
      } else {
        console.log("📝 Attempting registration...");
        const result = await register(
          formData.email,
          formData.password,
          formData.alias
        );
        if (result.success) {
          Alert.alert(
            "Succès",
            "Inscription réussie ! Vous pouvez maintenant vous connecter.",
            [
              {
                text: "Se connecter",
                onPress: () => {
                  setIsLogin(true);
                  resetForm();
                },
              },
            ]
          );
        } else {
          Alert.alert(
            "Erreur",
            result.message || "Erreur lors de l'inscription"
          );
        }
      }
    } catch (error) {
      console.error("❌ Auth error:", error);
      Alert.alert("Erreur", "Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    isLogin,
    formData,
    loading,
    validationErrors,
    setIsLogin,
    updateFormData,
    handleSubmit,
    validateField,
    resetForm,
  };
};
