/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-grey': 'rgb(var(--neutral-grey) / <alpha-value>)',
        'light-grey': 'rgb(var(--light-grey) / <alpha-value>)',
        'light-black': 'rgb(var(--light-black) / <alpha-value>)',
        'light-white': 'rgb(var(--light-white) / <alpha-value>)',
        'light-green': 'rgb(var(--light-green) / <alpha-value>)',
        'Gray28': 'rgb(var(--Gray28) / <alpha-value>)',
        'grayf9': 'rgb(var(--grayf9) / <alpha-value>)',
        'Eclipse': 'rgb(var(--Eclipse) / <alpha-value>)',
        'Light-Grey': 'rgb(var(--Light-Grey) / <alpha-value>)',
        'white': 'rgb(var(--white) / <alpha-value>)',
        'Black-Russian': 'rgb(var(--Black-Russian) / <alpha-value>)',
        'White-Smoke': 'rgb(var(--White-Smoke) / <alpha-value>)',
        'Smoke': 'rgb(var(--Smoke) / <alpha-value>)',
        'Granite-Gray': 'rgb(var(--Granite-Gray) / <alpha-value>)',
        'red': 'rgb(var(--red) / <alpha-value>)',
        'Onyx': 'rgb(var(--Onyx) / <alpha-value>)',
        'Bright-Grey': 'rgb(var(--Bright-Grey) / <alpha-value>)',
        'red-500': 'rgb(var(--red-500) / <alpha-value>)',
      },
      padding: {
        '10p': '10px',
      },
      backgroundColor: {
        'light-black': 'rgb(var(--light-black) / <alpha-value>)',
        'Gray28': 'rgb(var(--Gray28) / <alpha-value>)',
        'grayf9': 'rgb(var(--grayf9) / <alpha-value>)',
        'Eclipse': 'rgb(var(--Eclipse) / <alpha-value>)',
        'Light-Grey': 'rgb(var(--Light-Grey) / <alpha-value>)',
        'white': 'rgb(var(--white) / <alpha-value>)',
        'Black-Russian': 'rgb(var(--Black-Russian) / <alpha-value>)',
        'White-Smoke': 'rgb(var(--White-Smoke) / <alpha-value>)',
        'Smoke': 'rgb(var(--Smoke) / <alpha-value>)',
        'Granite-Gray': 'rgb(var(--Granite-Gray) / <alpha-value>)',
        'red': 'rgb(var(--red) / <alpha-value>)',
        'Onyx': 'rgb(var(--Onyx) / <alpha-value>)',
        'Bright-Grey': 'rgb(var(--Bright-Grey) / <alpha-value>)',
        'red-500': 'rgb(var(--red-500) / <alpha-value>)',
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/Bg.png')",
        'hero-register': "url('/src/assets/images/register_banner.png')",
        'Dropdown': "url('/src/assets/images/DropdownImage.png')",
        'Edit': "url('/src/assets/images/Edit-Dealer.svg')",
        'Dealer-details': "url('/src/assets/images/Dealer-Details.svg')",
        'contract': "url('/src/assets/images/Dealer/contract-head.svg')",
      },
      dropShadow: {
        '3xl': '0 4px 84px rgba(0, 0, 0, 0.25)',
        '4xl': '0px 0px 100px rgba(0, 0, 0, 0.15)',
        '5xl': '0px 4.979px 29.872px rgba(0, 0, 0, 0.25)',
        'header': '0px 7px 14px 0px #00000014',
      },
      boxShadow: {
        '6xl': '-11px -4px 11px 20px #f9f9f9',
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
      },
    },
  },
  plugins: [
    {
      name: 'user-color-plugin',
      async configure({ addBase }) {
        const color = await fetch('https://api.codewarranty.com/api-v1/user/setting');
        addBase({
          ':root': {
            '--light-black': color.colorScheme.colorCode,
          },
        });
      },
    },
  ],
};
