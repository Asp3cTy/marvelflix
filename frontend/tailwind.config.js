/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        marvelRed: "#ed1d24",
        marvelDark: "#202020",
      },
    },
  },
  plugins: [],
};
