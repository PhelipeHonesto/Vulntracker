/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GhostSignal Brand Colors
        'phantom-navy': '#0E0F1A',      // Background
        'hacker-mint': '#5EF1BF',       // Primary accent
        'alert-pink': '#F65AA7',        // Secondary accent
        'cortex-blue': '#2F9DFE',       // Info blue
        'fog-white': '#FFFFFF',         // Primary text
        'silent-gray': '#A1A6B1',       // Subtext/disabled
        
        // Semantic colors
        'ghost': {
          50: '#1A1B2A',
          100: '#2A2B3A',
          200: '#3A3B4A',
          300: '#4A4B5A',
          400: '#5A5B6A',
          500: '#6A6B7A',
          600: '#7A7B8A',
          700: '#8A8B9A',
          800: '#9A9BAA',
          900: '#AAABBA',
        },
        'signal': {
          50: '#E6FFF5',
          100: '#CCFFEB',
          200: '#99FFD7',
          300: '#66FFC3',
          400: '#33FFAF',
          500: '#5EF1BF',  // Hacker Mint
          600: '#4BCF9B',
          700: '#38AD77',
          800: '#258B53',
          900: '#12692F',
        }
      },
      fontFamily: {
        'sora': ['Sora', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
        'display': ['Sora', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'code': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glitch': 'glitch 0.3s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'ripple': 'ripple 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(94, 241, 191, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(94, 241, 191, 0.6)',
            transform: 'scale(1.02)'
          },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      boxShadow: {
        'ghost': '0 0 20px rgba(94, 241, 191, 0.1)',
        'ghost-lg': '0 0 40px rgba(94, 241, 191, 0.15)',
        'alert': '0 0 20px rgba(246, 90, 167, 0.2)',
        'cortex': '0 0 20px rgba(47, 157, 254, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
} 