/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // primary: "#E83D29",
        primary: "#16A34A",        // ✅ base green (Tailwind emerald-600 / green-600)
        "primary-focus": "#15803D", // ✅ darker shade for focus
        "primary-hover": "#166534", // ✅ even darker for hover

        // {
        //   100: '#fce8e5',
        //   200: '#f7b9b2',
        //   300: '#f18b7f',
        //   400: '#ec5d4c',
        //   500: '#e62e19',
        //   600: '#b32413',
        //   700: '#801a0e',
        //   800: '#4d0f08',
        //   900: '#1a0503',
        // },
        dark: "#2B3237",
        "bg-color": "#f5f5f7",
        "dark-light": "#3B434A",
        // "primary-focus": "#b32413",
        // "primary-hover": "#801a0e",
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
