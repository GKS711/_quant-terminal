import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { MARKETS, type Market } from "@/lib/portfolio";
import { allStockRoutes, routeToStock } from "@/lib/stock-routes";

// SSG: 12 條固定路由，build 時靜態產生
export function generateStaticParams() {
  return allStockRoutes();
}

export const dynamicParams = false;
export const revalidate = 60;

const GOLD = "#F5A623";
const PINK = "#FF4D6D";

interface Props {
  params: { market: string; slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) return { title: "Not Found" };
  return {
    title: `${stock.shortCode} ${stock.name} · 每日股市儀表板`,
    description: `${stock.name} (${stock.shortCode}) 個股 AI 量化分析 · v2.0 詳情頁開發中`,
  };
}

export default function StockDetailPage({ params }: Props) {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) notFound();
  const market = MARKETS[stock.market as Market];

  return (
    <div className="min-h-screen" style={{ background: "#0B1426" }}>
      <Nav />
      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] mb-8"
          style={{ color: "#A9B3C4" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          回首頁
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[32px]">{market?.flag}</span>
          <h1
            className="text-[36px] sm:text-[44px] tracking-[-0.03em]"
            style={{ color: "#F4F6FA", fontWeight: 590 }}
          >
            {stock.shortCode}
            <span className="ml-3 text-[20px]" style={{ color: "#A9B3C4", fontWeight: 400 }}>
              {stock.name}
            </span>
          </h1>
        </div>

        {/* v2 placeholder */}
        <div
          className="rounded-2xl p-8 max-w-[680px]"
          style={{
            background: "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(11,20,38,0.5) 100%)",
            border: "1px solid rgba(245,166,35,0.20)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
            <span
              className="text-[10px] font-mono uppercase tracking-[0.2em]"
              style={{ color: GOLD, fontWeight: 590 }}
            >
              v2.0 個股詳情頁 · 開發中
            </span>
          </div>
          <p className="text-[15px] leading-relaxed" style={{ color: "#D6DCE6" }}>
            v2.0 重做中。下一階段會加：
          </p>
          <ul className="mt-3 space-y-1.5 text-[14px]" style={{ color: "#A9B3C4" }}>
            <li>· 即時報價 + 30 / 90 / 365 天 K 線</li>
            <li>· 11 種策略訊號（含命中率 + 公開計算公式）</li>
            <li>· AI 共識決策（Gemma 4 31B + bull/bear 等量呈現）</li>
            <li>· 相關標的 + 與大盤對照（SPY / QQQ / ^TWII alpha）</li>
            <li>· 「重抓最新」即時刷新</li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-[13px]"
            style={{
              background: GOLD,
              color: "#0B1426",
              fontWeight: 590,
              boxShadow: `0 8px 24px -8px ${GOLD}88`,
            }}
          >
            回首頁看 Market Pulse →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
