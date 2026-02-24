import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-public-sans)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0b5ed7",
        secondary: "#6c757d",
        accent: "var(--accent)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      keyframes: {
        pulseOpacity: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        orbPulse: {
          "0%, 100%": {
            transform: "scale(1) translate(0, 0)",
            opacity: "0.8",
          },
          "50%": {
            transform: "scale(1.15) translate(20px, -20px)",
            opacity: "1",
          },
        },
        "pulse-dot": {
          "0%": { boxShadow: "0 0 0 0 rgba(168, 85, 247, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(168, 85, 247, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(168, 85, 247, 0)" },
        },
      },
      animation: {
        pulseOpacity: "pulseOpacity 2s ease-in-out infinite",
        orbPulse: "orbPulse 8s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
