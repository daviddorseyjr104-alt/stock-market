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
        // Brand: electric capital green/teal + deep violet accent
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
        // Premium tiers (additive)
        "glow-lg":
          "0 0 0 1px rgba(57,245,172,0.22), 0 12px 60px -10px rgba(57,245,172,0.5), 0 8px 80px -16px rgba(124,92,255,0.3)",
        "glow-soft":
          "0 0 32px -8px rgba(57,245,172,0.22), 0 0 64px -16px rgba(124,92,255,0.18)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "capital-gradient":
          "linear-gradient(135deg, #39f5ac 0%, #10e29a 35%, #7c5cff 100%)",
        "radial-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(57,245,172,0.16) 0%, rgba(57,245,172,0) 70%)",
        // Premium backdrops (additive)
        aurora:
          "radial-gradient(50% 40% at 15% 0%, rgba(57,245,172,0.12), transparent 60%), radial-gradient(45% 45% at 100% 10%, rgba(124,92,255,0.14), transparent 60%), radial-gradient(38% 34% at 75% 90%, rgba(57,245,172,0.06), transparent 65%)",
        mesh:
          "radial-gradient(40% 40% at 20% 20%, rgba(57,245,172,0.10), transparent 60%), radial-gradient(40% 40% at 80% 30%, rgba(124,92,255,0.12), transparent 60%), radial-gradient(50% 50% at 50% 100%, rgba(16,226,154,0.05), transparent 65%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
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
        // Premium motion (additive)
        aurora: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2.5%,-1.5%,0) scale(1.04)" },
          "100%": { transform: "translate3d(-2%,1.5%,0) scale(1.02)" },
        },
        sheen: {
          "0%": { transform: "translateX(-160%) skewX(-18deg)" },
          "100%": { transform: "translateX(240%) skewX(-18deg)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.035)", opacity: "1" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(-0.6deg)" },
          "50%": { transform: "rotate(0.6deg)" },
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
        // Premium motion (additive)
        aurora: "aurora 36s ease-in-out infinite alternate",
        sheen: "sheen 0.9s cubic-bezier(0.4,0,0.2,1)",
        breathe: "breathe 7s ease-in-out infinite",
        tilt: "tilt 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
