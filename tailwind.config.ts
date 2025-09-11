import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        poppins: ["Poppins"],
        montserrat: ["Montserrat"]
      },
      colors: {
        background: "#060B15",
        overlay: "#131620",
        bd: "#282D37",
        txt: "#D1D5DB",
        highlight: "#5E8FDE",
        "gray-overlay": "#1A222D",
      }
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar-hide")],
};
export default config;
