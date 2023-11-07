/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      'xs': '475px', // Example of a new extra small screen size
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  darkMode: 'class',
  content: [
    "./public/*.html", // Path to your HTML files
    "./src/*.css",     // Path to your CSS files
    // You can adjust the paths based on your actual file locations
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
