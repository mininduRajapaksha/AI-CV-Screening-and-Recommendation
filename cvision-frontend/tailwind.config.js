/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1B33',
          800: '#0F2444',
          700: '#132C55',
          600: '#1B3A6B',
        },
        brand: {
          blue: '#2563EB',
          cyan: '#22D3EE',
        },
        status: {
          green: '#10B981',
          greenBg: '#D1FAE5',
          amber: '#F59E0B',
          amberBg: '#FEF3C7',
          red: '#EF4444',
          redBg: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
