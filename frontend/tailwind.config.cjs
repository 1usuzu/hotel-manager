/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c71f1f',
          50: '#fdecec',
          100: '#fbd9d9',
          200: '#f5b3b3',
          300: '#ef8c8c',
          400: '#e96666',
          500: '#e34040',
          600: '#c71f1f',
          700: '#a11919',
          800: '#7b1313',
          900: '#540d0d'
        },
        dark: {
          DEFAULT: '#171717',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      boxShadow: {
        'elegant': '0 8px 28px -2px rgba(0, 0, 0, 0.1), 0 8px 16px -2px rgba(0, 0, 0, 0.1)',
        'luxury': '0 0 60px -15px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
