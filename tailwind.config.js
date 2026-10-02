module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1b1b18",
        paper: "#fbfaf6",
        hairline: "#e2ded2",
        accent: "#b3151a",
        gold: "#9b7a3c",
        muted: "#5c5a52",
      },
      fontFamily: {
        serif: ['"Noto Serif"', "Georgia", "serif"],
        sans: ['"Noto Sans"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "46rem",
      },
    },
  },
  plugins: [],
};
