/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-bg': '#FDF8F0',
        'theme-text': '#3C2A21',
        'theme-primary': '#285C4D',
        'theme-secondary': '#8A6F55',
        'theme-accent': '#E77728',
      },
      fontFamily: {
        'display': ['"Merriweather"', 'serif'],
        'body': ['"Lato"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s both',
        'pulse-accent': 'pulse-accent 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-accent': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
        'float': {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
      }
    },
  },
  plugins: [],
}