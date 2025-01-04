import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#e1f6fb",
              100: "#b7eaf5",
              200: "#8dddef",
              300: "#63d1e9",
              400: "#39c4e3",
              500: "#0fb8dd",
              600: "#0c98b6",
              700: "#0a7890",
              800: "#075769",
              900: "#053742",
              foreground: "#000",
              DEFAULT: "#0fb8dd",
            },
            secondary: {
              50: "#fbe1ed",
              100: "#f6b6d3",
              200: "#f18cb9",
              300: "#ec629f",
              400: "#e63786",
              500: "#e10d6c",
              600: "#ba0b59",
              700: "#920846",
              800: "#6b0633",
              900: "#440420",
              foreground: "#fff",
              DEFAULT: "#e10d6c",
            },

            focus: "#0fb8dd",
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#053742",
              100: "#075769",
              200: "#0a7890",
              300: "#0c98b6",
              400: "#0fb8dd",
              500: "#39c4e3",
              600: "#63d1e9",
              700: "#8dddef",
              800: "#b7eaf5",
              900: "#e1f6fb",
              foreground: "#000",
              DEFAULT: "#0fb8dd",
            },
            secondary: {
              50: "#440420",
              100: "#6b0633",
              200: "#920846",
              300: "#ba0b59",
              400: "#e10d6c",
              500: "#e63786",
              600: "#ec629f",
              700: "#f18cb9",
              800: "#f6b6d3",
              900: "#fbe1ed",
              foreground: "#fff",
              DEFAULT: "#e10d6c",
            },
            focus: "#0fb8dd",
          },
        },
      },
    }),
  ],
};
