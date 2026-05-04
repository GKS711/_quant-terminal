"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { EXTENDED_UNIVERSE, EXTENDED_TOTAL, type ExtendedStock } from "@/lib/extended-universe";
import { MARKETS, type Market } from "@/lib/portfolio";

const SERIF = '"Iowan Old Style", "Palatino", "Georgia", serif';
const INK = "#211922";
const BULL = "#3E7A52";
const BEAR = "#A23E3E";

function mockChange(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) | 0;
  return (h % 1000) / 100 - 5;
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
    if (sortBy === "change") list = [...list].sort((a, b) => mockChange(b.symbol) - mockChange(a.symbol));
    else if (sortBy === "name") list = [...list].sort((a, b) => a.shortCode.localeCompare(b.shortCode));
    else list = [...list].sort((a, b) => b.marketCap - a.marketCap);
    return list;
  }, [marketFilter, search, sortBy]);

  const markets: Array<Market | "ALL"> = ["ALL", "TW", "US", "HK", "CN", "JP"];

  return (
    <section
      id="scanner"
      className="py-20"
      style={{ background: "#FAF9F6", borderTop: "1px solid rgba(33,25,34,0.08)" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        <div
          className="text-[10px] uppercase tracking-[0.2em] mb-3"
          style={{ color: "#91918C", fontWeight: 590 }}
        >
          Markets · 市場一覽
        </div>
        <h2
          className="text-[36px] sm:text-[44px] max-w-[760px] mb-3"
          style={{
            fontFamily: SERIF,
            color: INK,
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
          }}
        >
          {EXTENDED_TOTAL} 檔，<span style={{ fontStyle: "italic" }}>一頁讀完</span>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-[640px] mb-10" style={{ color: "#62625B" }}>
          🇹🇼 台股 20 / 🇺🇸 美股 40 / 🇭🇰 港股 15 / 🇨🇳 A 股 15 / 🇯🇵 日股 10。
          按市場、產業、漲跌排序。
        </p>

        {/* Filters */}
        <div
          className="flex flex-wrap items-center gap-2 mb-6 pb-6"
          style={{ borderBottom: "1px solid rgba(33,25,34,0.08)" }}
        >
          {markets.map((m) => {
            const active = marketFilter === m;
            const label = m === "ALL" ? "全部" : MARKETS[m]?.flag + " " + MARKETS[m]?.nameZh;
            const count = m === "ALL" ? EXTENDED_TOTAL : EXTENDED_UNIVERSE.filter((s) => s.market === m).length;
            return (
              <button
                key={m}
                onClick={() => setMarketFilter(m)}
                className="px-3.5 py-1.5 rounded-full text-[12px] transition-colors"
                style={{
                  background: active ? INK : "transparent",
                  color: active ? "#FAF9F6" : "#62625B",
                  border: active ? "none" : "1px solid rgba(33,25,34,0.12)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}

          <span style={{ color: "#A39E98" }} className="mx-1 text-[13px]">·</span>

          {(["change", "name", "cap"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="px-3 py-1.5 text-[12px]"
              style={{
                color: sortBy === s ? INK : "#91918C",
                fontWeight: sortBy === s ? 500 : 400,
                fontFamily: sortBy === s ? SERIF : undefined,
                fontStyle: sortBy === s ? "italic" : "normal",
              }}
            >
              {s === "change" ? "漲跌" : s === "name" ? "代號" : "市值"}
            </button>
          ))}

          <div
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
            style={{
              border: "1px solid rgba(33,25,34,0.12)",
              minWidth: 220,
            }}
          >
            <Search className="h-3 w-3" style={{ color: "#91918C" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋代號 / 名稱 / 產業…"
              className="flex-1 bg-transparent outline-none"
              style={{ color: INK }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "#91918C" }}>×</button>
            )}
          </div>
        </div>

        <div className="text-[11px] mb-4" style={{ color: "#A39E98" }}>
          顯示 {filtered.length} / {EXTENDED_TOTAL} 檔
        </div>

        {/* Editorial grid — magazine column layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px" style={{ background: "rgba(33,25,34,0.06)" }}>
          {filtered.map((s) => (
            <StockTile key={s.symbol} stock={s} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[14px]" style={{ color: "#91918C", fontFamily: SERIF, fontStyle: "italic" }}>
            沒有匹配的標的。
          </div>
        )}
      </div>
    </section>
  );
}

function StockTile({ stock }: { stock: ExtendedStock }) {
  const change = mockChange(stock.symbol);
  const positive = change >= 0;
  const market = MARKETS[stock.market];
  return (
    <button
      className="text-left p-3.5 transition-colors"
      style={{
        background: "#FAF9F6",
      }}
    >
      <div className="flex items-baseline justify-between gap-1 mb-1.5">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-[13px]">{market?.flag}</span>
          <span
            className="text-[13px] font-mono tabular-nums truncate"
            style={{ color: INK, fontWeight: 500 }}
          >
            {stock.shortCode}
          </span>
        </div>
        <span
          className="text-[12px] font-mono tabular-nums flex-shrink-0"
          style={{ color: positive ? BULL : BEAR, fontWeight: 500 }}
        >
          {positive ? "+" : ""}{change.toFixed(2)}%
        </span>
      </div>
      <div className="text-[11px] truncate mb-1" style={{ color: "#62625B", fontFamily: SERIF }}>
        {stock.name}
      </div>
      <div className="text-[9px] uppercase tracking-[0.1em]" style={{ color: "#A39E98" }}>
        {stock.sector}
      </div>
    </button>
  );
}
