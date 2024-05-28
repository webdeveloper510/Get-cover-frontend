/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-grey': '#999',
        'light-grey': '#ebe4e4',
        'light-black' : '#333',
        'light-white' : '#5D6E66',
        'light-green' : '#c1c5c3',
        'Gray28' : '#474747',
        'grayf9' : '#F9F9F9',
        'Eclipse' : '#3C3C3C',
        'Light-Grey' : '#D1D1D1',
        'white' : "#fff",
        'Black-Russian' : '#1B1D21',
        'White-Smoke' : '#f7f7f7',
        'Smoke' : '#EBEBEB',
        'Granite-Gray' : '#5f5f5f',
        'red' : '#ff0000',
        'Onyx' : '#383838',
        'Bright-Grey' : '#535456',
        'red-500' : '#ff0000',
      },
      padding: {
        '10p': '10px',
      },
      backgroundColor : {
        'light-black' : '#333',
        'Gray28' : '#474747',
        'grayf9' : '#F9F9F9',
        'Eclipse' : '#3C3C3C',
        'Light-Grey' : '#D1D1D1',
        'white' : "#fff",
        'Black-Russian' : '#1B1D21',
        'White-Smoke' : '#f7f7f7',
        'Smoke' : '#EBEBEB',
        'Granite-Gray' : '#5f5f5f',
        'red' : '#ff0000',
        'Onyx' : '#383838',
        'Bright-Grey' : '#535456',
        'red-500' : '#ff0000',
      },
      backgroundImage : {
        'hero-pattern': "url('/src/assets/images/Bg.png')",
        'hero-register': "url('/src/assets/images/register_banner.png')",
        'Dropdown': "url('/src/assets/images/DropdownImage.png')",
        'Edit' : "url('/src/assets/images/Edit-Dealer.svg')",
        'Dealer-details' : "url('/src/assets/images/Dealer-Details.svg')",
        'contract' : "url('/src/assets/images/Dealer/contract-head.svg')",
      },
      dropShadow: {
        '3xl': '0 4px 84px rgba(0, 0, 0, 0.25)',
        '4xl': '0px 0px 100px rgba(0, 0, 0, 0.15)',
        '5xl': '0px 4.979px 29.872px rgba(0, 0, 0, 0.25)',
        
      },
      boxShadow: {
        '6xl':'-11px -4px 11px 20px #f9f9f9',
      },
      screens: {
        's': '320px',
        // => @media (min-width: 320px) { ... }

        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }

    },
  },
  plugins: [],
}