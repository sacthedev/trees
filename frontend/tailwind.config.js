/*
module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
*/
module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    safeList: [],
    content: ["./index.html", "./src/**/*.{jsx, js}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
