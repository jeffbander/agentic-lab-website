/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Mount Sinai Health System brand colors
        'sinai-cyan': '#06ABEB',      // Vivid Cerulean - primary brand color
        'sinai-magenta': '#DC298D',    // Barbie Pink - secondary brand color
        'sinai-navy': '#212070',       // St. Patrick's Blue - text/headers
        'sinai-dark': '#00002D',       // Cetacean Blue - dark backgrounds
        'sinai-violet': '#7B2D8E',     // Brand violet (cyan + magenta overlap)

        // Extended palette for UI (keeping original for compatibility)
        'sinai-blue': {
          50: '#e6f7fe',
          100: '#b3e7fc',
          200: '#80d7fa',
          300: '#4dc7f8',
          400: '#1ab7f6',
          500: '#06ABEB',  // Official brand cyan
          600: '#0589be',
          700: '#046791',
          800: '#034564',
          900: '#022337',
        },
        'sinai-maroon': {
          50: '#fce8f3',
          100: '#f7b8dd',
          200: '#f288c7',
          300: '#ed58b1',
          400: '#e8289b',
          500: '#DC298D',  // Official brand magenta
          600: '#b02171',
          700: '#841955',
          800: '#581139',
          900: '#2c081c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
