import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { ProfileUpdateData } from "../types/auth";

interface User {
  id: string;
  email: string;
  alias: string;
  birthdate?: string;
  pays?: string;
  langue?: string;
  description?: string;
  avatar?: string;
  pronous?: string;
  is_public?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    alias: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    profileData: ProfileUpdateData
  ) => Promise<{ success: boolean; message?: string }>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        const isValid = await apiService.verifyToken();

        if (isValid) {
          const profile = await apiService.getProfile();

          if (profile) {
            setUser(profile);
          } else {
          }
        } else {
          await AsyncStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      await AsyncStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);

      if (response.success && response.token) {
        await AsyncStorage.setItem("authToken", response.token);

        const profile = await apiService.getProfile();

        if (profile) {
          setUser(profile);
          return true;
        } else {
        }
      } else {
      }
      return false;
    } catch (error) {
      console.error("❌ Login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    alias: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      // Validation côté client
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: "Format d'email invalide",
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: "Le mot de passe doit contenir au moins 6 caractères",
        };
      }

      if (alias.length < 3) {
        return {
          success: false,
          message: "L'alias doit contenir au moins 3 caractères",
        };
      }

      if (!/^[a-zA-Z0-9_]+$/.test(alias)) {
        return {
          success: false,
          message:
            "L'alias ne peut contenir que des lettres, chiffres et underscores",
        };
      }

      const response = await apiService.register(email, password, alias);

      if (response.success) {
      } else {
      }

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ Register error in context:", error);
      return {
        success: false,
        message: "Une erreur inattendue est survenue",
      };
    }
  };

  const updateProfile = async (
    profileData: ProfileUpdateData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log("🔄 Updating profile in context:", profileData);

      const response = await apiService.updateProfile(profileData);

      if (response.success) {
        // Rafraîchir le profil après la mise à jour
        await refreshProfile();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("❌ Update profile context error:", error);
      return {
        success: false,
        message: "Erreur lors de la mise à jour du profil",
      };
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await apiService.getProfile();
      if (profile) {
        console.log("✅ Profile refreshed successfully");
        setUser(profile);
      } else {
        console.log("❌ Failed to refresh profile");
      }
    } catch (error) {
      console.error("❌ Refresh profile error:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
