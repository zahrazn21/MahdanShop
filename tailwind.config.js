/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // مسیر صفحات Next.js
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        latin: ["'BalooBhajjaan2'", "sans-serif"],
        arabic: ["'NotoNaskhArabic'", "serif"],
      },
    },
  },
  plugins: [],
}