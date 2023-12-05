/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-grey': '#999',
        'light-black' : '#333',
      },
      backgroundColor : {
        'light-black' : '#333',
      }

    },
  },
  plugins: [],
}