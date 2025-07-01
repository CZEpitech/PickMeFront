/**
 * 📐 Constantes de Design - Version Thème Sombre
 */

// 🎯 Espacements simples
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// 📏 Tailles de composants
export const SIZES = {
  button: 44,
  input: 44,
} as const;

// 🎨 Couleurs pour thème sombre
export const COLORS = {
  // Couleurs principales
  primary: "#3B82F6", // Bleu moderne
  secondary: "#6B7280", // Gris moyen
  accent: "#10B981", // Vert accent

  // Couleurs de fond sombres
  background: {
    primary: "#111827", // Fond principal très sombre
    secondary: "#1F2937", // Fond des cartes
    tertiary: "#374151", // Fond des inputs
  },

  // Couleurs de texte
  text: {
    primary: "#F9FAFB", // Texte principal blanc cassé
    secondary: "#D1D5DB", // Texte secondaire gris clair
    muted: "#9CA3AF", // Texte atténué
    placeholder: "#6B7280", // Placeholder
  },

  // Couleurs de bordure
  border: {
    primary: "#374151", // Bordure principale
    secondary: "#4B5563", // Bordure secondaire
    focus: "#3B82F6", // Bordure au focus
  },

  // Couleurs d'état
  success: "#10B981", // Vert succès
  danger: "#EF4444", // Rouge erreur
  warning: "#F59E0B", // Orange avertissement

  // Couleurs utilitaires (palette grise inversée pour le thème sombre)
  gray: {
    50: "#111827", // Le plus sombre
    100: "#1F2937",
    200: "#374151",
    300: "#4B5563",
    400: "#6B7280",
    500: "#9CA3AF",
    600: "#D1D5DB",
    700: "#E5E7EB",
    800: "#F3F4F6",
    900: "#F9FAFB", // Le plus clair
  },
} as const;
