/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind durchsucht diese Dateien nach verwendeten Klassen
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Dark Mode über eine CSS-Klasse aktivieren
  darkMode: 'class',
  theme: {
    extend: {
      // Eigene Farben für die App
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0f172a',
        },
      },
      // Eigene Schriften
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
