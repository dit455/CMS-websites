import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0F766E", light: "#14B8A6", dark: "#064E3B" },
        secondary: "#14B8A6",
        accent: "#10B981",
        info: "#06B6D4",
        warning: "#F59E0B",
        danger: "#EF4444",
        copper: { DEFAULT: "#F59E0B", hover: "#B45309", light: "#FEF3C7" },
        surface: "#F0FDFA",
        cat: {
          a: "#7C3AED",
          b: "#DC2626",
          c: "#059669",
          d: "#0369A1",
          e: "#92400E",
          f: "#065F46",
          g: "#047857",
          h: "#1D4ED8",
          i: "#6B21A8",
          j: "#C2410C",
          k: "#374151"
        },
        govblue: "#0F766E",
        govgreen: "#10B981",
        govorange: "#F59E0B",
        ink: "#0F172A",
        mist: "#F8FAFC"
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Tamil", "system-ui", "sans-serif"]
      },
      borderRadius: {
        card: "20px",
        badge: "999px",
        btn: "16px"
      },
      boxShadow: {
        soft: "0 16px 42px rgba(15, 23, 42, 0.08)",
        emerald: "0 20px 40px rgba(15, 118, 110, 0.15)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 26s linear infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
