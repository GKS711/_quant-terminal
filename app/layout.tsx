import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "每日股市儀表板 — 全球多市場量化分析儀表板 / GKS",
  description:
    "由 GKS 自行設計實作的多市場 AI 量化分析儀表板：12 檔精選 × 4 國市場 × 11 種策略 × Gemma 4 31B 即時推論。後端開源於 github.com/GKS711/_quant-terminal。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-stock-advisor.gks.dev",
  ),
  openGraph: {
    title: "每日股市儀表板 — 全球多市場量化分析儀表板",
    description: "12 檔精選 × 4 市場 × 11 策略 × Gemma 4 31B 即時推論",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen antialiased" style={{ background: "#000000", color: "#FFFFFF" }}>
        {children}
      </body>
    </html>
  );
}
