/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          400: '#6b8cff',
          500: '#4f6ef7',
          600: '#3a56e8',
          900: '#1a1f3c',
        },
        dark: {
          bg: '#0f1117',
          surface: '#1a1d2e',
          card: '#222540',
          border: '#2e3254',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
