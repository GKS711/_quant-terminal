import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 每日股市儀表板 palette
        ink: {
          DEFAULT: "#0A0A0A",   // primary background
          50:  "#F6F6F6",       // off-white surface
          100: "#E8E8E8",
          200: "#C9C9C9",
          300: "#9A9A9A",       // secondary text on dark
          400: "#6B6B6B",
          500: "#414141",       // tertiary
          600: "#2A2A2A",
          700: "#1C1C1C",       // soft surface
          800: "#141414",       // card surface
          900: "#0A0A0A",       // page background
          950: "#050505",
        },
        mint: {
          DEFAULT: "#4EAA85",
          50:  "#E5F4ED",
          100: "#CCEADC",
          200: "#9CD5BA",
          300: "#6FC298",
          400: "#4EAA85",       // primary accent
          500: "#3F8E6E",
          600: "#2E5845",       // deep accent
          700: "#244537",
          800: "#1B3429",
          900: "#11221B",
        },
        danger: { DEFAULT: "#E5484D", soft: "#3A1B1D" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.025em",
        tight:    "-0.015em",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card:        "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.6)",
        "card-hover":"0 1px 0 0 rgba(255,255,255,0.08) inset, 0 40px 80px -30px rgba(78,170,133,0.18)",
        glow:        "0 0 0 1px rgba(78,170,133,0.25), 0 20px 60px -20px rgba(78,170,133,0.45)",
      },
      animation: {
        "marquee":   "marquee 60s linear infinite",
        "fade-up":   "fadeUp 0.6s cubic-bezier(0.21, 0.61, 0.35, 1) both",
        "pulse-soft":"pulseSoft 2.4s ease-in-out infinite",
        "glow":      "glow 3s ease-in-out infinite",
      },
      keyframes: {
        marquee:  { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fadeUp:   { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft:{ "0%,100%": { opacity: "1" }, "50%": { opacity: "0.55" } },
        glow:     { "0%,100%": { boxShadow: "0 0 0 1px rgba(78,170,133,0.20)" }, "50%": { boxShadow: "0 0 0 1px rgba(78,170,133,0.55), 0 0 30px rgba(78,170,133,0.25)" } },
      },
      backgroundImage: {
        "grid-fade":      "radial-gradient(ellipse at top, rgba(78,170,133,0.10), transparent 60%)",
        "noise":          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [],
};

export default config;
