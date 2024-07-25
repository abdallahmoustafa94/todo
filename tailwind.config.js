/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'media', 
  theme: {
    extend: {
      colors: {
        'primary': {
          light: '#3B82F6', 
          dark: '#2563EB', 
        },
        'background': {
          light: '#FFFFFF',
          dark: '#1F2937',  
        },
        'text': {
          light: '#111827', 
          dark: '#F9FAFB',  
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}