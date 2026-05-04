import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { MARKETS, type Market } from "@/lib/portfolio";
import { allStockRoutes, routeToStock } from "@/lib/stock-routes";

export function generateStaticParams() {
  return allStockRoutes();
}

export const dynamicParams = false;
export const revalidate = 60;

interface Props {
  params: { market: string; slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) return { title: "Not Found" };
  return {
    title: `${stock.shortCode} ${stock.name} · 每日股市儀表板`,
    description: `${stock.name} (${stock.shortCode}) 個股 AI 量化分析`,
  };
}

export default function StockDetailPage({ params }: Props) {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) notFound();
  const market = MARKETS[stock.market as Market];

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <Nav />
      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] mb-10"
          style={{ color: "#767676", fontWeight: 500 }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          回首頁
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[44px]">{market?.flag}</span>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 600,
              color: "#000",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            {stock.shortCode}
          </h1>
          <span style={{ color: "#3A3A3A", fontSize: "20px", fontWeight: 500 }}>
            {stock.name}
          </span>
        </div>

        <div
          className="rounded-3xl p-10 max-w-[720px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,110,64,0.08) 0%, rgba(0,102,255,0.06) 100%)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="text-[11px] uppercase mb-3"
            style={{ color: "#FF6E40", letterSpacing: "0.2em", fontWeight: 700 }}
          >
            v3.0 · 個股詳情頁
          </div>
          <p style={{ fontSize: "16px", color: "#3A3A3A", lineHeight: 1.6 }}>
            完整個股 deep-dive 開發中：即時報價 K 線、11 策略命中率、AI 共識（Gemma 4 31B + bull/bear 等量）、相關標的、大盤對照、即時刷新。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full text-[14px]"
            style={{ background: "#000", color: "#FFF", fontWeight: 600 }}
          >
            回首頁 →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
