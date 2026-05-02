import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { MARKETS, type Market } from "@/lib/portfolio";
import { EXTENDED_UNIVERSE, EXTENDED_TOTAL } from "@/lib/extended-universe";

export const metadata: Metadata = {
  title: "標的池 · 50 檔擴充宇宙 — 每日股市儀表板",
  description: `每日股市儀表板可擴充涵蓋的 ${EXTENDED_TOTAL} 檔多市場標的清單。後端 _quant-terminal 修改 STOCK_LIST 即可加入。`,
};

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";

const FEATURED_SHORT = new Set(["2330", "2454", "2317", "0050", "AAPL", "NVDA", "TSLA", "MSFT", "0700", "9988", "600519", "000858"]);

export default function MarketsPage() {
  // group by market
  const byMarket = (Object.keys(MARKETS) as Market[]).map((m) => ({
    market: MARKETS[m],
    stocks: EXTENDED_UNIVERSE.filter((s) => s.market === m).sort((a, b) => b.marketCap - a.marketCap),
  }));

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20" style={{ background: "#08090a", minHeight: "100vh" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#62666d] hover:text-[#a8a8b3] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> 回首頁
          </Link>

          <header className="mt-6">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
              <Sparkles className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
              <span>Extended Universe · {EXTENDED_TOTAL} stocks</span>
            </div>
            <h1
              className="text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.04em] text-white max-w-[760px]"
              style={{ fontWeight: 510 }}
            >
              標的池 ·{" "}
              <span style={{ color: MINT_BRIGHT }} className="italic font-normal">
                {EXTENDED_TOTAL} 檔擴充
              </span>
            </h1>
            <p className="mt-3 text-[14px] max-w-[640px]" style={{ color: "#a8a8b3" }}>
              首頁 12 檔是「重點分析」（含完整 AI 決策 + 11 策略 + sparkline）；本頁列 {EXTENDED_TOTAL} 檔擴充宇宙，後端 _quant-terminal 修 <code className="font-mono text-[#d0d6e0]">STOCK_LIST</code> 即可加入分析範圍。
              <br />
              <span className="text-[11px] text-[#62666d]">
                為什麼不直接展示 500 檔：Yahoo Finance 對單 IP 限流嚴格（12 檔 build 已用 1 分鐘）；500 檔需付費 API（FMP / Twelve Data Pro）。
              </span>
            </p>
          </header>

          {/* 4 markets */}
          <div className="mt-12 space-y-12">
            {byMarket.map((g) => (
              <section key={g.market.code}>
                <h2 className="flex items-center gap-2 text-[20px] mb-4" style={{ color: "#f7f8f8", fontWeight: 590 }}>
                  <span className="text-[26px]">{g.market.flag}</span>
                  <span>{g.market.nameZh}</span>
                  <span className="text-[12px] font-mono uppercase tracking-wider text-[#62666d] ml-2">
                    {g.market.exchange} · {g.stocks.length} 檔
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {g.stocks.map((s) => {
                    const isFeatured = FEATURED_SHORT.has(s.shortCode);
                    return (
                      <div
                        key={s.symbol}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span className="font-mono text-[12px] flex-shrink-0 w-16" style={{ color: "#d0d6e0", fontWeight: 590 }}>
                          {s.shortCode}
                        </span>
                        <span className="text-[12.5px] truncate flex-1" style={{ color: "#e5e7eb" }}>
                          {s.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#62666d] flex-shrink-0">{s.sector}</span>
                        {isFeatured ? (
                          <Link
                            href={`/${s.market.toLowerCase()}/${s.shortCode.toLowerCase()}`}
                            className="text-[10px] font-mono inline-flex items-center gap-0.5 flex-shrink-0"
                            style={{ color: MINT_BRIGHT }}
                          >
                            詳情 <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        ) : (
                          <span className="text-[9px] font-mono text-[#62666d] flex-shrink-0">擴充</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-2">為什麼是 50 而不是 500？</div>
            <ul className="space-y-1.5 text-[13px] text-[#a8a8b3] leading-relaxed">
              <li>• <span className="text-[#d0d6e0]">資料源限制</span>：Yahoo Finance v8 對單 IP 嚴格限流，12 檔序列抓需 1 分鐘；500 檔 ≈ 40+ 分鐘且容易被 ban</li>
              <li>• <span className="text-[#d0d6e0]">LLM 成本</span>：每檔 Gemma 4 31B 決策 ≈ 600 tokens，500 檔每日 1 次 ≈ 30 萬 tokens（免費層 quota 邊緣）</li>
              <li>• <span className="text-[#d0d6e0]">展示焦點</span>：作品集網站重點是「12 檔深度分析」而非「廣度的 ticker list」</li>
              <li>• <span className="text-[#d0d6e0]">怎麼 scale 到 500</span>：付費 API（FMP $14/月、Twelve Data $30/月）+ 後端排程分批執行 + Redis 快取</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
