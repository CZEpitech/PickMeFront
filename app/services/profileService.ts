const API_BASE_URL = 'http://82.165.172.113:8745/api/v1';

export interface ExtendedProfile {
  id: string;
  alias: string;
  birthdate?: string;
  pays?: string;
  langue?: string;
  description?: string;
  pronous?: string;
  avatar?: string | null;
  is_public: boolean;
}

export interface UpdateProfileRequest {
  alias?: string;
  birthdate?: string;
  pays?: string;
  langue?: string;
  description?: string;
  pronous?: string;
  avatar?: string;
  is_public?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const profileService = {
  async getMyProfile(token: string): Promise<ApiResponse<{ user: any; profile: ExtendedProfile }>> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
          message: result.message || result.error || 'Erreur lors de la récupération du profil',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },

  async updateMyProfile(token: string, data: UpdateProfileRequest): Promise<ApiResponse<ExtendedProfile>> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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
          message: result.message || result.error || 'Erreur lors de la mise à jour du profil',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },

  async getUserProfile(token: string, userId: string): Promise<ApiResponse<{ user: any; profile: ExtendedProfile }>> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
          message: result.message || result.error || 'Erreur lors de la récupération du profil utilisateur',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },
};