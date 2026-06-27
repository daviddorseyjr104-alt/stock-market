import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal/black base surfaces
        ink: {
          950: "#05060a",
          900: "#090b12",
          850: "#0d1019",
          800: "#11141f",
          700: "#171b29",
          600: "#1f2433",
          500: "#2a3042",
        },
        // Brand — electric capital green/teal + deep violet accent
        capital: {
          50: "#e6fff4",
          100: "#b8ffe1",
          200: "#7dffca",
          300: "#39f5ac",
          400: "#10e29a",
          500: "#00c281",
          600: "#019b6a",
          700: "#0b7553",
        },
        violet: {
          400: "#9d7bff",
          500: "#7c5cff",
          600: "#6132ff",
        },
        glow: "#39f5ac",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(57,245,172,0.18), 0 8px 40px -8px rgba(57,245,172,0.35)",
        "glow-violet": "0 0 0 1px rgba(124,92,255,0.25), 0 8px 40px -8px rgba(124,92,255,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -24px rgba(0,0,0,0.9)",
        float: "0 30px 80px -30px rgba(0,0,0,0.85)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "capital-gradient":
          "linear-gradient(135deg, #39f5ac 0%, #10e29a 35%, #7c5cff 100%)",
        "radial-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(57,245,172,0.16) 0%, rgba(57,245,172,0) 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "count-pop": {
          "0%": { transform: "scale(0.9)", opacity: "0.4" },
          "60%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.21,0.6,0.35,1) both",
        "fade-in": "fade-in 0.5s ease both",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        "count-pop": "count-pop 0.45s cubic-bezier(0.21,0.6,0.35,1) both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
