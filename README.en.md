# AI Stock Advisor

> A global multi-market AI quantitative analysis dashboard, designed and built end-to-end by [GKS](https://github.com/GKS711).
>
> 🇹🇼 Taiwan · 🇺🇸 US · 🇭🇰 Hong Kong · 🇨🇳 Mainland China · **12 curated stocks**
> 11 strategies · Gemma 4 31B real-time inference · Live Yahoo Finance quotes

[繁體中文](./README.md) · English

---

## 🎯 In One Sentence

**The frontend showcase of [`daily_stock_analysis`](https://github.com/GKS711/daily_stock_analysis)** — a real Python-based quantitative system that runs daily and now has its output beautifully visualized as a shareable dashboard.

---

## 📸 Preview

### Hero — Apple-style auto-cycling spotlight

![Hero](./docs/screenshots/01-hero.png)

12 spotlight stock cards rotate every 4.5 seconds. Each pulls real Yahoo Finance prices and a real Gemma 4 31B AI rationale.

### Decision Terminal — Multi-Market Card Matrix

![Decision Terminal](./docs/screenshots/02-decision-terminal.png)

All 4 markets at a glance. Each card shows: country flag + real price + 30-day sparkline + AI consensus signal (BUY/HOLD/SELL with 0–100 confidence). Filter by market with one click.

### Visual Daily Report — 4 Insight Cards

![Visual Report](./docs/screenshots/03-visual-report.png)

Market sentiment gauge + top movers + 11-strategy radar + 7-day calendar — replaces plain markdown daily reports.

### News Feed — Real Yahoo Finance News

![News Feed](./docs/screenshots/04-news-feed.png)

Pulls real 24-hour news from Yahoo Finance search API: publisher, related tickers, and sentiment scoring via keyword bag-of-words analysis.

### Strategy × Stock Interactive Heatmap

![Strategy Heatmap](./docs/screenshots/05-strategy-heatmap.png)

132 cells (11 × 12), every signal computed from **real OHLC data** — moving averages, RSI, MACD, Bollinger Bands, VWAP, Volume Profile. Hover any cell for an explanation.

### 12-Month Backtest

![Backtest](./docs/screenshots/06-backtest.png)

Recharts area chart: strategy +18.7% vs benchmark +12.5% (alpha +6.2%) · Sharpe 1.84 · max drawdown -7.3%.

### How It Works — 5-Stage Pipeline

![How It Works](./docs/screenshots/07-how-it-works.png)

Visual representation of the system flow: data sources → strategies → LLM → decisions → multi-channel push, with stagger animations.

### AI Advisor — Gemma 4 31B Live Streaming

![AI Demo](./docs/screenshots/08-ai-demo.png)

System prompt dynamically injects all 12 stocks' real prices, 30-day changes, and AI consensus signals. The advisor cites real numbers in token-by-token streaming.

### Per-Stock Detail Page `/us/nvda`

![Stock Detail](./docs/screenshots/10-stock-detail-nvda.png)

Each stock has its own SSG page with full K-line chart (OHLC + MA5 + MA20), AI risk checklist, action items, per-strategy signal grid, and related stocks. SEO-friendly with unique OG images per page.

### Extended Universe `/markets`

![Markets](./docs/screenshots/12-markets-page.png)

50 stocks across 4 markets (TW 15 / US 15 / HK 10 / CN 10). With a candid section on "why 50 not 500".

---

## ✨ Key Features

| Capability | Details |
|---|---|
| **Multi-market coverage** | 12 curated stocks across 4 markets + 50-stock extended universe |
| **Real prices** | Yahoo Finance v8 chart API (no API key required) |
| **Real technical indicators** | MA, RSI, MACD, Bollinger, VWAP, Volume Profile — pure functions over OHLC |
| **Real AI decisions** | Gemma 4 31B live, with rationale/risks/catalysts dynamically generated per stock |
| **Real news** | Yahoo Finance search API + bag-of-words sentiment scoring |
| **Full K-line** | TradingView's lightweight-charts + MA5/MA20 overlays |
| **Per-stock pages** | 12 SSG routes like `/tw/2330`, `/us/nvda`, each with its own OG image |
| **Full a11y** | Keyboard navigation in heatmap, focus trap in dialogs, aria-live for streaming chat, prefers-reduced-motion friendly |
| **Multi-currency** | Auto-switches between NT$ / $ / HK$ / ¥ |

---

## 🚀 Getting Started

### Development

```bash
# 1. Install
npm install

# 2. Set up API key
cp .env.example .env.local
# Edit .env.local — get GEMINI_API_KEY at https://aistudio.google.com/apikey

# 3. Pull real snapshot data (first run)
npm run refresh-data

# 4. Dev
npm run dev      # → http://localhost:3000
```

`.env.local` example:

```bash
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemma-4-31b-it
GEMINI_FALLBACK_MODEL=gemma-4-26b-a4b-it
NEXT_PUBLIC_SITE_URL=https://your-deploy.vercel.app
```

### Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. In Settings → Environment Variables, add `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`, `NEXT_PUBLIC_SITE_URL`
4. Deploy

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14.2.35 (App Router) · TypeScript strict
- **Styling**: Tailwind CSS 3.4 · custom ink/mint design tokens
- **Charts**: Recharts 3 (backtest) · lightweight-charts 5 (K-line) · custom SVG sparkline
- **Animations**: framer-motion 11 (scroll-linked + parallax + stagger)
- **Sound**: native Web Audio API
- **Icons**: lucide-react
- **Font**: Geist Sans + Geist Mono (tabular-nums)
- **AI SDK**: @google/generative-ai with Gemma 4 31B (zod-validated)
- **Validation**: zod
- **OG image**: next/og (Edge runtime, per-stock unique)

### Backend ([separate repo](https://github.com/GKS711/daily_stock_analysis))

- Python 3.10+ / FastAPI / SQLAlchemy
- Litellm (40+ LLM abstraction layer)
- 8+ data sources: efinance / AkShare / Tushare / Pytdx / Baostock / YFinance / Longbridge / TickFlow
- 11 strategy analyzers
- Multi-channel notifications: WeChat / Feishu / Telegram / Discord / Slack / Email
- GitHub Actions cron at 09:00 daily

### Data Layer (build-time)

```
scripts/refresh-data.mjs
  ↓ curl shell-out → Yahoo v8 chart (works around Node fetch ban)
  ↓ Sequential fetch of 12 stocks' OHLC + meta
  ↓ lib/indicators.ts pure functions compute 11 strategies
  ↓ Gemma 4 31B generates AI decision JSON per stock (zod-validated)
  ↓ Yahoo search API pulls 6 real news items
lib/cached/snapshot.json (committed to repo)
  ↓
Frontend reads → /api/quotes, portfolio.ts, strategies.ts, news-feed.tsx
```

---

## 🎨 Design System — "Quant Terminal"

Linear (foundation) + Raycast (glass shadows) + Bloomberg (information density) = dark-mode-native + data-first + red/green ±% contrast.

### Color tokens

```ts
ink:  { 50: "#F6F6F6", 300: "#9A9A9A", 800: "#141414", 900: "#0A0A0A", 950: "#050505" }
mint: { 300: "#6FC298", 400: "#4EAA85", 600: "#2E5845" }
bull: "#10b981"     // up
bear: "#E5484D"     // down
```

### Seven Principles

1. Black-on-black is fine — depth comes from `border-white/[0.06]`, never gray fill
2. One accent color only — mint, reserved for CTAs and live signals
3. All numbers are `tabular-nums`
4. Headings use weight 510 (the signature in-between)
5. Italic carries personality — every section heading has one mint italic word
6. Animations don't steal the show — 0.4Hz slow pulse, never 1Hz
7. Information density honors Bloomberg — monospace timestamps, red/green ±%

See [`DESIGN.md`](./DESIGN.md) for full specs.

---

## 🔄 Real vs Demo Breakdown

| Section | Live/Real | Demo (mock) |
|---|---|---|
| 12 stock prices | ✅ Yahoo v8 chart | — |
| 30-day OHLC sparkline | ✅ Real daily candles | — |
| 11 strategies × 88 cells | ✅ MA/RSI/MACD computed from real OHLC | — |
| AI rationale/risks/catalysts | ✅ Gemma 4 31B live | — |
| News Feed | ✅ Yahoo Finance search API | — |
| AI advisor chat | ✅ Gemma 4 31B streaming | — |
| 12-month backtest stats | — | ⚠️ Mock (real backtest requires backend repo output) |
| Sample daily markdown report | — | ⚠️ Mock |
| 50-stock extended universe metadata | ✅ Static facts | — |

See FAQ section or hover the DEMO chip in the header for details.

---

## 🤖 Codex Pair-Programming Log

Built through **3 rounds of Claude × Codex pair-programming**, where every major decision was peer-reviewed by Codex:

- Schema layering (StockMeta + StockQuote + StrategyResult)
- /api/analyze three-layer protection (responseMimeType + zod + brace-counter)
- 5 a11y must-fixes (heatmap aria-label + dialog focus trap + chat aria-live + rate limit + privacy copy)
- OG image composition (Option C: spotlight card)
- Per-stock URL structure (market-prefix `/tw/2330`)
- Real-data fetching strategy (short UA + sequential + curl shell-out)

---

## 📜 License

MIT — feel free to fork and self-host.

---

## 🙏 Credits

- Backend system: [`daily_stock_analysis`](https://github.com/GKS711/daily_stock_analysis) by GKS
- Charts: [Recharts](https://recharts.org) · [lightweight-charts](https://www.tradingview.com/lightweight-charts/) by TradingView
- Icons: [Lucide](https://lucide.dev)
- Fonts: [Geist](https://vercel.com/font) by Vercel
- AI Model: [Gemma 4 31B](https://ai.google.dev/gemma) by Google

---

Built end-to-end by **GKS** · 2026 · 100% custom-engineered

[🌐 Live Demo](https://your-deploy.vercel.app) · [📖 繁體中文](./README.md) · [⚙️ DESIGN.md](./DESIGN.md) · [🐍 Backend Python repo](https://github.com/GKS711/daily_stock_analysis)
