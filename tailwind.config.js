/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'IBM Plex Mono'", "monospace"],
      },
      colors: {
        base: {
          950: "#06070a",
          900: "#0a0d13",
          850: "#0e121a",
          800: "#121722",
          700: "#1a212e",
          600: "#252e3f",
          500: "#3a4456",
        },
        cyan: {
          glow: "#3ee8d8",
        },
        thermal: {
          cool: "#378ade",
          coolDeep: "#185fa5",
          mod: "#ef9f27",
          modDeep: "#ba7517",
          hot: "#e24b4a",
          hotDeep: "#a32d2d",
        },
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(62,232,216,0.25)",
      },
      animation: {
        scan: "scan 4s linear infinite",
        pulseSlow: "pulseSlow 2.4s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
      },
    },
  },
  plugins: [],
};
