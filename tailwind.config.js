/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta semântica simplificada e focada
        background: '#FDF8F0',  // Areia (Fundo principal)
        foreground: '#3C2A21',  // Madeira Escura (Texto principal)
        
        primary: {
          DEFAULT: '#285C4D', // Verde Floresta (Principal)
          foreground: '#FDF8F0', // Texto sobre a cor primária
          50: '#eaf7f4',
          100: '#d0ebde',
          200: '#a3d9ca',
          300: '#7ac7b8',
          400: '#54b3a4',
          500: '#285C4D', // Cor base
          600: '#235244',
          700: '#1d4338',
          800: '#17342d',
          900: '#112522',
        },
        secondary: {
          DEFAULT: '#8A6F55', // Marrom Terra (Secundário)
          foreground: '#FDF8F0', // Texto sobre a cor secundária
          50: '#f7f3ef',
          100: '#e9e1d9',
          200: '#d5c9b9',
          300: '#c0af99',
          400: '#ab9579',
          500: '#8A6F55', // Cor base
          600: '#7c644c',
          700: '#67533f',
          800: '#524232',
          900: '#3d3125',
        },
        accent: {
          DEFAULT: '#E77728', // Laranja Tucano (Destaque)
          foreground: '#FDF8F0', // Texto sobre a cor de destaque
          50: '#fff8f2',
          100: '#feedde',
          200: '#fdd9b9',
          300: '#fcc593',
          400: '#fab16e',
          500: '#E77728', // Cor base
          600: '#d96a1b',
          700: '#b45511',
          800: '#8f430d',
          900: '#6a320a',
        },

        // Cores de estado (mantidas para funcionalidade)
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        info: '#2563EB',

        // Cores para elementos de UI sutis
        muted: {
            DEFAULT: '#e9e1d9',      // Tom de 'secondary' mais claro
            foreground: '#67533f' // Tom de 'secondary' mais escuro para texto
        },
        border: '#d5c9b9', // Borda padrão
      },
      fontFamily: {
        'display': ['"Merriweather"', 'Georgia', 'serif'],
        'body': ['"Lato"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      },
      boxShadow: {
        // Sombras mais sutis e consistentes
        'sm': '0 1px 2px 0 rgba(60, 42, 33, 0.05)',
        'DEFAULT': '0 2px 4px -1px rgba(60, 42, 33, 0.1), 0 1px 2px -1px rgba(60, 42, 33, 0.06)',
        'md': '0 4px 6px -1px rgba(60, 42, 33, 0.1), 0 2px 4px -2px rgba(60, 42, 33, 0.06)',
        'lg': '0 10px 15px -3px rgba(60, 42, 33, 0.1), 0 4px 6px -4px rgba(60, 42, 33, 0.05)',
        'xl': '0 20px 25px -5px rgba(60, 42, 33, 0.1), 0 8px 10px -6px rgba(60, 42, 33, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      addUtilities({
        // Um único estilo de scrollbar, fácil de aplicar
        '.scrollbar-themed': {
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c0af99', // secondary-300
            borderRadius: '10px',
            border: '2px solid #FDF8F0', // background color
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#8A6F55', // secondary
          },
        },
      });
    },
  ],
}
