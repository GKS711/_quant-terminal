import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Sparkline } from "@/components/sparkline";
import { KlineChart } from "@/components/kline-chart";
import { StrategySignalRow } from "@/components/strategy-signal-row";
import { RelatedStocks } from "@/components/related-stocks";

import { MARKETS, type Market, type Signal } from "@/lib/portfolio";
import { allStockRoutes, routeToStock, getRelated, buildStockUrl } from "@/lib/stock-routes";

// SSG: 12 個固定路由，build 時靜態產生
export function generateStaticParams() {
  return allStockRoutes();
}

// 已知 12 條外的不再嘗試動態渲染（404）
export const dynamicParams = false;
export const revalidate = 60; // ISR：60 秒

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

const SIGNAL_COLORS: Record<Signal, { fg: string; bg: string; bd: string; label: string }> = {
  buy:  { fg: BULL,      bg: "rgba(16,185,129,0.12)",  bd: "rgba(16,185,129,0.32)", label: "BUY"  },
  hold: { fg: "#a8a8a8", bg: "rgba(168,168,168,0.10)", bd: "rgba(168,168,168,0.24)", label: "HOLD" },
  sell: { fg: BEAR,      bg: "rgba(229,72,77,0.12)",   bd: "rgba(229,72,77,0.32)",  label: "SELL" },
};

interface PageProps {
  params: { market: string; slug: string };
}

