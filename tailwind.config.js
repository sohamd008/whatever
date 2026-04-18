/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{astro,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030304",
        surface: "#0F1115",
        foreground: "#FFFFFF",
        muted: "#CBD5E1",
        border: "#1E293B",
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
        shimmer: "shimmer 3s ease-in-out infinite",
        glowPulse: "glowPulse 6s ease-in-out infinite",
        gradient: "gradient 6s ease infinite",
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
        shimmer: {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.06" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.1)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      boxShadow: {
        "orange-glow": "0 0 20px -5px rgba(234,88,12,0.5)",
        "orange-glow-hover": "0 0 30px -5px rgba(247,147,26,0.6)",
        "gold-glow": "0 0 20px rgba(255,214,0,0.3)",
        "elevation": "0 0 50px -10px rgba(247,147,26,0.1)",
        "glass": "0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-lg": "0 8px 40px rgba(0,0,0,0.4), 0 0 80px -20px rgba(247,147,26,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-hover": "0 8px 40px rgba(0,0,0,0.5), 0 0 60px -10px rgba(247,147,26,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}
