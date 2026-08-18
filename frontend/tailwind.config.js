/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Oswald", "ui-sans-serif", "sans-serif"],
        sans: ["Barlow", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        background: "#ffffff",
        foreground: "#0f172a",
        card: "#f8fafc",
        border: "#e2e8f0",
        muted: "#f1f5f9",
        "muted-foreground": "#64748b",
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1e3a8a",
        },
        accent: "#0ea5e9",
        success: "#16a34a",
        warning: "#d97706",
        whatsapp: "#25d366",
        destructive: "#dc2626",
      },
      boxShadow: {
        card: "0 18px 40px -22px rgba(15,23,42,0.18)",
        glow: "0 0 0 1px rgba(37,99,235,0.25), 0 20px 50px -24px rgba(37,99,235,0.35)",
      },
      backgroundImage: {
        "gradient-red": "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
        "gradient-steel": "linear-gradient(160deg, #ffffff 0%, #f1f5f9 100%)",
        "gradient-hero":
          "linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.72) 55%, #ffffff 100%)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "none" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
