/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Big Shoulders Display'", "ui-sans-serif", "sans-serif"],
        sans: ["'IBM Plex Sans'", "ui-sans-serif", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--ink) / <alpha-value>)",
        card: "rgb(var(--surface) / <alpha-value>)",
        border: "rgb(var(--line) / <alpha-value>)",
        muted: "rgb(var(--surface) / <alpha-value>)",
        "muted-foreground": "rgb(var(--ink-muted) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          dark: "rgb(var(--primary-dark) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        success: "rgb(var(--accent) / <alpha-value>)",
        warning: "#c9822a",
        whatsapp: "#25d366",
        destructive: "rgb(var(--danger) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--ink) / 0.04), 0 12px 28px -18px rgb(var(--ink) / 0.22)",
        stamp: "0 0 0 1px rgb(var(--primary) / 0.18)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-dark)) 100%)",
        "gradient-steel": "linear-gradient(160deg, rgb(var(--bg)) 0%, rgb(var(--surface)) 100%)",
        "gradient-hero":
          "linear-gradient(0deg, rgb(var(--bg)) 2%, rgb(var(--ink) / 0.65) 45%, rgb(var(--ink) / 0.25) 100%)",
        "hazard-stripes":
          "repeating-linear-gradient(-45deg, rgb(var(--primary)) 0 14px, rgb(var(--ink)) 14px 28px)",
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
