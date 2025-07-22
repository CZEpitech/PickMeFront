const API_BASE_URL = 'http://82.165.172.113:8745/api/v1';

export interface ImageItem {
  id: string;
  image_link: string;
  is_pinned: boolean;
  created_at: string;
  user_id: string;
}

export interface AddImageRequest {
  image_link: string;
  is_pinned: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const imagesService = {
  async getMyImages(token: string, page = 1, limit = 20): Promise<ApiResponse<ImageItem[]>> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/images/me?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
          message: result.message || result.error || 'Erreur lors de la récupération des images',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },

  async addImage(token: string, data: AddImageRequest): Promise<ApiResponse<ImageItem>> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/images`, {
        method: 'POST',
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
          message: result.message || result.error || 'Erreur lors de l\'ajout de l\'image',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },

  async getUserImages(token: string, userId: string): Promise<ApiResponse<ImageItem[]>> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/images/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
          message: result.message || result.error || 'Erreur lors de la récupération des images utilisateur',
        };
      }
    } catch (error) {
      console.error('💥 [IMAGES_SERVICE] User images error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },
};