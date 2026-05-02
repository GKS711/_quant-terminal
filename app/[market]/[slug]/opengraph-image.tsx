import { ImageResponse } from "next/og";
import { MARKETS } from "@/lib/portfolio";
import { routeToStock } from "@/lib/stock-routes";

export const runtime = "edge";
export const alt = "Stock detail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

interface Props {
  params: { market: string; slug: string };
}

export default async function StockOG({ params }: Props) {
  const stock = routeToStock(params.market, params.slug);
  if (!stock) {
    return new ImageResponse(
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#08090a", color: "#fff" }}>Not found</div>,
      { ...size },
    );
  }

  const market = MARKETS[stock.market];
  const sigColor = stock.decision.signal === "buy" ? BULL : stock.decision.signal === "sell" ? BEAR : "#a8a8a8";
  const lastPrice = stock.spark30d?.[stock.spark30d.length - 1] ?? 100;
  const firstPrice = stock.spark30d?.[0] ?? 100;
  const changePct = ((lastPrice - firstPrice) / firstPrice) * 100;
  const positive = changePct >= 0;
  const trendColor = positive ? BULL : BEAR;
  const currencySymbol =
    market.currency === "USD" ? "$" :
    market.currency === "TWD" ? "NT$" :
    market.currency === "HKD" ? "HK$" : "¥";

  // 簡單 sparkline path
  const sparkPath = (() => {
    const data = stock.spark30d ?? [1, 1];
    const w = 720, h = 220;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = w / (data.length - 1);
    return data.reduce((acc, v, i) => {
      const x = i * stepX;
      const y = h - ((v - min) / range) * h;
      return acc + (i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`);
    }, "");
  })();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#08090a",
          backgroundImage:
            `radial-gradient(ellipse 70% 60% at 30% 35%, ${sigColor}26 0%, transparent 60%), ` +
            `radial-gradient(circle, rgba(111,194,152,0.14) 1px, transparent 1px)`,
          backgroundSize: "auto, 40px 40px",
          padding: "56px 64px",
          color: "#f7f8f8",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38, height: 38, borderRadius: 9,
                background: "#4EAA85",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#08090a", fontSize: 22, fontWeight: 700,
              }}
            >↗</div>
            <div style={{ fontSize: 20, fontWeight: 590 }}>每日股市儀表板</div>
            <div style={{ fontSize: 13, color: "#62666d", fontFamily: "ui-monospace, monospace" }}>
              · AI Stock Analysis
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "#62666d",
              fontFamily: "ui-monospace, monospace",
              textTransform: "uppercase",
              letterSpacing: 1.0,
            }}
          >
            gemma-4-31b-it · 11 strategies
          </div>
        </div>

        {/* Middle: ticker + signal pill */}
        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 80 }}>{market.flag}</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span
                style={{
                  fontSize: 96,
                  fontWeight: 590,
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: -3,
                  lineHeight: 1.0,
                }}
              >
                {stock.shortCode}
              </span>
              <span style={{ fontSize: 28, color: "#a8a8b3" }}>{stock.name}</span>
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#62666d",
                fontFamily: "ui-monospace, monospace",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              {market.exchange} · {stock.sector}
            </div>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 22px",
                borderRadius: 999,
                background: `${sigColor}25`,
                border: `2px solid ${sigColor}66`,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 590,
                  color: sigColor,
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: 2,
                }}
              >
                {stock.decision.signal.toUpperCase()}
              </span>
              <span style={{ fontSize: 32, color: sigColor, fontWeight: 590 }}>
                {stock.decision.score}
              </span>
            </div>
          </div>
        </div>

        {/* Price + sparkline */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 510, letterSpacing: -1.4 }}>
              {currencySymbol}{lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: 18, color: trendColor, fontFamily: "ui-monospace, monospace" }}>
              {positive ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}% (30d)
            </span>
          </div>

          {/* Sparkline */}
          <svg width="720" height="220" viewBox="0 0 720 220" style={{ marginLeft: "auto" }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor} stopOpacity={0.32} />
                <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${sparkPath} L720,220 L0,220 Z`} fill="url(#sparkGrad)" />
            <path d={sparkPath} stroke={trendColor} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Bottom: rationale */}
        <div
          style={{
            marginTop: "auto",
            padding: "20px 24px",
            background: "rgba(255,255,255,0.025)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
              color: "#62666d",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              flexShrink: 0,
              padding: "2px 8px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            AI
          </div>
          <span style={{ fontSize: 22, color: "#d0d6e0", lineHeight: 1.4 }}>
            {stock.decision.rationale}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
