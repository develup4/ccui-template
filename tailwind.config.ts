import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./libs/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
        montserrat: ["Montserrat"],
      },
      colors: {
        background: "#060B15",
        overlay: "#131620",
        bd: "#282D37",
        txt: "#D1D5DB",
        highlight: "#5E8FDE",
        "gray-overlay": "#1A222D",
        "node-select": "#EF4444",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar-hide")],
};
export default config;
