"use client";

const AMBER = "#FF6B00";
const BULL = "#3F8500";
const BEAR = "#E5484D";

const MARKETS = [
  { flag: "🇹🇼", code: "TWII", name: "台股", change: 1.42 },
  { flag: "🇺🇸", code: "SPX",  name: "美股", change: 0.83 },
  { flag: "🇭🇰", code: "HSI",  name: "港股", change: -0.51 },
  { flag: "🇨🇳", code: "SHCOMP", name: "A 股", change: 0.27 },
  { flag: "🇯🇵", code: "N225", name: "日股", change: 0.96 },
];

const TOP_OPPORTUNITIES = [
  { code: "NVDA", name: "NVIDIA", change: 7.99, signal: "AI BUY · 30D +15.55%" },
  { code: "2330", name: "TSMC",   change: 3.42, signal: "MA BULL ALIGN · INST +5D" },
  { code: "TSLA", name: "Tesla",  change: 5.18, signal: "MACD GOLD CROSS · INST UPGRADE" },
];

const TOP_RISKS = [
  { code: "INTC", name: "Intel",   change: -4.21, signal: "RSI OVERBOUGHT · TOO FAST" },
  { code: "0700", name: "Tencent", change: -2.85, signal: "VOL SPIKE · CHIPS LOOSE" },
  { code: "BABA", name: "Alibaba", change: -3.12, signal: "BREAK MA20 · MOM WEAK" },
];

