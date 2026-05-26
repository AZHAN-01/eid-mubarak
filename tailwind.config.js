/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf5',
          100: '#fef7da',
          200: '#fde8ab',
          300: '#fad270',
          400: '#f7b73c',
          500: '#e0981b', // Beautiful warm gold
          600: '#c27912',
          700: '#a15b10',
          800: '#844710',
          900: '#6d3910',
          950: '#3f1c05',
        },
        islamic: {
          50: '#eefdf5',
          100: '#d5fae5',
          200: '#aef3cd',
          300: '#75e7ab',
          400: '#3bd383',
          500: '#15b865',
          600: '#0b9550',
          700: '#0b7642',
          800: '#0d5d36',
          900: '#0c4d2e',
          950: '#042b1a', // Deep emerald green
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
        'spin-slow': 'spin 20s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'sway': 'sway 8s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(25px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 10px rgba(224, 152, 27, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 25px rgba(224, 152, 27, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg) translateX(-5px)' },
          '50%': { transform: 'rotate(3deg) translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}
