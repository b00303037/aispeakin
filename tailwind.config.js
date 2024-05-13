/**
 * https://m2.material.io/design/color/the-color-system.html
 */
const palettes = {
  indigo: {
    DEFAULT: "#3F51B5",
    50: "#E8EAF6",
    100: "#C5CAE9",
    200: "#9FA8DA",
    300: "#7986CB",
    400: "#5C6BC0",
    500: "#3F51B5",
    600: "#3949AB",
    700: "#303F9F",
    800: "#283593",
    900: "#1A237E",
    A100: "#8C9EFF",
    A200: "#536DFE",
    A400: "#3D5AFE",
    A700: "#304FFE",
  },
  deepPurple: {
    DEFAULT: "#673AB7",
    50: "#EDE7F6",
    100: "#D1C4E9",
    200: "#B39DDB",
    300: "#9575CD",
    400: "#7E57C2",
    500: "#673AB7",
    600: "#5E35B1",
    700: "#512DA8",
    800: "#4527A0",
    900: "#311B92",
    A100: "#B388FF",
    A200: "#7C4DFF",
    A400: "#651FFF",
    A700: "#6200EA",
  },
  purple: {
    DEFAULT: "#9C27B0",
    50: "#F3E5F5",
    100: "#E1BEE7",
    200: "#CE93D8",
    300: "#BA68C8",
    400: "#AB47BC",
    500: "#9C27B0",
    600: "#8E24AA",
    700: "#7B1FA2",
    800: "#6A1B9A",
    900: "#4A148C",
    A100: "#EA80FC",
    A200: "#E040FB",
    A400: "#D500F9",
    A700: "#AA00FF",
  },
  teal: {
    DEFAULT: "#009688",
    100: "#B2DFDB",
    200: "#80CBC4",
    300: "#4DB6AC",
    400: "#26A69A",
    500: "#009688",
    600: "#00897B",
    700: "#00796B",
    800: "#00695C",
    900: "#004D40",
    A100: "#A7FFEB",
    A200: "#64FFDA",
    A400: "#1DE9B6",
    A700: "#00BFA5",
  },
  red: {
    DEFAULT: "#F44336",
    50: "#FFEBEE",
    100: "#FFCDD2",
    200: "#EF9A9A",
    300: "#E57373",
    400: "#EF5350",
    500: "#F44336",
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
    A100: "#FF8A80",
    A200: "#FF5252",
    A400: "#FF1744",
    A700: "#D50000",
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "selector",
  theme: {
    extend: {
      animation: {
        "pulse-once": "pulse 1s",
      },
      borderRadius: {
        4: "4px",
        16: "16px",
      },
      borderWidth: {
        6: "6px",
      },
      colors: {
        primary: "var(--primary-palette) !important",
        accent: "var(--accent-palette) !important",
        warn: "var(--warn-palette) !important",
        light: "#f5f5f5",
        lighter: "#fafafa",
        lightest: "#ffffff",
        dark: "#424242",
        darker: "#303030",
        darkest: "#212121",
        goldenrod: "goldenrod",
      },
      maxWidth: {
        80: "320px", // 20rem
        90: "360px", // 22.5rem
        sm: "600px", // 37.5rem
        md: "960px", // 60rem
        lg: "1280px", // 80rem
        xl: "1920px", // 120rem
        "10/12": "83.333333%",
      },
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
    },
    screens: {
      sm: "600px", // 37.5rem
      md: "960px", // 60rem
      lg: "1280px", // 80rem
      xl: "1920px", // 120rem
    },
  },
  important: true,
  plugins: [],
};
