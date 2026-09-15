/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1a2b5c', dark: '#0f1a3d', light: '#2c3f7a' },
        coral: { DEFAULT: '#ff6b4a', hover: '#e85a3a' },
        surface: '#f5f6f8',
        authblue: { DEFAULT: '#3B82F6', dark: '#2563EB' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