export function MarketPulse() {
  return (
    <section
      className="relative"
      style={{ background: "#000000", borderBottom: "1px solid #27272A" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 pb-20">
        {/* Eyebrow */}
        <div
          className="text-[11px] uppercase mb-6"
          style={{
            color: "#767D88",
            letterSpacing: "0.35px",
            fontWeight: 450,
          }}
        >
          ───  Market Pulse  ·  Vol. 1  ·  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}  ───
        </div>

        {/* Display Hero — film title */}
        <h1
          className="max-w-[1100px]"
          style={{
            fontSize: "clamp(56px, 9vw, 96px)",
            fontWeight: 500,
            color: "#FFFFFF",
            lineHeight: 1.0,
            letterSpacing: "-1.5px",
          }}
        >
          打開就知道<br />
          <span style={{ color: AMBER }}>今天該不該動</span>
        </h1>

        <p
          className="mt-8 max-w-[640px]"
          style={{
            fontSize: "18px",
            color: "#C9CCD1",
            lineHeight: 1.55,
            letterSpacing: "-0.16px",
          }}
        >
          AI 替你掃完全球 5 國 100 檔 + 50 條 24h 新聞 + 11 種策略訊號，
          30 秒給你今日決策參考。
        </p>

        {/* AI Brief — full-bleed quote bar */}
        <div
          className="mt-16 py-10 px-8 lg:px-12"
          style={{
            background: "#0A0A0A",
            borderLeft: `2px solid ${AMBER}`,
          }}
        >
          <div
            className="text-[11px] uppercase mb-4"
            style={{
              color: AMBER,
              letterSpacing: "0.35px",
              fontWeight: 500,
            }}
          >
            AI Editor · Gemma 4 31B
          </div>
          <p
            style={{
              fontSize: "clamp(20px, 2.6vw, 30px)",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: 1.25,
              letterSpacing: "-0.6px",
              maxWidth: "920px",
            }}
          >
            美股昨夜創高，AI 半導體領漲；台股早盤可關注台積電與 NVIDIA 連動。港股恆生跌破 5 日均線，等反彈訊號再進場。
          </p>
        </div>

        {/* Market index strip — 5 col tight grid */}
        <div
          className="mt-16 grid grid-cols-2 sm:grid-cols-5 gap-px"
          style={{ background: "#27272A" }}
        >
          {MARKETS.map((m) => {
            const up = m.change >= 0;
            return (
              <div
                key={m.code}
                className="px-5 py-6"
                style={{ background: "#000000" }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[18px]">{m.flag}</span>
                  <span
                    className="text-[10px] uppercase font-mono"
                    style={{ color: "#767D88", letterSpacing: "0.35px", fontWeight: 500 }}
                  >
                    {m.code}
                  </span>
                </div>
                <div
                  className="text-[11px] uppercase mb-1.5"
                  style={{ color: "#C9CCD1", letterSpacing: "0.2px" }}
                >
                  {m.name}
                </div>
                <div
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: "26px",
                    fontWeight: 500,
                    color: up ? BULL : BEAR,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.0,
                  }}
                >
                  {up ? "+" : ""}{m.change.toFixed(2)}<span className="text-[14px] opacity-60">%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2 col: Opps + Risks */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background: "#27272A" }}>
          {/* Opps */}
          <div style={{ background: "#000000" }} className="p-8">
            <div
              className="text-[11px] uppercase mb-6"
              style={{ color: BULL, letterSpacing: "0.35px", fontWeight: 500 }}
            >
              ↑  Watchworthy  ·  今日機會
            </div>
            <div className="space-y-6">
              {TOP_OPPORTUNITIES.map((s, i) => (
                <article key={s.code} className="flex items-start justify-between gap-4 group">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      className="text-[12px] font-mono tabular-nums flex-shrink-0"
                      style={{ color: "#767D88" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="text-[26px] truncate"
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 500,
                          lineHeight: 1.0,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {s.name}{" "}
                        <span
                          className="text-[14px] font-mono"
                          style={{ color: "#767D88" }}
                        >
                          {s.code}
                        </span>
                      </h3>
                      <div
                        className="mt-2 text-[11px] uppercase font-mono"
                        style={{ color: "#767D88", letterSpacing: "0.35px" }}
                      >
                        {s.signal}
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-[20px] font-mono tabular-nums flex-shrink-0"
                    style={{ color: BULL, fontWeight: 500, letterSpacing: "-0.4px" }}
                  >
                    +{s.change.toFixed(2)}%
                  </span>
                </article>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div style={{ background: "#000000" }} className="p-8">
            <div
              className="text-[11px] uppercase mb-6"
              style={{ color: BEAR, letterSpacing: "0.35px", fontWeight: 500 }}
            >
              ↓  Caution  ·  今日警示
            </div>
            <div className="space-y-6">
              {TOP_RISKS.map((s, i) => (
                <article key={s.code} className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      className="text-[12px] font-mono tabular-nums flex-shrink-0"
                      style={{ color: "#767D88" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="text-[26px] truncate"
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 500,
                          lineHeight: 1.0,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {s.name}{" "}
                        <span
                          className="text-[14px] font-mono"
                          style={{ color: "#767D88" }}
                        >
                          {s.code}
                        </span>
                      </h3>
                      <div
                        className="mt-2 text-[11px] uppercase font-mono"
                        style={{ color: "#767D88", letterSpacing: "0.35px" }}
                      >
                        {s.signal}
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-[20px] font-mono tabular-nums flex-shrink-0"
                    style={{ color: BEAR, fontWeight: 500, letterSpacing: "-0.4px" }}
                  >
                    {s.change.toFixed(2)}%
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-wrap items-center gap-4">
          <button
            className="px-8 py-3 text-[12px] uppercase transition-colors"
            style={{
              background: AMBER,
              color: "#000000",
              fontWeight: 600,
              letterSpacing: "0.18em",
              borderRadius: "4px",
            }}
          >
            Open Dashboard ↗
          </button>
          <button
            className="px-8 py-3 text-[12px] uppercase transition-colors"
            style={{
              background: "transparent",
              color: "#FFFFFF",
              border: "1px solid #27272A",
              fontWeight: 500,
              letterSpacing: "0.18em",
              borderRadius: "4px",
            }}
          >
            Ask AI Editor
          </button>
          <span
            className="ml-auto text-[10px] uppercase font-mono"
            style={{ color: "#5E5E5E", letterSpacing: "0.35px" }}
          >
            v2.2  ·  Cinematic  ·  Issue 001
          </span>
        </div>
      </div>
    </section>
  );
}
