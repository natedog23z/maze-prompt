import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgb(var(--border-color-val) / <alpha-value>)",
        "border-color": "rgb(var(--border-color-val) / <alpha-value>)",
        "bg-primary": "rgb(var(--bg-primary-val) / <alpha-value>)",
        "bg-secondary": "rgb(var(--bg-secondary-val) / <alpha-value>)",
        "bg-tertiary": "rgb(var(--bg-tertiary-val) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary-val) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary-val) / <alpha-value>)",
        "accent-primary": "rgb(var(--accent-primary-val) / <alpha-value>)",
        "accent-hover": "rgb(var(--accent-hover-val) / <alpha-value>)",
        "accent-gradient-end": "rgb(var(--accent-gradient-end-val) / <alpha-value>)",
        "status-success": "rgb(var(--status-success-val) / <alpha-value>)",
        "status-warning": "rgb(var(--status-warning-val) / <alpha-value>)",
        "status-error": "rgb(var(--status-error-val) / <alpha-value>)",
        background: "rgb(var(--bg-primary-val) / <alpha-value>)",
        foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--accent-primary-val) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--bg-tertiary-val) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--status-error-val) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--bg-tertiary-val) / <alpha-value>)",
          foreground: "rgb(var(--text-secondary-val) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-primary-val) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--bg-secondary-val) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--bg-secondary-val) / <alpha-value>)",
          foreground: "rgb(var(--text-primary-val) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config 