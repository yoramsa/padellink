import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#060B1E",
          800: "#0A1330",
          700: "#0E1A40"
        },
        brand: {
          israel: "#0038B8",
          DEFAULT: "#1E5BD6",
          light: "#5C9CFF",
          glow: "#7FB4FF",
          soft: "#A9CEFF"
        },
        ink: {
          white: "#F7FAFF",
          gray: "#9DB0D0"
        },
        gold: "#E0BC45"
      },
      fontFamily: {
        heebo: ["var(--font-heebo)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(92,156,255,0.35)",
        "glow-strong": "0 0 60px rgba(127,180,255,0.55)",
        card: "0 18px 50px rgba(3,8,25,0.6)"
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.96)" },
          "12%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "80%": { opacity: "1", transform: "translateY(-46px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-92px) scale(0.96)" }
        },
        pulseGlow: {
          "0%": { opacity: "0.55" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.55" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        floatUp: "floatUp 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 3.5s ease-in-out infinite",
        fadeUp: "fadeUp 0.7s ease forwards"
      }
    }
  },
  plugins: []
};

export default config;
