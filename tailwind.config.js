const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Playfair Display", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        "primary-dark": "#3d3d3d",
        "primary-light": "#f2f2f2",
        "secondary-dark": "#404040",
        "secondary-light": "#ffffff",
      },
    },
  },
  plugins: [],
};
