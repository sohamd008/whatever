/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        primary: "#F7931A",
        secondary: "#EA580C",
        tertiary: "#FFD600",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        spinSlow: "spin 10s linear infinite",
        spinSlowReverse: "spin 15s linear infinite reverse",
        bounceSlow: "bounce 3s infinite",
        bounceSlower: "bounce 4s infinite",
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "orange-glow": "0 0 20px -5px rgba(234,88,12,0.5)",
        "orange-glow-hover": "0 0 30px -5px rgba(247,147,26,0.6)",
        "gold-glow": "0 0 20px rgba(255,214,0,0.3)",
        "elevation": "0 0 50px -10px rgba(247,147,26,0.1)",
      },
    },
  },
  plugins: [],
}