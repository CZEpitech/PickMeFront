import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileUpdateData } from "../types/auth";

const BASE_URL = "http://87.106.108.25:3456/api/v1";

// Garder l'interface ApiResponse pour la compatibilité avec le reste du code
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.token) {
        return {
          success: true,
          token: data.data.token,
          data: data.data,
        };
      }

      return {
        success: false,
        message: data.message || "Erreur de connexion",
      };
    } catch (error) {
      console.error("❌ Login API error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }

  async register(
    email: string,
    password: string,
    alias: string
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, alias }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || "Inscription réussie",
        };
      }

      // Gestion des erreurs spécifiques du backend
      let errorMessage = "Erreur lors de l'inscription";

      if (response.status === 400) {
        if (data.message?.includes("email")) {
          errorMessage = "Cette adresse email est déjà utilisée";
        } else if (data.message?.includes("alias")) {
          errorMessage = "Cet alias est déjà pris";
        } else if (data.message?.includes("password")) {
          errorMessage = "Le mot de passe ne respecte pas les critères requis";
        } else {
          errorMessage = data.message || "Données d'inscription invalides";
        }
      } else if (response.status === 422) {
        errorMessage = "Format des données incorrect";
      } else if (response.status >= 500) {
        errorMessage = "Erreur serveur, veuillez réessayer plus tard";
      } else {
        errorMessage = data.message || errorMessage;
      }

      return {
        success: false,
        message: errorMessage,
      };
    } catch (error) {
      console.error("❌ Register API error:", error);
      return {
        success: false,
        message: "Erreur de réseau, vérifiez votre connexion",
      };
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/auth/verify`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        await response.json();
      }

      return response.ok;
    } catch (error) {
      console.error("❌ Verify token error:", error);
      return false;
    }
  }

  async getProfile(): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/profile/me`, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();

        // Combine user and profile data according to API structure
        if (data.success && data.data) {
          const combinedUser = {
            id: data.data.user.id,
            email: data.data.user.email,
            alias: data.data.profile.alias,
            birthdate: data.data.profile.birthdate,
            pays: data.data.profile.pays,
            langue: data.data.profile.langue,
            description: data.data.profile.description,
            avatar: data.data.profile.avatar,
            pronous: data.data.profile.pronous,
            is_public: data.data.profile.is_public,
          };
          return combinedUser;
        }

        return data.data || data; // Fallback
      } else {
        await response.json();
      }

      return null;
    } catch (error) {
      console.error("❌ Get profile error:", error);
      return null;
    }
  }

  async updateProfile(profileData: ProfileUpdateData): Promise<ApiResponse> {
    try {
      console.log("🔄 Updating profile with data:", profileData);

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/profile/me`, {
        method: "PUT",
        headers,
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Profile updated successfully");
        return {
          success: true,
          data: data.data,
          message: data.message || "Profil mis à jour avec succès",
        };
      }

      // Gestion des erreurs spécifiques
      let errorMessage = "Erreur lors de la mise à jour du profil";

      if (response.status === 400) {
        if (data.message?.includes("alias")) {
          errorMessage = "Cet alias est déjà utilisé";
        } else if (data.message?.includes("birthdate")) {
          errorMessage = "Format de date de naissance invalide";
        } else {
          errorMessage = data.message || "Données invalides";
        }
      } else if (response.status === 401) {
        errorMessage = "Vous devez être connecté pour modifier votre profil";
      } else if (response.status === 422) {
        errorMessage = "Format des données incorrect";
      } else if (response.status >= 500) {
        errorMessage = "Erreur serveur, veuillez réessayer plus tard";
      } else {
        errorMessage = data.message || errorMessage;
      }

      console.log("❌ Profile update failed:", errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } catch (error) {
      console.error("❌ Update profile error:", error);
      return {
        success: false,
        message: "Erreur de réseau, vérifiez votre connexion",
      };
    }
  }

  async getUserImages(
    page: number = 1,
    limit: number = 20,
    pinnedOnly: boolean = false
  ): Promise<ApiResponse> {
    try {
      console.log("📸 Fetching user images...");

      const headers = await this.getAuthHeaders();
      const url = `${BASE_URL}/images/me?page=${page}&limit=${limit}&pinned_only=${pinnedOnly}`;

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Images fetched successfully");
        return {
          success: true,
          data: data.data,
        };
      }

      console.log("❌ Failed to fetch images:", data.message);
      return {
        success: false,
        message: data.message || "Erreur lors de la récupération des images",
      };
    } catch (error) {
      console.error("❌ Get images error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }
}

export const apiService = new ApiService();
