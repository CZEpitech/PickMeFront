/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // === COULEURS PRINCIPALES ===
        "primary-bg": "#8894B9", // Bleu-gris principal (fond)
        "primary-text": "#F5C74D", // Jaune - UNIQUEMENT pour éléments hyper importants
        "primary-variant": "#A3A3B4", // Gris-bleu secondaire

        // === VARIATIONS DU FOND PRINCIPAL ===
        "primary-bg-light": "#9CA5C7", // Version plus claire du fond
        "primary-bg-dark": "#6B7A9E", // Version plus foncée du fond
        "primary-bg-darker": "#4A5578", // Version très foncée

        // === HIÉRARCHIE DE GRIS POUR TEXTE ===
        "text-primary": "#FFFFFF", // Blanc - Texte principal sur fond sombre
        "text-secondary": "#C4C4D1", // Gris clair - Texte secondaire
        "text-muted": "#A3A3B4", // Gris moyen - Métadonnées, labels
        "text-disabled": "#7A7A8A", // Gris foncé - Éléments inactifs

        // === SURFACES & ÉLÉVATION ===
        "surface-elevated": "#9BA8CD", // Surface surélevée (cards, modals)
        "surface-pressed": "#7A89B0", // Surface pressée (boutons actifs)
        "surface-subtle": "#8A96B8", // Surface subtile (hover states)

        // === BORDURES ===
        "border-subtle": "#B8C1D9", // Bordures discrètes
        "border-strong": "#8A96B8", // Bordures marquées
        "border-focus": "#F5C74D", // Bordures de focus (jaune)

        // === ÉTATS NEUTRES ===
        "neutral-light": "#E8E8F0", // Très clair - Backgrounds subtils
        neutral: "#C4C4D1", // Moyen - Dividers
        "neutral-dark": "#7A7A8A", // Foncé - Icons inactives
      },
    },
  },
  plugins: [],
};
