module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    safeList: [],
    content: ["./index.html", "./src/**/*.{jsx, js}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkblue: "#162447",
        lightblue: "#1F4068",
        pink: "#E94560",
        lightgray: "#5A5A5A",
        darkgray: "#363434",
        green: "#40CF44",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
