"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency, formatPercent, positionValue } from "@/lib/utils";

/**
 * 持倉設定：每檔股票的張數（一張＝1000股）。
 * 真實價格從 /api/quotes 取得，這裡只決定組合配置。
 */
const HOLDINGS = [
  { ticker: "2330.TW",  shortTicker: "2330",  name: "台積電",          shares: 1000 }, // 1 張
  { ticker: "0050.TW",  shortTicker: "0050",  name: "元大台灣 50",     shares: 5000 }, // 5 張
  { ticker: "00878.TW", shortTicker: "00878", name: "國泰永續高股息",   shares: 10000 },
  { ticker: "2454.TW",  shortTicker: "2454",  name: "聯發科",          shares: 200 },
  { ticker: "2317.TW",  shortTicker: "2317",  name: "鴻海",            shares: 1000 },
];

// 後備假資料（API 失敗時用，價格貼近 2026 年合理區間）
const FALLBACK: Record<string, { price: number; changePercent: number }> = {
  "2330.TW":  { price: 1180, changePercent: +1.42 },
  "0050.TW":  { price: 235,  changePercent: +0.64 },
  "00878.TW": { price: 26,   changePercent: -0.18 },
  "2454.TW":  { price: 1450, changePercent: +2.31 },
  "2317.TW":  { price: 220,  changePercent: -0.45 },
};

const SPARK_POINTS = [
  [0, 70], [10, 64], [20, 60], [30, 52], [40, 55], [50, 46],
  [60, 40], [70, 36], [80, 30], [90, 22], [100, 18], [110, 12],
];

interface QuoteResp {
  ticker: string;
  shortTicker: string;
  name: string;
  price: number;
  changePercent: number;
}

interface State {
  quotes: Record<string, QuoteResp>;
  source: "live" | "fallback" | "loading";
  fetchedAt?: string;
}

export function PortfolioCard() {
  const [state, setState] = useState<State>({ quotes: {}, source: "loading" });

  async function load() {
    try {
      const symbols = HOLDINGS.map((h) => h.ticker).join(",");
      const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbols)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.quotes) && json.quotes.length > 0) {
        const map: Record<string, QuoteResp> = {};
        for (const q of json.quotes as QuoteResp[]) map[q.ticker] = q;
        setState({ quotes: map, source: "live", fetchedAt: json.fetchedAt });
        return;
      }
      throw new Error(json.error ?? "no quotes");
    } catch (e) {
      // Fallback to baked-in mock so the demo never looks broken
      const map: Record<string, QuoteResp> = {};
      for (const h of HOLDINGS) {
        const f = FALLBACK[h.ticker];
        map[h.ticker] = {
          ticker: h.ticker,
          shortTicker: h.shortTicker,
          name: h.name,
          price: f.price,
          changePercent: f.changePercent,
        };
      }
      setState({ quotes: map, source: "fallback" });
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000); // 每 60 秒重抓
    return () => clearInterval(id);
  }, []);

  // 計算總值
  const total = HOLDINGS.reduce((sum, h) => {
    const q = state.quotes[h.ticker];
    if (!q) return sum;
    return sum + positionValue(q.price, h.shares);
  }, 0);

  // 加權變動率
  const weightedChange =
    total > 0
      ? HOLDINGS.reduce((sum, h) => {
          const q = state.quotes[h.ticker];
          if (!q) return sum;
          const w = positionValue(q.price, h.shares) / total;
          return sum + q.changePercent * w;
        }, 0)
      : 0;

  return (
    <div className="relative isolate w-full max-w-[460px] mx-auto">
      <div className="absolute -inset-6 -z-10 rounded-[28px] bg-mint-400/10 blur-2xl" aria-hidden />

      <div className="rounded-2xl border border-white/[0.08] bg-ink-800/80 backdrop-blur-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className={
              "h-2 w-2 rounded-full " +
              (state.source === "live"
                ? "bg-mint-400 animate-pulse-soft"
                : state.source === "fallback"
                ? "bg-amber-400"
                : "bg-white/30")
            } />
            <span className="text-xs font-mono uppercase tracking-wider text-ink-300">
              {state.source === "live" && "台股組合 · Yahoo 即時"}
              {state.source === "fallback" && "台股組合 · 示範資料"}
              {state.source === "loading" && "載入中⋯⋯"}
            </span>
          </div>
          <button
            onClick={load}
            className="text-ink-400 hover:text-ink-100 transition-colors"
            aria-label="重新整理"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-5 pt-5">
          <div className="text-xs text-ink-300">總資產淨值</div>
          <div className="mt-1 flex items-baseline gap-3 min-h-[44px]">
            {state.source === "loading" ? (
              <div className="h-9 w-44 rounded bg-white/[0.06] animate-pulse" />
            ) : (
              <>
                <div className="font-display text-[40px] leading-none tracking-tightest tabular text-ink-50">
                  {formatCurrency(total)}
                </div>
                <div className={
                  "inline-flex items-center gap-1 text-sm tabular " +
                  (weightedChange >= 0 ? "text-mint-300" : "text-danger")
                }>
                  <TrendingUp className="h-3.5 w-3.5" />
                  {formatPercent(weightedChange)}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-2 pt-5">
          <svg viewBox="0 0 110 80" className="w-full h-24">
            <defs>
              <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"  stopColor="#4EAA85" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#4EAA85" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={"M " + SPARK_POINTS.map(([x, y]) => `${x} ${y}`).join(" L ") + " L 110 80 L 0 80 Z"}
              fill="url(#sparkFill)"
            />
            <path
              d={"M " + SPARK_POINTS.map(([x, y]) => `${x} ${y}`).join(" L ")}
              fill="none"
              stroke="#4EAA85"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="110" cy="12" r="2.2" fill="#F6F6F6" stroke="#4EAA85" strokeWidth="1.4" />
          </svg>
        </div>

        <ul className="px-2 pb-4">
          {HOLDINGS.map((h) => {
            const q = state.quotes[h.ticker];
            const value = q ? positionValue(q.price, h.shares) : 0;
            return (
              <li
                key={h.ticker}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono">
                    {h.shortTicker.slice(0, 4)}
                  </div>
                  <div>
                    <div className="text-sm text-ink-50">{h.shortTicker}</div>
                    <div className="text-[11px] text-ink-300">{h.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm tabular text-ink-50 min-w-[90px]">
                    {q ? formatCurrency(value) : <span className="inline-block h-3 w-16 rounded bg-white/[0.06] animate-pulse" />}
                  </div>
                  <div className={"text-[11px] tabular " + ((q?.changePercent ?? 0) >= 0 ? "text-mint-300" : "text-danger")}>
                    {q ? formatPercent(q.changePercent) : "—"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
          <span className="text-[11px] text-ink-400 font-mono inline-flex items-center gap-1.5">
            {state.source === "fallback" && <AlertCircle className="h-3 w-3 text-amber-400" />}
            {state.fetchedAt ? `更新於 ${new Date(state.fetchedAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}` : "尚未連線即時資料"}
          </span>
          <a
            href="#advisor"
            className="inline-flex items-center gap-1 text-[12px] text-mint-300 hover:text-mint-200"
          >
            問問 AI 顧問 <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
