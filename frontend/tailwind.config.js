// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0A2540',
        'brand-green': '#00D4B5',
        'brand-gray': '#F6F9FC',
        'brand-text': '#425466',
        'warning': '#F6A928',
        'danger': '#E53E3E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}