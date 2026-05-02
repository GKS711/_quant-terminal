"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { PORTFOLIO } from "@/lib/portfolio";

const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

interface Quote {
  ticker: string;
  shortTicker: string;
  name: string;
  price: number;
  changePercent: number;
}

/**
 * Live Pulse — 跑馬燈式即時行情條，放在 Decision Terminal 跟 Strategy Heatmap 之間
 *
 * 視覺：
 *   - 高度 64px，背景近黑
 *   - 8 檔股票橫向跑馬燈，無縫循環
 *   - 紅綠對比明顯，monospace 數字
 *   - LIVE pulse 在最左側
 */
export function LivePulse() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let mounted = true;
    async function fetchQuotes() {
      try {
        const symbols = PORTFOLIO.map((s) => s.symbol).join(",");
        const r = await fetch(`/api/quotes?symbols=${symbols}`, { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        const map: Record<string, Quote> = {};
        for (const q of j.quotes ?? []) map[q.ticker] = q;
        setQuotes(map);
      } catch {}
    }
    fetchQuotes();
    const id = setInterval(fetchQuotes, 60_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const items = PORTFOLIO.map((s) => ({
    ticker: s.shortCode,
    name: s.name,
    quote: quotes[s.symbol],
  }));
  const doubled = [...items, ...items];

  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.08]"
      style={{ background: "rgba(10,12,16,0.95)" }}
    >
      <div className="flex items-center">
        {/* LIVE indicator (sticky left) */}
        <div
          className="flex items-center gap-2 px-5 py-3.5 border-r border-white/[0.08] flex-shrink-0"
          style={{ background: "rgba(20,22,28,0.9)" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: MINT_BRIGHT }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: MINT_BRIGHT }} />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a8f98]">LIVE TWSE</span>
        </div>

        {/* Marquee — 尊重 prefers-reduced-motion */}
        <div
          className="flex animate-marquee whitespace-nowrap py-3 motion-reduce:animate-none hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          aria-label="即時股票報價輪播"
        >
          {doubled.map((it, i) => {
            const positive = (it.quote?.changePercent ?? 0) >= 0;
            return (
              <div key={i} className="flex items-center gap-2.5 px-7 text-[13px] font-mono">
                <span className="text-[#62666d]">{it.ticker}</span>
                <span className="text-[#a8a8b3]">{it.name}</span>
                <span className="tabular-nums" style={{ color: "#f7f8f8", fontWeight: 510 }}>
                  {it.quote ? it.quote.price.toFixed(2) : "—"}
                </span>
                <span className="inline-flex items-center gap-0.5 tabular-nums" style={{ color: positive ? BULL : BEAR }}>
                  {it.quote ? (
                    <>
                      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {positive ? "+" : ""}{it.quote.changePercent.toFixed(2)}%
                    </>
                  ) : (
                    <Activity className="h-3 w-3" />
                  )}
                </span>
                <span className="text-[#23252a]">·</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
