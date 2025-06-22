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
        black: '#0B0B0B',
        green: '#00FF9D',
        orange: '#F15A29',
        white: '#EDEDED',
        borderGreen: 'rgba(0,255,157,0.2)',
        darkGray: '#1A1A1A',
        lightGray: '#2A2A2A',
      },
      fontFamily: {
        'sora': ['Sora', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FF9D, 0 0 10px #00FF9D, 0 0 15px #00FF9D' },
          '100%': { boxShadow: '0 0 10px #00FF9D, 0 0 20px #00FF9D, 0 0 30px #00FF9D' },
        }
      }
    },
  },
  plugins: [],
} 