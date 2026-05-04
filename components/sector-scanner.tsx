"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { EXTENDED_UNIVERSE, EXTENDED_TOTAL, type ExtendedStock } from "@/lib/extended-universe";
import { MARKETS, type Market } from "@/lib/portfolio";

const GOLD = "#F5A623";
const PINK = "#FF4D6D";
const BULL = "#26C281";
const BEAR = "#FF3B5C";

// 簡單 deterministic mock change% — 之後接真資料
function mockChange(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) | 0;
  return ((h % 1000) / 100 - 5);
}

export function SectorScanner() {
  const [marketFilter, setMarketFilter] = useState<Market | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"change" | "name" | "cap">("change");

  const filtered = useMemo(() => {
    let list: ExtendedStock[] = EXTENDED_UNIVERSE;
    if (marketFilter !== "ALL") list = list.filter((s) => s.market === marketFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.shortCode.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q),
      );
    }
    if (sortBy === "change") {
      list = [...list].sort((a, b) => mockChange(b.symbol) - mockChange(a.symbol));
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.shortCode.localeCompare(b.shortCode));
    } else {
      list = [...list].sort((a, b) => b.marketCap - a.marketCap);
    }
    return list;
  }, [marketFilter, search, sortBy]);

  const markets: Array<Market | "ALL"> = ["ALL", "TW", "US", "HK", "CN", "JP"];

  return (
    <section
      id="scanner"
      className="border-t py-16"
      style={{ background: "#070D1A", borderColor: "rgba(245,166,35,0.10)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] mb-3"
          style={{ color: "#7A869A" }}
        >
          <Filter className="h-3 w-3" style={{ color: GOLD }} />
          <span>Sector Scanner · 全市場雷達</span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
            style={{
              background: "rgba(245,166,35,0.12)",
              color: GOLD,
              border: `1px solid ${GOLD}33`,
              fontWeight: 590,
            }}
          >
            {EXTENDED_TOTAL} 檔 · 5 國
          </span>
        </div>

        <h2
          className="text-[32px] sm:text-[44px] tracking-[-0.04em] max-w-[760px] mb-3"
          style={{ color: "#F4F6FA", fontWeight: 510 }}
        >
          {EXTENDED_TOTAL} 檔{" "}
          <span style={{ color: GOLD }} className="italic font-normal">
            一頁掃完
          </span>
        </h2>
        <p className="text-[14px] mb-6 max-w-[640px]" style={{ color: "#A9B3C4" }}>
          🇹🇼 台股 20 / 🇺🇸 美股 40 / 🇭🇰 港股 15 / 🇨🇳 A 股 15 / 🇯🇵 日股 10
          。可按市場篩選、排序、搜尋。
          <span className="ml-1 text-[12px]" style={{ color: "#566175" }}>
            點擊任一檔即時抓 Yahoo + Gemma 推論。
          </span>
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {/* Market chips */}
          {markets.map((m) => {
            const active = marketFilter === m;
            const label =
              m === "ALL" ? "全部" : MARKETS[m]?.flag + " " + MARKETS[m]?.nameZh;
            const count =
              m === "ALL"
                ? EXTENDED_TOTAL
                : EXTENDED_UNIVERSE.filter((s) => s.market === m).length;
            return (
              <button
                key={m}
                onClick={() => setMarketFilter(m)}
                className="px-3 py-1.5 rounded-full text-[12px] font-mono transition-colors"
                style={{
                  background: active ? `${GOLD}1f` : "rgba(244,246,250,0.04)",
                  color: active ? GOLD : "#A9B3C4",
                  border: `1px solid ${active ? `${GOLD}66` : "rgba(244,246,250,0.10)"}`,
                  fontWeight: active ? 590 : 510,
                }}
              >
                {label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}

          <span style={{ color: "#3E4A5E" }} className="mx-1">|</span>

          {/* Sort */}
          {(["change", "name", "cap"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="px-3 py-1.5 rounded-full text-[11px] font-mono"
              style={{
                background: sortBy === s ? "rgba(244,246,250,0.08)" : "transparent",
                color: sortBy === s ? "#F4F6FA" : "#7A869A",
                border: "1px solid rgba(244,246,250,0.10)",
              }}
            >
              {s === "change" ? "↕ 漲跌" : s === "name" ? "↕ 代號" : "↕ 市值"}
            </button>
          ))}

          {/* Search */}
          <div
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
            style={{
              background: "rgba(244,246,250,0.04)",
              border: "1px solid rgba(244,246,250,0.10)",
              minWidth: 200,
            }}
          >
            <Search className="h-3 w-3" style={{ color: "#7A869A" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋代號 / 名稱 / 產業…"
              className="flex-1 bg-transparent outline-none"
              style={{ color: "#F4F6FA" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "#7A869A" }}>
                ×
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono mb-3" style={{ color: "#566175" }}>
          顯示 {filtered.length} / {EXTENDED_TOTAL} 檔
        </div>

        {/* Grid 100 卡 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filtered.map((s, i) => (
            <StockTile key={s.symbol} stock={s} delay={Math.min(i * 0.012, 0.3)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-12 text-[13px]"
            style={{ color: "#566175" }}
          >
            沒有匹配的標的。試試改搜尋詞或切換市場。
          </div>
        )}
      </div>
    </section>
  );
}

function StockTile({ stock, delay }: { stock: ExtendedStock; delay: number }) {
  const change = mockChange(stock.symbol);
  const positive = change >= 0;
  const market = MARKETS[stock.market];
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="text-left rounded-lg p-3 transition-colors"
      style={{
        background: "rgba(244,246,250,0.025)",
        border: "1px solid rgba(244,246,250,0.06)",
      }}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[12px] flex-shrink-0">{market?.flag}</span>
          <span
            className="text-[12px] font-mono truncate"
            style={{ color: "#F4F6FA", fontWeight: 590 }}
          >
            {stock.shortCode}
          </span>
        </div>
        {positive ? (
          <TrendingUp className="h-3 w-3 flex-shrink-0" style={{ color: BULL }} />
        ) : (
          <TrendingDown className="h-3 w-3 flex-shrink-0" style={{ color: BEAR }} />
        )}
      </div>
      <div
        className="text-[10px] truncate mb-1.5"
        style={{ color: "#A9B3C4" }}
      >
        {stock.name}
      </div>
      <div className="flex items-center justify-between gap-1">
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(244,246,250,0.04)",
            color: "#7A869A",
          }}
        >
          {stock.sector}
        </span>
        <span
          className="text-[12px] font-mono tabular-nums"
          style={{ color: positive ? BULL : BEAR, fontWeight: 590 }}
        >
          {positive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    </motion.button>
  );
}
