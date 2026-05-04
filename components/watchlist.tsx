"use client";

import { useState, useEffect } from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import { EXTENDED_UNIVERSE } from "@/lib/extended-universe";
import { MARKETS } from "@/lib/portfolio";

const AMBER = "#FF6B00";
const BULL = "#3F8500";
const BEAR = "#E5484D";

const STORAGE_KEY = "quant_terminal_watchlist_v2";
const DEFAULT_LIST = ["2330.TW", "NVDA", "TSLA", "0700.HK"];

interface FreshQuote {
  price: number;
  change30dPct: number;
  signal?: string;
}

export function Watchlist() {
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_LIST);
  const [adding, setAdding] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [freshQuotes, setFreshQuotes] = useState<Record<string, FreshQuote>>({});
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) setSymbols(arr);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols)); } catch {}
  }, [symbols, mounted]);

  function addSymbol(sym: string) {
    if (symbols.includes(sym)) return;
    setSymbols([...symbols, sym]);
    setAdding(false);
    setPickerQuery("");
  }
  function removeSymbol(sym: string) {
    setSymbols(symbols.filter((s) => s !== sym));
    setFreshQuotes((q) => { const c = { ...q }; delete c[sym]; return c; });
  }
  async function refresh(sym: string) {
    setRefreshing(sym);
    try {
      const r = await fetch("/api/refresh-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: sym }),
      });
      const j = await r.json();
      if (j.ok && j.quote) {
        setFreshQuotes((q) => ({ ...q, [sym]: { price: j.quote.price, change30dPct: j.quote.change30dPct, signal: j.decision?.signal } }));
      }
    } catch {}
    setRefreshing(null);
  }

  const pickerResults = pickerQuery.trim()
    ? EXTENDED_UNIVERSE.filter((s) => {
        const q = pickerQuery.toLowerCase();
        return !symbols.includes(s.symbol) && (s.symbol.toLowerCase().includes(q) || s.shortCode.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q));
      }).slice(0, 8)
    : [];

  return (
    <section
      id="watchlist"
      className="py-20"
      style={{ background: "#0A0A0A", borderBottom: "1px solid #27272A" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <div>
            <div
              className="text-[11px] uppercase mb-4"
              style={{ color: "#767D88", letterSpacing: "0.35px", fontWeight: 450 }}
            >
              ───  Watchlist  ·  我的追蹤  ───
            </div>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 500,
                color: "#FFFFFF",
                lineHeight: 1.0,
                letterSpacing: "-1px",
              }}
            >
              <span style={{ color: AMBER }}>持續</span>追蹤
            </h2>
            <p className="mt-3 text-[12px] uppercase font-mono" style={{ color: "#767D88", letterSpacing: "0.35px" }}>
              localStorage  ·  {symbols.length} positions
            </p>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] uppercase transition-colors"
            style={{
              background: adding ? "transparent" : AMBER,
              color: adding ? "#C9CCD1" : "#000000",
              border: adding ? "1px solid #27272A" : "none",
              fontWeight: 600,
              letterSpacing: "0.18em",
              borderRadius: "4px",
            }}
          >
            {adding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {adding ? "Cancel" : "Add"}
          </button>
        </div>

        {adding && (
          <div
            className="mb-6 p-4"
            style={{ background: "#000000", border: `1px solid ${AMBER}`, borderRadius: "4px" }}
          >
            <input
              type="text"
              autoFocus
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="search ticker / 名稱 / 產業"
              className="w-full bg-transparent outline-none text-[14px] font-mono"
              style={{ color: "#FFFFFF", letterSpacing: "-0.16px" }}
            />
            {pickerResults.length > 0 && (
              <div className="mt-3 space-y-1">
                {pickerResults.map((s) => {
                  const m = MARKETS[s.market];
                  return (
                    <button
                      key={s.symbol}
                      onClick={() => addSymbol(s.symbol)}
                      className="w-full flex items-baseline justify-between gap-2 px-3 py-2 text-left text-[12px] transition-colors"
                      style={{ background: "transparent", color: "#FFFFFF" }}
                    >
                      <span className="flex items-baseline gap-2 min-w-0">
                        <span>{m?.flag}</span>
                        <span className="font-mono" style={{ fontWeight: 500 }}>{s.shortCode}</span>
                        <span style={{ color: "#C9CCD1" }} className="truncate">{s.name}</span>
                      </span>
                      <span
                        className="text-[10px] uppercase font-mono"
                        style={{ color: "#767D88", letterSpacing: "0.35px" }}
                      >
                        {s.sector}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: "#27272A" }}
        >
          {symbols.map((sym) => {
            const stock = EXTENDED_UNIVERSE.find((s) => s.symbol === sym);
            if (!stock) return null;
            const m = MARKETS[stock.market];
            const fresh = freshQuotes[sym];
            const positive = fresh ? fresh.change30dPct >= 0 : true;
            const isRefreshing = refreshing === sym;
            return (
              <article key={sym} className="p-6 relative" style={{ background: "#000000" }}>
                <button
                  onClick={() => removeSymbol(sym)}
                  className="absolute top-3 right-3 grid h-5 w-5 place-items-center text-[12px] transition-colors"
                  style={{ color: "#5E5E5E" }}
                  aria-label={`remove ${sym}`}
                >
                  ×
                </button>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[16px]">{m?.flag}</span>
                  <span
                    className="text-[14px] font-mono"
                    style={{ color: "#FFFFFF", fontWeight: 500, letterSpacing: "-0.16px" }}
                  >
                    {stock.shortCode}
                  </span>
                </div>
                <div
                  className="text-[20px] mb-1"
                  style={{ color: "#FFFFFF", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.4px" }}
                >
                  {stock.name}
                </div>
                <div
                  className="text-[10px] uppercase mb-4 font-mono"
                  style={{ color: "#767D88", letterSpacing: "0.35px" }}
                >
                  {stock.sector}
                </div>

                {fresh ? (
                  <>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span
                        className="text-[28px] font-mono tabular-nums"
                        style={{ color: "#FFFFFF", fontWeight: 500, letterSpacing: "-0.6px" }}
                      >
                        {fresh.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div
                      className="text-[12px] font-mono tabular-nums uppercase"
                      style={{ color: positive ? BULL : BEAR, fontWeight: 500, letterSpacing: "0.2px" }}
                    >
                      {positive ? "+" : ""}{fresh.change30dPct.toFixed(2)}%  ·  30D
                    </div>
                    {fresh.signal && (
                      <div
                        className="mt-2 text-[10px] uppercase font-mono"
                        style={{
                          color: fresh.signal === "buy" ? BULL : fresh.signal === "sell" ? BEAR : "#C9CCD1",
                          letterSpacing: "0.35px",
                          fontWeight: 600,
                        }}
                      >
                        AI · {fresh.signal}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="text-[11px] uppercase font-mono"
                    style={{ color: "#5E5E5E", letterSpacing: "0.35px" }}
                  >
                    click refresh to fetch live
                  </div>
                )}

                <button
                  onClick={() => refresh(sym)}
                  disabled={isRefreshing}
                  className="mt-5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] uppercase disabled:opacity-50 transition-colors"
                  style={{
                    background: "transparent",
                    color: AMBER,
                    border: `1px solid ${AMBER}`,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    borderRadius: "4px",
                  }}
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Loading…" : fresh ? "Refresh" : "Fetch Live"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
