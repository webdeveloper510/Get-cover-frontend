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
      },
      backgroundImage : {
        'hero-pattern': "url('/src/assets/images/Bg.png')",
        'hero-register': "url('/src/assets/images/register_banner.png')",

      },
      dropShadow: {
        '3xl': '0 4px 84px rgba(0, 0, 0, 0.25)',
      }
     

    },
  },
  plugins: [],
}