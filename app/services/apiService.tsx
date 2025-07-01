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
  private lastRequestTime = 0;
  private readonly minRequestInterval = 100; // 100ms entre les requêtes

  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`⏱️ Throttling request: waiting ${waitTime}ms`);
      await this.wait(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(
            `🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms`
          );
          await this.wait(delay);
        }

        await this.throttleRequest();
        return await requestFn();
      } catch (error: any) {
        lastError = error;

        // Si c'est une erreur de rate limiting, on continue à retry
        if (
          error.message?.includes("Trop de requêtes") &&
          attempt < maxRetries
        ) {
          console.log(
            `⚠️ Rate limited, retrying in ${baseDelay * Math.pow(2, attempt)}ms...`
          );
          continue;
        }

        // Pour les autres erreurs, on arrête le retry
        if (attempt === maxRetries) {
          break;
        }
      }
    }

    throw lastError;
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

  // 👥 FRIENDS ENDPOINTS

  async getFriends(
    status: string = "accepted",
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse> {
    return this.retryRequest(async () => {
      console.log("👥 Fetching friends...");

      const headers = await this.getAuthHeaders();
      const url = `${BASE_URL}/friends?status=${status}&page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const data = await response.json();
      console.log("🔍 Friends API response:", JSON.stringify(data, null, 2));

      // Gestion du rate limiting
      if (
        response.status === 429 ||
        data.message?.includes("Trop de requêtes")
      ) {
        throw new Error("Trop de requêtes, veuillez réessayer plus tard.");
      }

      if (response.ok) {
        // Gestion flexible : si data.success existe et est true, ou si pas de data.success mais statut HTTP OK
        if (data.success !== false) {
          console.log("✅ Friends fetched successfully");
          return {
            success: true,
            data: data.data || data, // Fallback si data est directement la liste
          };
        }
      }

      console.log(
        "❌ Failed to fetch friends:",
        data.message || "HTTP " + response.status
      );
      return {
        success: false,
        message: data.message || "Erreur lors de la récupération des amis",
      };
    }).catch((error) => {
      console.error("❌ Get friends error:", error);
      return {
        success: false,
        message: error.message || "Erreur de réseau",
      };
    });
  }

  async getFriendRequests(): Promise<ApiResponse> {
    return this.retryRequest(async () => {
      console.log("📨 Fetching friend requests...");

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/friends/requests`, {
        method: "GET",
        headers,
      });

      const data = await response.json();
      console.log(
        "🔍 Friend requests API response:",
        JSON.stringify(data, null, 2)
      );

      // Gestion du rate limiting
      if (
        response.status === 429 ||
        data.message?.includes("Trop de requêtes")
      ) {
        throw new Error("Trop de requêtes, veuillez réessayer plus tard.");
      }

      if (response.ok) {
        // Gestion flexible : si data.success existe et est true, ou si pas de data.success mais statut HTTP OK
        if (data.success !== false) {
          console.log("✅ Friend requests fetched successfully");
          return {
            success: true,
            data: data.data || data, // Fallback si data est directement la liste
          };
        }
      }

      console.log(
        "❌ Failed to fetch friend requests:",
        data.message || "HTTP " + response.status
      );
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des demandes d'amitié",
      };
    }).catch((error) => {
      console.error("❌ Get friend requests error:", error);
      return {
        success: false,
        message: error.message || "Erreur de réseau",
      };
    });
  }

  async sendFriendRequest(friendId: string): Promise<ApiResponse> {
    try {
      console.log(`📨 Sending friend request to ${friendId}...`);

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/friends`, {
        method: "POST",
        headers,
        body: JSON.stringify({ friend_id: friendId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Friend request sent successfully");
        return {
          success: true,
          data: data.data,
          message: data.message || "Demande d'amitié envoyée",
        };
      }

      let errorMessage = "Erreur lors de l'envoi de la demande d'amitié";

      if (response.status === 400) {
        if (data.message?.includes("already")) {
          errorMessage =
            "Une demande d'amitié existe déjà avec cet utilisateur";
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (response.status === 404) {
        errorMessage = "Utilisateur introuvable";
      }

      console.log("❌ Failed to send friend request:", errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } catch (error) {
      console.error("❌ Send friend request error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }

  async respondToFriendRequest(
    friendId: string,
    status: "accepted" | "blocked"
  ): Promise<ApiResponse> {
    try {
      console.log(
        `🔄 Responding to friend request from ${friendId} with status: ${status}...`
      );

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/friends/${friendId}/respond`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const message =
          status === "accepted"
            ? "Demande d'amitié acceptée"
            : "Utilisateur bloqué";
        console.log(`✅ Friend request ${status} successfully`);
        return {
          success: true,
          data: data.data,
          message: data.message || message,
        };
      }

      console.log("❌ Failed to respond to friend request:", data.message);
      return {
        success: false,
        message:
          data.message || "Erreur lors de la réponse à la demande d'amitié",
      };
    } catch (error) {
      console.error("❌ Respond to friend request error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }

  async removeFriend(friendId: string): Promise<ApiResponse> {
    try {
      console.log(`🗑️ Removing friend ${friendId}...`);

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/friends/${friendId}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Friend removed successfully");
        return {
          success: true,
          data: data.data,
          message: data.message || "Ami supprimé",
        };
      }

      console.log("❌ Failed to remove friend:", data.message);
      return {
        success: false,
        message: data.message || "Erreur lors de la suppression de l'ami",
      };
    } catch (error) {
      console.error("❌ Remove friend error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }

  // 🔍 SEARCH ENDPOINTS

  async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse> {
    return this.retryRequest(async () => {
      console.log(`🔍 Searching users with query: ${query}...`);

      const headers = await this.getAuthHeaders();
      const url = `${BASE_URL}/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      // Gestion du rate limiting
      if (
        response.status === 429 ||
        data.message?.includes("Trop de requêtes")
      ) {
        throw new Error("Trop de requêtes, veuillez réessayer plus tard.");
      }

      if (response.ok && data.success) {
        console.log("✅ Users search completed successfully");
        return {
          success: true,
          data: data.data,
        };
      }

      console.log("❌ Failed to search users:", data.message);
      return {
        success: false,
        message: data.message || "Erreur lors de la recherche d'utilisateurs",
      };
    }).catch((error) => {
      console.error("❌ Search users error:", error);
      return {
        success: false,
        message: error.message || "Erreur de réseau",
      };
    });
  }

  async getUserProfile(userId: string): Promise<ApiResponse> {
    try {
      console.log(`👤 Fetching profile for user ${userId}...`);

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${BASE_URL}/profile/${userId}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ User profile fetched successfully");
        return {
          success: true,
          data: data.data,
        };
      }

      console.log("❌ Failed to fetch user profile:", data.message);
      return {
        success: false,
        message: data.message || "Erreur lors de la récupération du profil",
      };
    } catch (error) {
      console.error("❌ Get user profile error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }
}

export const apiService = new ApiService();
