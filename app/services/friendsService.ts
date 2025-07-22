const API_BASE_URL = "http://82.165.172.113:8745/api/v1";

export interface Friend {
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
  ): Promise<ApiResponse<Friend[]>> {
    try {

      const response = await fetch(
        `${API_BASE_URL}/friends?status=${status}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
            "Erreur lors de la récupération des amis",
        };
      }
    } catch (error) {
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
