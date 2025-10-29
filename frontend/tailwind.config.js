/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8A97E',
          dark: '#B69A6F',
          light: '#D4B68D'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          dark: '#000000',
          light: '#333333'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif']
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }
      }
    }
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'dark': {
          500: '#2d2d2d',
          600: '#242424',
          700: '#1f1f1f',
          800: '#1a1a1a',
          900: '#171717',
        },
        'brand': {
          500: '#e2b555',
          600: '#d4af37',
        }
      },
      boxShadow: {
        'luxury': '0 4px 30px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [],
}
