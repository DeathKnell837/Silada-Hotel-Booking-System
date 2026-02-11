/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E0C994',
          dark: '#A68B5B',
          50: '#FBF7F0',
          100: '#F5ECD9',
          200: '#E8D5AE',
          300: '#DBBF84',
          400: '#D4AF37',
          500: '#C9A96E',
          600: '#A68B5B',
          700: '#836D47',
          800: '#5F4F33',
          900: '#3C311F',
        },
        dark: {
          DEFAULT: '#1A1A2E',
          light: '#2A2A4A',
          lighter: '#3A3A5A',
          deeper: '#0F0F1A',
          surface: '#222240',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(15,15,26,0.7), rgba(26,26,46,0.9))',
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #E0C994 50%, #C9A96E 100%)',
        'card-gradient': 'linear-gradient(to bottom, rgba(42,42,74,0.5), rgba(26,26,46,0.8))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
