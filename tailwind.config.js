/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Espacements cohérents
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      // Tailles standardisées
      height: {
        input: "44px",
        button: "44px",
      },
      // Palette BeReal-like OLED monochrome
      colors: {
        // Couleurs principales - style BeReal minimaliste
        primary: "#FFFFFF", // Blanc pur pour les boutons principaux
        secondary: "#8E8E93", // Gris iOS pour les éléments secondaires
        accent: "#FFFFFF", // Blanc pour les accents (style BeReal)

        // Couleurs de fond - Noir OLED profond
        background: {
          primary: "#000000", // Noir OLED pur pour économiser la batterie
          secondary: "#1C1C1E", // Gris très sombre pour les cartes (iOS)
          tertiary: "#2C2C2E", // Gris sombre pour les inputs
        },

        // Couleurs de texte - Monochrome BeReal
        text: {
          primary: "#FFFFFF", // Blanc pur pour le texte principal
          secondary: "#EBEBF5", // Blanc légèrement teinté (iOS)
          muted: "#8E8E93", // Gris système iOS
          placeholder: "#636366", // Gris sombre pour placeholders
        },

        // Couleurs de bordure - Subtiles et minimalistes
        border: {
          primary: "#38383A", // Gris très sombre pour bordures principales
          secondary: "#48484A", // Gris sombre pour bordures secondaires
          focus: "#FFFFFF", // Blanc pour le focus (style BeReal)
        },

        // Couleurs d'état - Minimales mais visibles
        success: "#30D158", // Vert iOS
        danger: "#FF453A", // Rouge iOS
        warning: "#FF9F0A", // Orange iOS

        // Couleurs utilitaires (maintien compatibilité)
        muted: "#8E8E93",
      },
    },
  },
  plugins: [],
};
