/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/public/index.html", // Adjust this path if your HTML file is located elsewhere
      "./src/**/*.{js,jsx,ts,tsx}" // Tailwind will look for classes in all JSX, TSX, etc.
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  