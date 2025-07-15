/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#8894B9',
        'primary-text': '#F5C74D',
        'primary-variant': '#A3A3B4',
      }
    },
  },
  plugins: [],
}