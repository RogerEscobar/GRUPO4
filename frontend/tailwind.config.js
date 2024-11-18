import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amadeus: {
          primary: "#1e4687", // Azul principal
          secondary: "#15316a", // Azul oscuro para hovers
          light: "#ffffff", // Blanco
          dark: "#000000", // Negro
          gray: "#707070", // Gris
        },
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: ["light"],
  },
};
