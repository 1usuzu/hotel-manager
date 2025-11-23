/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
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
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2933',
          900: '#111827',
        },
        background: {
          DEFAULT: '#0b0b10',
          soft: '#111118',
          card: '#161623',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#171717',
        },
        brand: {
          500: '#e2b555',
          600: '#d4af37',
        }
      },
      boxShadow: {
        luxury: '0 4px 30px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [],
}
