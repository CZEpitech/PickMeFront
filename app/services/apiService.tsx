import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://87.106.108.25:3456/api/v1";

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
      console.log("🔐 Login attempt:", { email, baseUrl: BASE_URL });

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔐 Login response:", { status: response.status, data });

      if (response.ok && data.data && data.data.token) {
        console.log("✅ Login successful, token received");
        return {
          success: true,
          token: data.data.token,
          data: data.data,
        };
      }

      console.log("❌ Login failed:", data);
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

      return {
        success: response.ok,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error("Register API error:", error);
      return {
        success: false,
        message: "Erreur de réseau",
      };
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      console.log("🔍 Verifying token with headers:", headers);

      const response = await fetch(`${BASE_URL}/auth/verify`, {
        method: "GET",
        headers,
      });

      console.log("🔍 Token verification status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Token verification failed:", errorData);
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
      console.log("👤 Getting profile with headers:", headers);

      const response = await fetch(`${BASE_URL}/profile/me`, {
        method: "GET",
        headers,
      });

      console.log("👤 Profile response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("👤 Profile data received:", data);

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
          console.log("👤 Combined user data:", combinedUser);
          return combinedUser;
        }

        return data.data || data; // Fallback
      } else {
        const errorData = await response.json();
        console.log("❌ Profile error:", errorData);
      }

      return null;
    } catch (error) {
      console.error("❌ Get profile error:", error);
      return null;
    }
  }
}

export const apiService = new ApiService();
