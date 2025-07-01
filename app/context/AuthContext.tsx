import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "../services/apiService";

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
  ) => Promise<boolean>;
  logout: () => Promise<void>;
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
      console.log("🔄 Checking auth status...");
      const token = await AsyncStorage.getItem("authToken");
      console.log("🔑 Token from storage:", token ? "Present" : "Not found");

      if (token) {
        const isValid = await apiService.verifyToken();
        console.log("✅ Token validation result:", isValid);

        if (isValid) {
          const profile = await apiService.getProfile();
          console.log("👤 Profile retrieved:", profile);

          if (profile) {
            setUser(profile);
          } else {
            console.log("❌ No profile data received");
          }
        } else {
          console.log("❌ Token invalid, removing from storage");
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
      console.log("🔐 Starting login process...");
      const response = await apiService.login(email, password);
      console.log("🔐 Login response in context:", response);

      if (response.success && response.token) {
        console.log("💾 Saving token to storage...");
        await AsyncStorage.setItem("authToken", response.token);

        console.log("👤 Fetching profile after login...");
        const profile = await apiService.getProfile();
        console.log("👤 Profile after login:", profile);

        if (profile) {
          setUser(profile);
          console.log("✅ Login successful, user set");
          return true;
        } else {
          console.log("❌ Login failed: no profile data");
        }
      } else {
        console.log("❌ Login failed: no token or not successful");
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
  ): Promise<boolean> => {
    try {
      const response = await apiService.register(email, password, alias);
      return response.success;
    } catch (error) {
      console.error("Register error:", error);
      return false;
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