// ─── SEO metadata（每頁不同）────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) return { title: "Not found" };

  const market = MARKETS[stock.market];
  const sigText = stock.decision.signal.toUpperCase();

  return {
    title: `${stock.shortCode} ${stock.name} · AI ${sigText} ${stock.decision.score}/100 — 每日股市儀表板`,
    description: `${market.flag} ${market.nameZh}・${stock.sector}：${stock.decision.rationale}`,
    openGraph: {
      title: `${stock.shortCode} ${stock.name} · ${sigText} ${stock.decision.score}/100`,
      description: stock.decision.rationale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${stock.shortCode} ${stock.name} · ${sigText} ${stock.decision.score}/100`,
      description: stock.decision.rationale,
    },
  };
}

export default function StockDetailPage({ params }: PageProps) {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) notFound();

  const market = MARKETS[stock.market];
  const sigStyle = SIGNAL_COLORS[stock.decision.signal];
  const SignalIcon =
    stock.decision.signal === "buy"  ? TrendingUp :
    stock.decision.signal === "sell" ? TrendingDown : Minus;
  const positive = stock.spark30d
    ? stock.spark30d[stock.spark30d.length - 1] >= stock.spark30d[0]
    : stock.decision.signal === "buy";
  const currencySymbol =
    market.currency === "USD" ? "$" :
    market.currency === "TWD" ? "NT$" :
    market.currency === "HKD" ? "HK$" : "¥";

  // 從 spark30d 推算最後一個 close 當作 demo 報價
  const lastPrice = stock.spark30d?.[stock.spark30d.length - 1] ?? 100;
  const firstPrice = stock.spark30d?.[0] ?? 100;
  const changePct = ((lastPrice - firstPrice) / firstPrice) * 100;

  const related = getRelated(stock, 4);

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20" style={{ background: "#08090a", minHeight: "100vh" }}>
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
          {/* Back link */}
          <Link
            href="/#decision"
            className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#62666d] hover:text-[#a8a8b3] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 全部 12 檔
          </Link>

          {/* Header */}
          <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[40px] leading-none">{market.flag}</span>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h1
                      className="text-[44px] sm:text-[56px] font-mono leading-[1.0] tracking-[-0.04em] text-white"
                      style={{ fontWeight: 590 }}
                    >
                      {stock.shortCode}
                    </h1>
                    <span className="text-[18px] text-[#a8a8b3]">{stock.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[12px] font-mono uppercase tracking-wider text-[#62666d]">
                    <span>{market.exchange}</span>
                    <span>·</span>
                    <span>{stock.sector}</span>
                    <span>·</span>
                    <span>{market.tradingHoursLocal}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: sigStyle.bg,
                  border: `1px solid ${sigStyle.bd}`,
                  color: sigStyle.fg,
                }}
              >
                <SignalIcon className="h-4 w-4" />
                <span className="text-[14px] font-mono uppercase tracking-wider" style={{ fontWeight: 590 }}>
                  {sigStyle.label} · {stock.decision.score}/100
                </span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d]">
                Gemma 4 31B Consensus
              </div>
            </div>
          </header>

          {/* Price + sparkline strip */}
          <div
            className="mt-8 rounded-2xl p-6 sm:p-8"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-end">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-2">
                  收盤
                </div>
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[44px] sm:text-[56px] tabular-nums leading-none"
                    style={{ fontWeight: 510, color: "#f7f8f8", letterSpacing: "-1px" }}
                  >
                    {currencySymbol}{lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className="text-[16px] font-mono tabular-nums"
                    style={{ color: positive ? BULL : BEAR }}
                  >
                    {positive ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2 text-[12px] font-mono text-[#62666d]">
                  30 天累積：{positive ? "+" : ""}{changePct.toFixed(2)}%
                </div>
              </div>
              <div className="-mx-2 sm:-mx-4">
                <Sparkline
                  data={stock.spark30d ?? [1, 1]}
                  width={680}
                  height={92}
                  strokeWidth={2}
                  color={positive ? BULL : BEAR}
                />
              </div>
            </div>
          </div>

          {/* K-Line + AI rationale 2-col */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            {/* K-Line */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-mono uppercase tracking-wider text-[#a8a8b3]">
                  K 線 · 30 天
                </h2>
                <span className="text-[10px] font-mono text-[#62666d]">
                  日線 · OHLC + MA5 + MA20
                </span>
              </div>
              <KlineChart closes={stock.spark30d ?? [1, 1]} height={300} />
            </div>

            {/* AI rationale + risks + checklist */}
            <div className="space-y-3">
              <div
                className="rounded-2xl p-5"
                style={{
                  background: sigStyle.bg,
                  border: `1px solid ${sigStyle.bd}`,
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: sigStyle.fg }}>
                  AI 共識決策
                </div>
                <p className="text-[14px] leading-[1.6] text-[#d0d6e0]">
                  {stock.decision.rationale}
                </p>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-2">
                  ⚠️ 風險檢核
                </div>
                <ul className="space-y-1.5">
                  {stock.decision.risks.map((r, i) => (
                    <li key={i} className="text-[13px] text-[#d0d6e0] flex gap-2">
                      <span style={{ color: BEAR }}>·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-2">
                  ✓ 行動清單
                </div>
                <ul className="space-y-1.5">
                  {stock.decision.catalysts.map((c, i) => (
                    <li key={i} className="text-[13px] text-[#d0d6e0] flex gap-2">
                      <span style={{ color: MINT_BRIGHT }}>→</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 11-strategy signal row */}
          <div className="mt-8">
            <h2 className="text-[14px] font-mono uppercase tracking-wider text-[#a8a8b3] mb-3">
              11 策略訊號分布
            </h2>
            <StrategySignalRow stock={stock} />
          </div>

          {/* Related */}
          <div className="mt-12">
            <h2 className="text-[14px] font-mono uppercase tracking-wider text-[#a8a8b3] mb-3">
              相似 / 相關標的
            </h2>
            <RelatedStocks stocks={related} />
          </div>

          {/* Source link */}
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              href={buildExternalQuoteUrl(stock)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] text-[#a8a8b3] hover:text-[#f7f8f8]"
              style={{ border: "1px solid rgba(255,255,255,0.10)" }}
            >
              {market.exchange} 詳細行情 <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/GKS711/daily_stock_analysis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px]"
              style={{
                background: `${MINT}1a`,
                color: MINT_BRIGHT,
                border: `1px solid ${MINT}40`,
              }}
            >
              <Github className="h-3 w-3" /> 後端原始碼
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function buildExternalQuoteUrl(stock: { market: Market; shortCode: string; symbol: string }): string {
  switch (stock.market) {
    case "TW": return `https://tw.stock.yahoo.com/quote/${stock.shortCode}`;
    case "US": return `https://finance.yahoo.com/quote/${stock.shortCode}`;
    case "HK": return `https://finance.yahoo.com/quote/${stock.symbol}`;
    case "CN": return `https://xueqiu.com/S/${stock.symbol.replace(".SS", "").replace(".SZ", "")}`;
    default:   return "#";
  }
}
