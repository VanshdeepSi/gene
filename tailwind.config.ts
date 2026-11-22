import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bureau: {
          base: "#07090c",
          surface: "#0c1017",
          card: "#111620",
          cardPaper: "#161b24",
          teal: "#19e3d0",
          "teal-dim": "#0a3e38",
          red: "#b3202a",
          "red-dark": "#4a0e12",
          paper: "#d9cfb8",
          "paper-dark": "#b8ab8e",
          muted: "#7e8894",
          border: "#1d2532",
          line: "rgba(217, 207, 184, 0.08)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "Courier New", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "scan-line": "scanline 8s linear infinite",
        "redaction-reveal": "redact 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glitch": "glitch 3s infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        redact: {
          "0%": { transform: "scaleX(1)", transformOrigin: "left" },
          "100%": { transform: "scaleX(0)", transformOrigin: "right" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 2px)" },
        },
      },
      boxShadow: {
        "teal-glow": "0 0 25px -5px rgba(25, 227, 208, 0.35)",
        "red-glow": "0 0 25px -5px rgba(179, 32, 42, 0.45)",
        "paper-elevation": "0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(217, 207, 184, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
