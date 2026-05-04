"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, X, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { EXTENDED_UNIVERSE } from "@/lib/extended-universe";
import { MARKETS } from "@/lib/portfolio";

const GOLD = "#F5A623";
const PINK = "#FF4D6D";
const BULL = "#26C281";
const BEAR = "#FF3B5C";

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

  // 載入 localStorage
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

  // 持久化
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

  // Picker：用 EXTENDED_UNIVERSE 搜尋
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
      className="border-t py-12"
      style={{ background: "#0B1426", borderColor: "rgba(245,166,35,0.10)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <div
              className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] mb-2"
              style={{ color: "#7A869A" }}
            >
              <Star className="h-3 w-3" style={{ color: GOLD }} />
              <span>My Watchlist · 我的清單</span>
            </div>
            <h2
              className="text-[28px] sm:text-[36px] tracking-[-0.03em]"
              style={{ color: "#F4F6FA", fontWeight: 510 }}
            >
              我的{" "}
              <span style={{ color: GOLD }} className="italic font-normal">
                追蹤清單
              </span>
            </h2>
            <p className="mt-1 text-[12px]" style={{ color: "#566175" }}>
              localStorage 持久化 · 只在你瀏覽器裡 · {symbols.length} 檔
            </p>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px]"
            style={{
              background: adding ? "rgba(244,246,250,0.04)" : GOLD,
              color: adding ? "#A9B3C4" : "#0B1426",
              fontWeight: 590,
              border: adding ? "1px solid rgba(244,246,250,0.10)" : "none",
            }}
          >
            {adding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {adding ? "取消" : "加入標的"}
          </button>
        </div>

        {/* Picker */}
        <AnimatePresence>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(244,246,250,0.04)",
                  border: `1px solid ${GOLD}40`,
                }}
              >
                <input
                  type="text"
                  autoFocus
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="輸入代號 / 名稱 / 產業搜尋（例：NVDA / 台積 / 半導體）"
                  className="w-full bg-transparent outline-none text-[14px]"
                  style={{ color: "#F4F6FA" }}
                />
                {pickerResults.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {pickerResults.map((s) => {
                      const m = MARKETS[s.market];
                      return (
                        <button
                          key={s.symbol}
                          onClick={() => addSymbol(s.symbol)}
                          className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-left text-[12px]"
                          style={{
                            background: "rgba(244,246,250,0.025)",
                            color: "#F4F6FA",
                          }}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span>{m?.flag}</span>
                            <span className="font-mono" style={{ fontWeight: 590 }}>
                              {s.shortCode}
                            </span>
                            <span style={{ color: "#A9B3C4" }} className="truncate">
                              {s.name}
                            </span>
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                            style={{ background: "rgba(244,246,250,0.04)", color: "#7A869A" }}
                          >
                            {s.sector}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {pickerQuery && pickerResults.length === 0 && (
                  <div className="mt-3 text-[12px]" style={{ color: "#566175" }}>
                    沒找到匹配的標的（universe 共 {EXTENDED_UNIVERSE.length} 檔）
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Watchlist cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {symbols.map((sym) => {
            const stock = EXTENDED_UNIVERSE.find((s) => s.symbol === sym);
            if (!stock) return null;
            const m = MARKETS[stock.market];
            const fresh = freshQuotes[sym];
            const positive = fresh ? fresh.change30dPct >= 0 : true;
            const isRefreshing = refreshing === sym;
            return (
              <motion.div
                key={sym}
                layout
                className="rounded-xl p-4 relative"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(31,58,107,0.4) 0%, rgba(11,20,38,0.6) 100%)",
                  border: `1px solid ${fresh ? GOLD + "40" : "rgba(244,246,250,0.08)"}`,
                  boxShadow: fresh ? `0 0 0 1px ${GOLD}22, 0 8px 24px -8px ${GOLD}33` : undefined,
                }}
              >
                <button
                  onClick={() => removeSymbol(sym)}
                  className="absolute top-2 right-2 grid h-5 w-5 place-items-center rounded-full text-[10px]"
                  style={{ color: "#566175", background: "rgba(244,246,250,0.04)" }}
                  aria-label={`移除 ${sym}`}
                >
                  ×
                </button>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[16px]">{m?.flag}</span>
                  <span
                    className="text-[15px] font-mono"
                    style={{ color: "#F4F6FA", fontWeight: 590 }}
                  >
                    {stock.shortCode}
                  </span>
                </div>
                <div className="text-[11px] truncate mb-2" style={{ color: "#A9B3C4" }}>
                  {stock.name} · {stock.sector}
                </div>

                {fresh ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-[18px] tabular-nums"
                        style={{ color: "#F4F6FA", fontWeight: 590 }}
                      >
                        {fresh.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                      <span
                        className="text-[12px] font-mono tabular-nums inline-flex items-center"
                        style={{ color: positive ? BULL : BEAR }}
                      >
                        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {positive ? "+" : ""}{fresh.change30dPct.toFixed(2)}% 30d
                      </span>
                    </div>
                    {fresh.signal && (
                      <div
                        className="mt-1.5 text-[10px] font-mono uppercase tracking-wider"
                        style={{
                          color:
                            fresh.signal === "buy" ? BULL : fresh.signal === "sell" ? BEAR : "#A9B3C4",
                        }}
                      >
                        AI: {fresh.signal}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[12px]" style={{ color: "#566175" }}>
                    點下方「即時刷新」抓 Yahoo + Gemma 報價
                  </div>
                )}

                <button
                  onClick={() => refresh(sym)}
                  disabled={isRefreshing}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-[11px] disabled:opacity-50"
                  style={{
                    background: fresh ? "rgba(244,246,250,0.04)" : `${GOLD}1f`,
                    color: fresh ? "#A9B3C4" : GOLD,
                    border: `1px solid ${fresh ? "rgba(244,246,250,0.10)" : `${GOLD}40`}`,
                    fontWeight: 510,
                  }}
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "抓取中…" : fresh ? "再抓最新" : "即時刷新"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {symbols.length === 0 && (
          <div
            className="rounded-xl p-8 text-center"
            style={{
              background: "rgba(244,246,250,0.025)",
              border: "1px dashed rgba(244,246,250,0.10)",
              color: "#A9B3C4",
            }}
          >
            清單空了。點「加入標的」開始追蹤。
          </div>
        )}
      </div>
    </section>
  );
}
