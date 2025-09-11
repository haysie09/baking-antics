/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- NEW COLORS FROM YOUR DESIGN ---
        'primary-color': '#f0425f',
        'secondary-color': '#f3e7e9',
        'text-primary': '#1b0d10',
        'text-secondary': '#9a4c59',
        'background-color': '#fcf8f9',
        'upcoming-bg': '#f8b4c0',
        'upcoming-card-bg': '#fde0e5',

        // --- Existing colors are kept ---
        'app-white': '#FFFFFF',
        'info-box': '#fff7f5',
        'app-grey': '#333333',
        'burnt-orange': '#ec967a',
        'light-peach': '#ffe9dd',
        'star-gold': '#ffca00',
        'confirm-bg': '#c7ebff',
        'confirm-text': '#1072a8',
        'add-idea': '#e67753',
      },
      fontFamily: {
        'patrick-hand': ['"Patrick Hand"', 'cursive'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}