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
      screens: {
        's': '400px',
        // => @media (min-width: 640px) { ... }

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