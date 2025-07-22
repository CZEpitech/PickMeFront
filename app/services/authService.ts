const API_BASE_URL = 'http://82.165.172.113:8745/api/v1';

export interface RegisterRequest {
  email: string;
  password: string;
  alias: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  alias: string;
  avatar?: string | null;
  is_public: boolean;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
    profile?: Profile;
  };
  message?: string;
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          message: result.message || result.error || 'Erreur lors de l\'inscription',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          message: result.message || result.error || 'Erreur lors de la connexion',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  },

  async verifyToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
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
          message: result.message || 'Token invalide',
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