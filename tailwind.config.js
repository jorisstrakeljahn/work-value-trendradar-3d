/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-style colors
        'apple-gray': {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2da',
          300: '#b0b0bc',
          400: '#8e8e9e',
          500: '#6e6e80',
          600: '#5a5a6a',
          700: '#4a4a58',
          800: '#3d3d48',
          900: '#2d2d35',
        },
        // Neutral dark gray (no blue tint)
        dark: {
          DEFAULT: '#1a1a1a',
          50: '#2a2a2a',
          100: '#252525',
          200: '#202020',
          300: '#1a1a1a',
          400: '#151515',
          500: '#0f0f0f',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
