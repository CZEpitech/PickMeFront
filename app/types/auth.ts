export interface RegisterData {
  email: string;
  password: string;
  alias: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: any;
}

export interface ValidationErrors {
  email: string;
  password: string;
  alias: string;
}

export interface User {
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

// Nouveaux types pour la modification du profil
export interface ProfileUpdateData {
  alias?: string;
  birthdate?: string;
  pays?: string;
  langue?: string;
  description?: string;
  avatar?: string;
  pronous?: string;
  is_public?: boolean;
}

export interface ProfileValidationErrors {
  alias?: string;
  birthdate?: string;
  pays?: string;
  langue?: string;
  description?: string;
  avatar?: string;
  pronous?: string;
}

// Utilitaires de validation
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email requis";
  if (!emailRegex.test(email)) return "Format d'email invalide";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Mot de passe requis";
  if (password.length < 6) return "Au moins 6 caractères requis";
  return "";
};

export const validateAlias = (alias: string): string => {
  if (!alias) return "Alias requis";
  if (alias.length < 3) return "Au moins 3 caractères requis";
  if (!/^[a-zA-Z0-9_]+$/.test(alias))
    return "Lettres, chiffres et _ uniquement";
  return "";
};

export const validateRegisterData = (data: RegisterData): ValidationErrors => {
  return {
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    alias: validateAlias(data.alias),
  };
};
