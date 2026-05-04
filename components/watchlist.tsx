"use client";

import { useState, useEffect } from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import { EXTENDED_UNIVERSE } from "@/lib/extended-universe";
import { MARKETS } from "@/lib/portfolio";

const SERIF = '"Iowan Old Style", "Palatino", "Georgia", serif';
const INK = "#211922";
const BULL = "#3E7A52";
const BEAR = "#A23E3E";

const STORAGE_KEY = "quant_terminal_watchlist_v2";
const DEFAULT_LIST = ["2330.TW", "NVDA", "TSLA", "0700.HK"];

interface FreshQuote {
  price: number;
  change30dPct: number;
  signal?: string;
  rationale?: string;
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
    } catch {}
  }, [symbols, mounted]);

  function addSymbol(sym: string) {
    if (symbols.includes(sym)) return;
    setSymbols([...symbols, sym]);
    setAdding(false);
    setPickerQuery("");
  }

  function removeSymbol(sym: string) {
    setSymbols(symbols.filter((s) => s !== sym));
    setFreshQuotes((q) => {
      const c = { ...q };
      delete c[sym];
      return c;
    });
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
        setFreshQuotes((q) => ({
          ...q,
          [sym]: {
            price: j.quote.price,
            change30dPct: j.quote.change30dPct,
            signal: j.decision?.signal,
            rationale: j.decision?.rationale,
          },
        }));
      }
    } catch {}
    setRefreshing(null);
  }

  const pickerResults = pickerQuery.trim()
    ? EXTENDED_UNIVERSE.filter((s) => {
        const q = pickerQuery.toLowerCase();
        return (
          !symbols.includes(s.symbol) &&
          (s.symbol.toLowerCase().includes(q) ||
            s.shortCode.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.sector.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : [];

  return (
    <section
      id="watchlist"
      className="py-16"
      style={{ background: "#F5F4EF", borderTop: "1px solid rgba(33,25,34,0.08)" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Bookmarked · 我的書籤
            </div>
            <h2
              className="text-[32px] sm:text-[40px]"
              style={{
                fontFamily: SERIF,
                color: INK,
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
              }}
            >
              <span style={{ fontStyle: "italic" }}>持續</span>追蹤的標的
            </h2>
            <p className="mt-2 text-[12px]" style={{ color: "#91918C" }}>
              localStorage 持久化 · 只在你瀏覽器裡 · {symbols.length} 檔
            </p>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] transition-colors"
            style={{
              background: adding ? "transparent" : INK,
              color: adding ? "#62625B" : "#FAF9F6",
              fontWeight: 500,
              border: adding ? "1px solid rgba(33,25,34,0.15)" : "none",
            }}
          >
            {adding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {adding ? "取消" : "加入標的"}
          </button>
        </div>

        {adding && (
          <div
            className="mb-6 rounded-2xl p-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(33,25,34,0.08)",
            }}
          >
            <input
              type="text"
              autoFocus
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="輸入代號 / 名稱 / 產業（例：NVDA / 台積 / 半導體）"
              className="w-full bg-transparent outline-none text-[14px]"
              style={{ color: INK }}
            />
            {pickerResults.length > 0 && (
              <div className="mt-3 space-y-1">
                {pickerResults.map((s) => {
                  const m = MARKETS[s.market];
                  return (
                    <button
                      key={s.symbol}
                      onClick={() => addSymbol(s.symbol)}
                      className="w-full flex items-baseline justify-between gap-2 px-2 py-1.5 text-left text-[13px] rounded transition-colors"
                      style={{ color: INK }}
                    >
                      <span className="flex items-baseline gap-2 min-w-0">
                        <span>{m?.flag}</span>
                        <span className="font-mono" style={{ fontWeight: 500 }}>{s.shortCode}</span>
                        <span style={{ color: "#62625B", fontFamily: SERIF }} className="truncate">{s.name}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#91918C" }}>{s.sector}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {pickerQuery && pickerResults.length === 0 && (
              <div className="mt-3 text-[12px]" style={{ color: "#91918C", fontFamily: SERIF, fontStyle: "italic" }}>
                沒找到匹配的標的（universe 共 {EXTENDED_UNIVERSE.length} 檔）
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {symbols.map((sym) => {
            const stock = EXTENDED_UNIVERSE.find((s) => s.symbol === sym);
            if (!stock) return null;
            const m = MARKETS[stock.market];
            const fresh = freshQuotes[sym];
            const positive = fresh ? fresh.change30dPct >= 0 : true;
            const isRefreshing = refreshing === sym;
            return (
              <article
                key={sym}
                className="rounded-2xl p-5 relative"
                style={{
                  background: "#FAF9F6",
                  border: "1px solid rgba(33,25,34,0.08)",
                }}
              >
                <button
                  onClick={() => removeSymbol(sym)}
                  className="absolute top-2.5 right-2.5 grid h-5 w-5 place-items-center text-[12px]"
                  style={{ color: "#A39E98" }}
                  aria-label={`移除 ${sym}`}
                >
                  ×
                </button>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[16px]">{m?.flag}</span>
                  <span className="text-[14px] font-mono" style={{ color: INK, fontWeight: 500 }}>
                    {stock.shortCode}
                  </span>
                </div>
                <div
                  className="text-[18px] mb-1.5"
                  style={{
                    fontFamily: SERIF,
                    color: INK,
                    fontWeight: 400,
                  }}
                >
                  {stock.name}
                </div>
                <div className="text-[10px] uppercase tracking-[0.1em] mb-3" style={{ color: "#91918C" }}>
                  {stock.sector}
                </div>

                {fresh ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className="text-[22px] font-mono tabular-nums"
                        style={{ color: INK, fontWeight: 500 }}
                      >
                        {fresh.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                      <span
                        className="text-[12px] font-mono tabular-nums"
                        style={{ color: positive ? BULL : BEAR, fontWeight: 500 }}
                      >
                        {positive ? "+" : ""}{fresh.change30dPct.toFixed(2)}% 30d
                      </span>
                    </div>
                    {fresh.signal && (
                      <div
                        className="mt-1 text-[10px] uppercase tracking-[0.15em]"
                        style={{
                          color: fresh.signal === "buy" ? BULL : fresh.signal === "sell" ? BEAR : "#62625B",
                          fontWeight: 500,
                        }}
                      >
                        AI: {fresh.signal}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="text-[12px] italic"
                    style={{ color: "#91918C", fontFamily: SERIF }}
                  >
                    點下方刷新即時抓取
                  </div>
                )}

                <button
                  onClick={() => refresh(sym)}
                  disabled={isRefreshing}
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] disabled:opacity-50 transition-colors"
                  style={{
                    background: "transparent",
                    color: INK,
                    border: "1px solid rgba(33,25,34,0.15)",
                    fontWeight: 500,
                  }}
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "抓取中…" : fresh ? "再抓最新" : "即時刷新"}
                </button>
              </article>
            );
          })}
        </div>

        {symbols.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "#FAF9F6",
              border: "1px dashed rgba(33,25,34,0.15)",
              color: "#91918C",
              fontFamily: SERIF,
              fontStyle: "italic",
            }}
          >
            清單空了。點「加入標的」開始追蹤。
          </div>
        )}
      </div>
    </section>
  );
}
