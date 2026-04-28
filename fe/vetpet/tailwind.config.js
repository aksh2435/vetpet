/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Teal — dominant dark background
        teal: {
          900: '#1a3340',
          800: '#1e3d4d',
          700: '#264653',
          600: '#2d5566',
          500: '#346478',
          100: '#e8f4f7',
          50:  '#f0f8fa',
        },
        // Forest Green — primary brand & actions
        primary: {
          900: '#1a6b62',
          700: '#21867b',
          600: '#259188',
          500: '#2A9D8F',
          400: '#3db8a9',
          200: '#a8e6e0',
          100: '#d4f3f0',
          50:  '#edfaf8',
        },
        // Coral Red — sparingly for attention
        coral: {
          600: '#c4562e',
          500: '#E76F51',
          400: '#ec8b72',
          100: '#fde8e1',
          50:  '#fef4f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
