/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#de2b2b",
        dark: "#0f0f0fff",
      }
    },
  },
  plugins: [],
}
