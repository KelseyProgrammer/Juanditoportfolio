import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F1E8D6",
        ink: "#2E2620",
        inkfaint: "#5C5245",
        rust: "#B0522E",
        olive: "#5C7A4F",
        sand: "#C98A4A"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        stamp: ["var(--font-stamp)", "monospace"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        postcard: "0 12px 28px rgba(46, 38, 32, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
