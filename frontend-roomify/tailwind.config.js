/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A68AD6", // Cor lilás do logo
          light: "#DED3F8", // Tom mais claro do fundo
          dark: "#8A67C2", // Tom mais escuro para hover e ênfase
        },
        secondary: {
          DEFAULT: "#33CC66", // Verde do ponto do logo
          dark: "#29A352", // Verde mais escuro para hover
        },
        brand: {
          purple: "#483365", // Cor roxa escura do texto "Roomify"
        },
      },
    },
  },
  plugins: [],
};
