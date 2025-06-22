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
        // Core OSA Palette
        black: '#0A0A0A',
        green: '#00FF9D',
        orange: '#F15A29',
        pink: '#FF6B9D',
        white: '#EDEDED',
        
        // Psychonaut Gradients
        'glow-green': '#00FF9D',
        'glow-orange': '#F15A29',
        'glow-pink': '#FF6B9D',
        'glow-cyan': '#00FFFF',
        
        // Glassmorphic Layers
        'glass-dark': 'rgba(10, 10, 10, 0.8)',
        'glass-light': 'rgba(237, 237, 237, 0.1)',
        'glass-green': 'rgba(0, 255, 157, 0.1)',
        'glass-orange': 'rgba(241, 90, 41, 0.1)',
        
        // Border Effects
        'border-green': 'rgba(0, 255, 157, 0.3)',
        'border-orange': 'rgba(241, 90, 41, 0.3)',
        'border-pink': 'rgba(255, 107, 157, 0.3)',
        'border-cyan': 'rgba(0, 255, 255, 0.3)',
        
        // Background Layers
        'bg-deep': '#0A0A0A',
        'bg-dark': '#1A1A1A',
        'bg-medium': '#2A2A2A',
        'bg-light': '#3A3A3A',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'sora': ['Sora', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        // Core Animations
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ripple': 'ripple 0.6s ease-out',
        'morph': 'morph 4s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'breath': 'breath 4s ease-in-out infinite',
        'portal': 'portal 3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite alternate',
        'glass-shift': 'glass-shift 8s ease-in-out infinite',
        'particle-float': 'particle-float 20s linear infinite',
      },
      keyframes: {
        // Dual Glow Effects
        glow: {
          '0%': { 
            boxShadow: '0 0 5px #00FF9D, 0 0 10px #00FF9D, 0 0 15px #00FF9D, 0 0 20px #F15A29',
            textShadow: '0 0 5px #00FF9D, 0 0 10px #00FF9D'
          },
          '100%': { 
            boxShadow: '0 0 10px #00FF9D, 0 0 20px #00FF9D, 0 0 30px #00FF9D, 0 0 40px #F15A29',
            textShadow: '0 0 10px #00FF9D, 0 0 20px #00FF9D'
          },
        },
        // Floating Animation
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Shimmer Effect
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Ripple Effect
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        // Morphing Shapes
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        // Text Flicker
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        // Breathing Effect
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        // Portal Effect
        portal: {
          '0%': { 
            boxShadow: '0 0 20px #00FF9D, inset 0 0 20px #00FF9D',
            transform: 'rotate(0deg)'
          },
          '50%': { 
            boxShadow: '0 0 40px #F15A29, inset 0 0 40px #F15A29',
            transform: 'rotate(180deg)'
          },
          '100%': { 
            boxShadow: '0 0 20px #00FF9D, inset 0 0 20px #00FF9D',
            transform: 'rotate(360deg)'
          },
        },
        // Neon Pulse
        'neon-pulse': {
          '0%': { 
            boxShadow: '0 0 5px #00FF9D, 0 0 10px #00FF9D, 0 0 15px #00FF9D',
            textShadow: '0 0 5px #00FF9D'
          },
          '100%': { 
            boxShadow: '0 0 10px #00FF9D, 0 0 20px #00FF9D, 0 0 30px #00FF9D',
            textShadow: '0 0 10px #00FF9D'
          },
        },
        // Glass Shift
        'glass-shift': {
          '0%, 100%': { 
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 255, 157, 0.1)'
          },
          '50%': { 
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(241, 90, 41, 0.1)'
          },
        },
        // Particle Float
        'particle-float': {
          '0%': { transform: 'translateY(100vh) rotate(0deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        // Glow Shadows
        'glow-green': '0 0 20px rgba(0, 255, 157, 0.5)',
        'glow-orange': '0 0 20px rgba(241, 90, 41, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 107, 157, 0.5)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'glow-dual': '0 0 20px rgba(0, 255, 157, 0.5), 0 0 40px rgba(241, 90, 41, 0.3)',
        'glow-triple': '0 0 20px rgba(0, 255, 157, 0.5), 0 0 40px rgba(241, 90, 41, 0.3), 0 0 60px rgba(255, 107, 157, 0.2)',
        
        // Glass Shadows
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-green': '0 8px 32px 0 rgba(0, 255, 157, 0.2)',
        'glass-orange': '0 8px 32px 0 rgba(241, 90, 41, 0.2)',
      },
      backgroundImage: {
        // Gradient Backgrounds
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-psychedelic': 'linear-gradient(45deg, #00FF9D, #F15A29, #FF6B9D, #00FFFF)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.4), transparent)',
        'gradient-glass': 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, rgba(241, 90, 41, 0.1) 100%)',
        
        // Grid Patterns
        'grid-pattern': 'linear-gradient(rgba(0, 255, 157, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 157, 0.1) 1px, transparent 1px)',
        'grid-pattern-large': 'linear-gradient(rgba(0, 255, 157, 0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 255, 157, 0.05) 2px, transparent 2px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
        'grid-large': '50px 50px',
      },
    },
  },
  plugins: [],
} 