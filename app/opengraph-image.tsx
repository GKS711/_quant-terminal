import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "每日股市儀表板 — AI 在看懂全球股票";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";

/**
 * 主頁 OG image — 1200×630
 *
 * 構圖：
 *   - 左上：每日股市儀表板 logo + 副名 "AI Stock Analysis"
 *   - 中：大標題 "AI 在 看懂 全球股票"
 *   - 中下：副標 + 4 國旗 chip
 *   - 右下：模擬一張 spotlight 卡片（類似 hero 內的）
 *   - 背景：mint dot grid + radial gradient
 */
export default async function OG() {
  // 用簡單的 SVG sparkline path（30 個點上升趨勢）
  const sparkPath = generateSparklinePath(30, 220, 56, true);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#08090a",
          backgroundImage:
            `radial-gradient(ellipse 70% 60% at 30% 35%, ${MINT}24 0%, transparent 60%), ` +
            `radial-gradient(circle, rgba(111,194,152,0.16) 1px, transparent 1px)`,
          backgroundSize: "auto, 40px 40px",
          padding: "56px 64px",
          color: "#f7f8f8",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Top: brand + status pill */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48, height: 48, borderRadius: 10,
                background: MINT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#08090a",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              ↗
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 590, letterSpacing: -0.6 }}>每日股市儀表板</div>
              <div style={{ fontSize: 14, color: "#8a8f98", fontFamily: "ui-monospace, monospace" }}>
                AI Stock Analysis · GKS
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              fontSize: 14,
              fontFamily: "ui-monospace, monospace",
              color: "#a8a8b3",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: MINT_BRIGHT }} />
            <span style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>LIVE</span>
            <span style={{ color: "#62666d" }}>·</span>
            <span>gemma-4-31b-it</span>
          </div>
        </div>

        {/* Center: big headline + spotlight card side-by-side */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 12, gap: 48 }}>
          {/* Left: headline */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontSize: 96,
                fontWeight: 510,
                lineHeight: 1.0,
                letterSpacing: -3.5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <span>AI 在</span>
                <span style={{ color: MINT_BRIGHT, fontStyle: "italic", fontWeight: 400 }}>看懂</span>
              </div>
              <span>全球股票。</span>
            </div>

            {/* Subtitle + flags */}
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#a8a8b3" }}>
              <span style={{ fontSize: 28 }}>🇹🇼</span>
              <span>台股</span>
              <span style={{ color: "#62666d" }}>·</span>
              <span style={{ fontSize: 28 }}>🇺🇸</span>
              <span>美股</span>
              <span style={{ color: "#62666d" }}>·</span>
              <span style={{ fontSize: 28 }}>🇭🇰</span>
              <span>港股</span>
              <span style={{ color: "#62666d" }}>·</span>
              <span style={{ fontSize: 28 }}>🇨🇳</span>
              <span>A 股</span>
            </div>
          </div>

          {/* Right: spotlight card */}
          <div
            style={{
              width: 380,
              padding: 28,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 100%)",
              border: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              flexDirection: "column",
              boxShadow: `0 30px 80px -20px ${MINT}44`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>🇺🇸</span>
                <span style={{ fontSize: 26, fontFamily: "ui-monospace, monospace", fontWeight: 590, letterSpacing: -0.4 }}>
                  NVDA
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 999,
                  background: `${BULL}25`,
                  color: BULL,
                  fontSize: 13,
                  fontFamily: "ui-monospace, monospace",
                  fontWeight: 590,
                  letterSpacing: 1.2,
                  border: `1px solid ${BULL}55`,
                }}
              >
                BUY 88
              </div>
            </div>
            <div style={{ fontSize: 14, color: "#8a8f98", marginTop: 4 }}>輝達 · NASDAQ</div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 16 }}>
              <span style={{ fontSize: 38, fontWeight: 510, letterSpacing: -1.0 }}>$132.80</span>
              <span style={{ fontSize: 16, color: BULL, fontFamily: "ui-monospace, monospace" }}>+5.20%</span>
            </div>

            {/* Sparkline */}
            <svg width="324" height="60" viewBox="0 0 324 60" style={{ marginTop: 14 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BULL} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={BULL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={`${sparkPath} L324,60 L0,60 Z`} fill="url(#grad)" />
              <path d={sparkPath} stroke={BULL} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={324} cy={4} r={4} fill={BULL} />
            </svg>

            <div style={{ marginTop: 16, fontSize: 14, color: "#d0d6e0", lineHeight: 1.5 }}>
              Blackwell 供不應求，GB200 機櫃 ASP 較 H100 提升 3 倍。
            </div>
          </div>
        </div>

        {/* Bottom: tech stack tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-monospace, monospace",
            fontSize: 13,
            color: "#62666d",
            letterSpacing: 1.0,
            textTransform: "uppercase",
          }}
        >
          <span>12 stocks · 11 strategies · 4 markets</span>
          <span>github.com/GKS711/daily_stock_analysis</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

// 簡單 SVG path 產生器（mock 上升 sparkline）
function generateSparklinePath(points: number, width: number, height: number, ascending: boolean): string {
  const pts: string[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const noise = Math.sin(i * 0.65 + 1) * 0.12;
    const base = ascending ? t : 1 - t;
    const y = height - (base + noise) * height * 0.85;
    const x = t * width;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}
