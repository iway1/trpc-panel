const config = require("../trpc-panel/tailwind.config.cjs");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../trpc-panel/src/**/*",
  ],
  extend: {},
  theme: {
    colors: config.theme.colors,
  },
};
