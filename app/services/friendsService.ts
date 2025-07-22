const API_BASE_URL = "http://82.165.172.113:8745/api/v1";

export interface Friend {
  friendship_id: string;
  friend_user_id: string;
  profile: {
    id: string;
    alias: string;
    avatar?: string | null;
    pays?: string;
  };
  status: "pending" | "accepted" | "declined";
  requested_by_me: boolean;
  created_at: string;
}

// Helper interface pour compatibilité avec l'UI existante
export interface FriendFlat {
  id: string;
  alias: string;
  avatar?: string | null;
  is_public: boolean;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface FriendRequest {
  id: string;
  requester: {
    id: string;
    alias: string;
    avatar?: string | null;
  };
  requested: {
    id: string;
    alias: string;
    avatar?: string | null;
  };
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const friendsService = {
  async getFriendsList(
    token: string,
    status = "accepted",
    page = 1,
    limit = 20
  ): Promise<ApiResponse<FriendFlat[]>> {
    try {
      const url = `${API_BASE_URL}/friends?status=${status}&page=${page}&limit=${limit}`;
      console.log("👥 [FRIENDS_SERVICE] Fetching friends list:", {
        status,
        page,
        limit,
        url
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("📋 [FRIENDS_SERVICE] Raw API response:", JSON.stringify(result, null, 2));

      if (response.ok) {
        console.log("✅ [FRIENDS_SERVICE] Friends fetch successful:", result.data?.friends?.length || 0, "friends");
        
        // Transformer les données pour l'UI
        const flattenedFriends: FriendFlat[] = (result.data?.friends || []).map((friend: Friend) => ({
          id: friend.friend_user_id,
          alias: friend.profile.alias,
          avatar: friend.profile.avatar,
          is_public: true, // Par défaut, peut être ajusté selon les besoins
          status: friend.status,
          created_at: friend.created_at,
        }));

        return {
          success: true,
          data: flattenedFriends,
        };
      } else {
        console.log("❌ [FRIENDS_SERVICE] Friends fetch error:", result.message, "| Status:", response.status);
        return {
          success: false,
          message:
            result.message ||
            result.error ||
            "Erreur lors de la récupération des amis",
        };
      }
    } catch (error) {
      console.log("💥 [FRIENDS_SERVICE] Friends fetch network error:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  },

  async addFriend(token: string, friendId: string): Promise<ApiResponse<any>> {
    try {

      const response = await fetch(`${API_BASE_URL}/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_id: friendId }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message:
            result.message || result.error || "Erreur lors de l'ajout d'ami",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  },

  async getFriendRequests(
    token: string
  ): Promise<ApiResponse<FriendRequest[]>> {
    try {

      const response = await fetch(`${API_BASE_URL}/friends/requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result.data || [],
        };
      } else {
        return {
          success: false,
          message:
            result.message ||
            result.error ||
            "Erreur lors de la récupération des demandes d'amitié",
        };
      }
    } catch (error) {
      console.error("💥 [FRIENDS_SERVICE] Friend requests error:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  },

  async respondToFriendRequest(
    token: string,
    friendId: string,
    status: "accepted" | "declined"
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/friends/${friendId}/respond`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message:
            result.message ||
            result.error ||
            "Erreur lors de la réponse à la demande d'amitié",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  },
};
