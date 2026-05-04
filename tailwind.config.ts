import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ───────────────────────────────────────────
        // v2.0 配色 — 大膽當代（Webull / Toss / 韓系證券 app）
        // 沒有 mint green
        // ───────────────────────────────────────────

        // 深藍底（背景）
        navy: {
          DEFAULT: "#0B1426",   // primary background — 深藍黑
          50:  "#E8EBF1",
          100: "#C5CCD9",
          200: "#92A0BA",
          300: "#5C7299",
          400: "#3A5482",
          500: "#1F3A6B",       // accent navy
          600: "#152B52",
          700: "#0E1F3D",
          800: "#0B1426",       // page background
          900: "#070D1A",
          950: "#03070F",
        },

        // 金黃 — 機會 / 訊號 / CTA
        gold: {
          DEFAULT: "#F5A623",
          50:  "#FEF6E5",
          100: "#FCE8B8",
          200: "#FAD680",
          300: "#F8C04D",
          400: "#F5A623",       // primary accent
          500: "#D88A0A",
          600: "#A66A05",
          700: "#7A4E03",
          800: "#503400",
          900: "#2B1C00",
        },

        // 桃紅 — 異動 / 警示 / hot signal
        pink: {
          DEFAULT: "#FF4D6D",
          50:  "#FFE5EB",
          100: "#FFC5D0",
          200: "#FF95A8",
          300: "#FF6D85",
          400: "#FF4D6D",       // primary alert
          500: "#E5304F",
          600: "#B52138",
          700: "#891727",
          800: "#5C0F1A",
          900: "#33080F",
        },

        // 文字 / 灰階
        ink: {
          DEFAULT: "#F4F6FA",
          50:  "#FFFFFF",
          100: "#F4F6FA",       // primary text
          200: "#D6DCE6",
          300: "#A9B3C4",       // secondary text
          400: "#7A869A",
          500: "#566175",       // tertiary
          600: "#3E4A5E",
          700: "#2A3548",
          800: "#1A2235",
          900: "#0F1626",
        },

        // 漲跌 — 仍用紅綠對比但偏 muted（避開 AI 綠主導感）
        bull: { DEFAULT: "#26C281", soft: "#0D2A1F" },  // 漲（深一點的綠，不像 mint）
        bear: { DEFAULT: "#FF3B5C", soft: "#33121A" },  // 跌（暖紅，跟 pink alert 差別在飽和度）

        // 警示 / 中性
        warn: { DEFAULT: "#FFB627", soft: "#332300" },
        neutral: { DEFAULT: "#7A869A", soft: "#1A2235" },
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
        // v2 陰影 — 帶 navy / gold tint 不再 mint
        card:         "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.7)",
        "card-hover": "0 1px 0 0 rgba(245,166,35,0.10) inset, 0 40px 80px -30px rgba(245,166,35,0.20)",
        "card-alert": "0 1px 0 0 rgba(255,77,109,0.10) inset, 0 40px 80px -30px rgba(255,77,109,0.25)",
        glow:         "0 0 0 1px rgba(245,166,35,0.30), 0 20px 60px -20px rgba(245,166,35,0.45)",
        "glow-pink":  "0 0 0 1px rgba(255,77,109,0.30), 0 20px 60px -20px rgba(255,77,109,0.45)",
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
        glow:     { "0%,100%": { boxShadow: "0 0 0 1px rgba(245,166,35,0.20)" }, "50%": { boxShadow: "0 0 0 1px rgba(245,166,35,0.55), 0 0 30px rgba(245,166,35,0.25)" } },
      },
      backgroundImage: {
        "grid-fade":      "radial-gradient(ellipse at top, rgba(245,166,35,0.08), transparent 60%)",
        "navy-aurora":    "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(31,58,107,0.6) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 80% 20%, rgba(245,166,35,0.1) 0%, transparent 60%)",
        "noise":          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.03 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [],
};

export default config;
