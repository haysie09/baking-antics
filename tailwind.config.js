/** @type {import('tailwindcss').Config} */
module.exports = {
  // This is the critical line that enables dark mode
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
