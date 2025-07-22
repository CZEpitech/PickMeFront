const API_BASE_URL = "http://82.165.172.113:8745/api/v1";

export interface SearchUser {
  id: string;
  profile: {
    id: string;
    alias: string;
    avatar?: string | null;
    pays?: string;
    is_public: boolean;
    description?: string;
    langue?: string;
  };
  created_at: string;
}

// Helper interface pour compatibilité avec l'UI existante
export interface SearchUserFlat {
  id: string;
  alias: string;
  avatar?: string | null;
  is_public: boolean;
  description?: string;
  pays?: string;
  langue?: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  friends_count: number;
  images_count: number;
  posts_count?: number;
  events_count?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const usersService = {
  async searchUsers(
    token: string,
    query: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<SearchUserFlat[]>> {
    try {
      const searchUrl = `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      console.log("🔍 [USERS_SERVICE] Searching users:", {
        query,
        page,
        limit,
        searchUrl
      });

      const response = await fetch(
        searchUrl,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(
          "✅ [USERS_SERVICE] Search successful:",
          result.data?.users?.length || 0,
          "users found for query:",
          query
        );
        if (result.data?.users && result.data.users.length > 0) {
          console.log("👤 Found users:", result.data.users.map(u => `@${u.profile.alias}`).join(", "));
        }
        // Transformer les données pour l'UI
        const flattenedUsers: SearchUserFlat[] = (result.data?.users || []).map((user: SearchUser) => ({
          id: user.id,
          alias: user.profile.alias,
          avatar: user.profile.avatar,
          is_public: user.profile.is_public,
          description: user.profile.description,
          pays: user.profile.pays,
          langue: user.profile.langue,
          created_at: user.created_at,
        }));

        return {
          success: true,
          data: flattenedUsers,
        };
      } else {
        console.log("❌ [USERS_SERVICE] Search error:", result.message, "| Status:", response.status, "| Query:", query);
        return {
          success: false,
          message:
            result.message ||
            result.error ||
            "Erreur lors de la recherche d'utilisateurs",
        };
      }
    } catch (error) {
      console.log("💥 [USERS_SERVICE] Search network error:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  },

  async getUserStats(
    token: string,
    userId: string
  ): Promise<ApiResponse<UserStats>> {
    try {
      console.log("📊 [USERS_SERVICE] Getting user stats:", userId);

      const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ [USERS_SERVICE] Stats retrieved successfully");
        return {
          success: true,
          data: result.data,
        };
      } else {
        console.log("❌ [USERS_SERVICE] Stats error:", result.message);
        return {
          success: false,
          message:
            result.message ||
            result.error ||
            "Erreur lors de la récupération des statistiques",
        };
      }
    } catch (error) {
      console.log("💥 [USERS_SERVICE] Stats network error:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  },
};
