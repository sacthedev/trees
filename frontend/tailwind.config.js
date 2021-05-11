module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safeList: [],
    content: ['./index.html', './src/**/*.{jsx, js}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkyellow: '#E38613',
        darkblue: '#151934',
        lightblue: '#1C2340',
        danger: '#BB3039',
        lightgray: '#5A5A5A',
        darkgray: '#363434',
        headerBlue: '#252D4C',
        darkgreen: '#098E31',
        lightgreen: '#48D826',
        rowTextWhite: '#90A3B8',
        headerTextWhite: '#7B858F',
      },
      fontFamily: {
        sans: ['Poppins'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
