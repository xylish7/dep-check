import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#e1f6ef",
              100: "#b7ead9",
              200: "#8ddec3",
              300: "#64d2ad",
              400: "#3ac597",
              500: "#10b981",
              600: "#0d996a",
              700: "#0a7854",
              800: "#08583d",
              900: "#053827",
              foreground: "#000",
              DEFAULT: "#10b981",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#053827",
              100: "#08583d",
              200: "#0a7854",
              300: "#0d996a",
              400: "#10b981",
              500: "#3ac597",
              600: "#64d2ad",
              700: "#8ddec3",
              800: "#b7ead9",
              900: "#e1f6ef",
              foreground: "#000",
              DEFAULT: "#10b981",
            },
          },
        },
      },
    }),
  ],
};

export default config;
