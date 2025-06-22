/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // OSA-Inspired Palette (with Shamanic Green)
        'osa-dark-blue': '#091c35',
        'osa-orange': '#ff7500', // Kept for reference, but green is primary
        'osa-blue': '#0a4bb6',
        'shamanic-green': '#00FF9D',
        'light-text': '#EDEDED',
        'dark-text': '#091c35',
        'border-accent': 'rgba(0, 255, 157, 0.3)',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'signature': ['Dancing Script', 'cursive'],
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'accent-glow': '0 0 15px rgba(0, 255, 157, 0.2)',
        'card-shadow': '0 4px 12px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
} 