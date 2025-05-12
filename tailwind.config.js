/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          primary: "#E83D29",
          dark: "#2B3237",
          "dark-light": "#3B434A", 
          "primary-hover": "#cc2f1e",
        },
        animation: {
          gradientAnimation: 'gradientMove 10s ease infinite',
        },
        keyframes: {
          gradientMove: {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
        },
      },
    },
    plugins: [],
  };
  