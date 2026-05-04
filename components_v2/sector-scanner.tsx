"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { EXTENDED_UNIVERSE, EXTENDED_TOTAL, type ExtendedStock } from "@/lib/extended-universe";
import { MARKETS, type Market } from "@/lib/portfolio";

const AMBER = "#FF6B00";
const BULL = "#3F8500";
const BEAR = "#E5484D";

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
      className="py-24"
      style={{ background: "#000000", borderBottom: "1px solid #27272A" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          className="text-[11px] uppercase mb-6"
          style={{ color: "#767D88", letterSpacing: "0.35px", fontWeight: 450 }}
        >
          ───  Markets  ·  全市場雷達  ───
        </div>
        <h2
          className="mb-4"
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 500,
            color: "#FFFFFF",
            lineHeight: 1.0,
            letterSpacing: "-1px",
          }}
        >
          {EXTENDED_TOTAL} 檔  <span style={{ color: AMBER }}>一頁讀完</span>
        </h2>
        <p
          className="text-[16px] mb-12 max-w-[640px]"
          style={{ color: "#C9CCD1", letterSpacing: "-0.16px", lineHeight: 1.6 }}
        >
          🇹🇼 台股 20  ·  🇺🇸 美股 40  ·  🇭🇰 港股 15  ·  🇨🇳 A 股 15  ·  🇯🇵 日股 10。
          按市場、產業、漲跌排序。
        </p>

        {/* Filter bar — full width terminal style */}
        <div
          className="flex flex-wrap items-center gap-2 mb-8 pb-6"
          style={{ borderBottom: "1px solid #27272A" }}
        >
          {markets.map((m) => {
            const active = marketFilter === m;
            const label = m === "ALL" ? "ALL" : MARKETS[m]?.flag + " " + (MARKETS[m]?.code ?? m);
            const count = m === "ALL" ? EXTENDED_TOTAL : EXTENDED_UNIVERSE.filter((s) => s.market === m).length;
            return (
              <button
                key={m}
                onClick={() => setMarketFilter(m)}
                className="px-3 py-1.5 text-[11px] uppercase transition-colors"
                style={{
                  background: active ? AMBER : "transparent",
                  color: active ? "#000000" : "#C9CCD1",
                  border: active ? "none" : "1px solid #27272A",
                  fontWeight: active ? 600 : 500,
                  letterSpacing: "0.2px",
                  borderRadius: "4px",
                }}
              >
                {label} <span className="opacity-60 ml-1">{count}</span>
              </button>
            );
          })}

          <span style={{ color: "#5E5E5E" }} className="mx-2">|</span>

          {(["change", "name", "cap"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="text-[11px] uppercase px-2 py-1.5 transition-colors"
              style={{
                color: sortBy === s ? AMBER : "#767D88",
                fontWeight: sortBy === s ? 600 : 450,
                letterSpacing: "0.35px",
                borderBottom: sortBy === s ? `1px solid ${AMBER}` : "1px solid transparent",
              }}
            >
              {s === "change" ? "Δ%" : s === "name" ? "Name" : "Cap"}
            </button>
          ))}

          <div
            className="ml-auto flex items-center gap-2 px-3 py-1.5 text-[12px]"
            style={{
              border: "1px solid #27272A",
              minWidth: 240,
              borderRadius: "4px",
              background: "#0A0A0A",
            }}
          >
            <Search className="h-3 w-3" style={{ color: "#767D88" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search ticker / name / sector"
              className="flex-1 bg-transparent outline-none font-mono"
              style={{ color: "#FFFFFF", letterSpacing: "-0.16px" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "#767D88" }}>×</button>
            )}
          </div>
        </div>

        <div
          className="text-[10px] uppercase mb-4 font-mono"
          style={{ color: "#5E5E5E", letterSpacing: "0.35px" }}
        >
          showing {filtered.length} / {EXTENDED_TOTAL}
        </div>

        {/* Tight grid — 1px hairline separators */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px"
          style={{ background: "#27272A" }}
        >
          {filtered.map((s) => (
            <StockTile key={s.symbol} stock={s} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-12 text-[14px] uppercase"
            style={{ color: "#767D88", letterSpacing: "0.35px" }}
          >
            no results
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
      className="text-left p-4 transition-colors group"
      style={{ background: "#000000" }}
    >
      <div className="flex items-baseline justify-between gap-1 mb-2">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-[13px]">{market?.flag}</span>
          <span
            className="text-[14px] font-mono tabular-nums truncate"
            style={{ color: "#FFFFFF", fontWeight: 500, letterSpacing: "-0.16px" }}
          >
            {stock.shortCode}
          </span>
        </div>
        <span
          className="text-[13px] font-mono tabular-nums flex-shrink-0"
          style={{ color: positive ? BULL : BEAR, fontWeight: 500, letterSpacing: "-0.2px" }}
        >
          {positive ? "+" : ""}{change.toFixed(2)}
        </span>
      </div>
      <div className="text-[11px] truncate" style={{ color: "#C9CCD1" }}>
        {stock.name}
      </div>
      <div
        className="mt-1.5 text-[9px] uppercase font-mono"
        style={{ color: "#767D88", letterSpacing: "0.35px", fontWeight: 450 }}
      >
        {stock.sector}
      </div>
    </button>
  );
}
