/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16A34A",
        "primary-focus": "#15803D",
        "primary-hover": "#166534",
        dark: "#2B3237",
        "bg-color": "#f5f5f7",
        "dark-light": "#3B434A",
        "sidebar-bg": "#2c3d49",
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
