/**
 * 多市場精選池 — TW / US / HK / CN，共 12 檔
 *
 * 對齊 GitHub `daily_stock_analysis` 系統涵蓋：A 股 / 港股 / 美股 + 台股
 *
 * 資料來源優先序：
 *   1. lib/cached/snapshot.json（build 時抓的真實 Yahoo + Gemma 4，最新）
 *   2. 手寫 mock fallback（本檔最下方）
 *
 * 跑 `npm run refresh-data` 重新整理 snapshot。
 */

import { SNAPSHOT, hasSnapshot, getCached } from "./cached";

export type Signal = "buy" | "hold" | "sell";
export type Market = "TW" | "US" | "HK" | "CN";

export interface MarketMeta {
  code: Market;
  flag: string;
  nameZh: string;
  nameEn: string;
  exchange: string;
  currency: "TWD" | "USD" | "HKD" | "CNY";
  tradingHoursLocal: string;
}

export const MARKETS: Record<Market, MarketMeta> = {
  TW: { code: "TW", flag: "🇹🇼", nameZh: "台股", nameEn: "Taiwan",   exchange: "TWSE",     currency: "TWD", tradingHoursLocal: "09:00–13:30" },
  US: { code: "US", flag: "🇺🇸", nameZh: "美股", nameEn: "US",       exchange: "NASDAQ",   currency: "USD", tradingHoursLocal: "09:30–16:00 ET" },
  HK: { code: "HK", flag: "🇭🇰", nameZh: "港股", nameEn: "Hong Kong", exchange: "HKEX",    currency: "HKD", tradingHoursLocal: "09:30–16:00" },
  CN: { code: "CN", flag: "🇨🇳", nameZh: "A 股", nameEn: "Mainland",  exchange: "SSE/SZSE", currency: "CNY", tradingHoursLocal: "09:30–15:00" },
};

export type SectorTag =
  | "半導體" | "ETF" | "電子代工" | "電子零組件" | "光電" | "食品" | "金融"
  | "電動車" | "雲端運算" | "消費電子" | "網際網路" | "白酒" | "支付" | "電信";

export interface Decision {
  signal: Signal;
  score: number;
  rationale: string;
  risks: string[];
  catalysts: string[];
  generatedAt: string;
}

export interface Quote {
  price: number;
  changePct: number;
  prevClose: number;
  volume?: number;
}

export interface Stock {
  symbol: string;       // Yahoo Finance 格式："2330.TW", "AAPL", "0700.HK", "600519.SS"
  shortCode: string;    // 顯示用："2330", "AAPL", "0700", "600519"
  name: string;
  nameEn: string;
  sector: SectorTag;
  market: Market;
  marketCap: number;    // 統一以「萬億當地幣」計（兆 TWD / 兆 USD / 兆 HKD / 兆 CNY）
  decision: Decision;
  quote?: Quote;
  /** 30 日收盤價序列（mock，給 sparkline 用），最後一筆 = 今日 */
  spark30d?: number[];
}

const NOW = new Date().toISOString();

// ─── 12 檔精選 ─────────────────────────────────────

// helper: deterministic-ish sparkline 序列（30 點，圍繞給定終點 ±10%）
function genSparkline(latest: number, trend: number, seed: number): number[] {
  const arr: number[] = [];
  let v = latest * (1 - trend);
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    // 線性目標 + 隨機抖動
    const target = latest * (1 - trend) + latest * trend * t;
    const noise = Math.sin(seed + i * 0.5) * 0.012 * latest;
    v = target + noise;
    arr.push(Number(v.toFixed(2)));
  }
  arr[29] = latest; // 確保收盤匹配
  return arr;
}

// ─── Mock fallback portfolio（手寫，當 snapshot 沒資料時用）─────
const MOCK_PORTFOLIO: Stock[] = [
  // 🇹🇼 TW (4)
  {
    symbol: "2330.TW", shortCode: "2330", name: "台積電", nameEn: "TSMC",
    sector: "半導體", market: "TW", marketCap: 25.4,
    decision: {
      signal: "buy", score: 82,
      rationale: "AI 晶片需求超預期，3nm 良率穩定爬升，外資連續 5 日買超。",
      risks: ["地緣政治風險", "台幣升值侵蝕毛利"],
      catalysts: ["Q1 財報展望樂觀", "雲端 capex 上修"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(1469, 0.085, 11),
  },
  {
    symbol: "2454.TW", shortCode: "2454", name: "聯發科", nameEn: "MediaTek",
    sector: "半導體", market: "TW", marketCap: 2.3,
    decision: {
      signal: "buy", score: 71,
      rationale: "5G + AI Edge 雙引擎啟動，Dimensity 9400 出貨優於預期。",
      risks: ["手機市場需求疲弱", "高通競爭加劇"],
      catalysts: ["車用晶片佈局發酵", "AI PC 設計 win"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(1518, 0.06, 22),
  },
  {
    symbol: "2317.TW", shortCode: "2317", name: "鴻海", nameEn: "Hon Hai",
    sector: "電子代工", market: "TW", marketCap: 2.6,
    decision: {
      signal: "hold", score: 58,
      rationale: "AI 伺服器訂單能見度高，但傳統 EMS 毛利壓縮，整體持平。",
      risks: ["NVIDIA 訂單分散", "電動車事業仍虧損"],
      catalysts: ["GB200 機櫃量產", "墨西哥廠拉貨"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(218, 0.02, 33),
  },
  {
    symbol: "0050.TW", shortCode: "0050", name: "元大台灣 50", nameEn: "Yuanta TW50",
    sector: "ETF", market: "TW", marketCap: 0.55,
    decision: {
      signal: "hold", score: 65,
      rationale: "台股長線多頭未變，半導體權重過重，建議定額而非加碼。",
      risks: ["本益比偏高", "權重股集中"],
      catalysts: ["GDP 上修", "外資回流"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(195, 0.05, 44),
  },

  // 🇺🇸 US (4)
  {
    symbol: "AAPL", shortCode: "AAPL", name: "蘋果", nameEn: "Apple",
    sector: "消費電子", market: "US", marketCap: 3.55,
    decision: {
      signal: "hold", score: 62,
      rationale: "Vision Pro 滯銷壓力大，但服務業務 ARPU 持續創高，整體穩健。",
      risks: ["中國市場萎縮", "AI 戰略落後"],
      catalysts: ["iPhone AI 升級週期", "Vision Pro v2"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(214.5, 0.03, 55),
  },
  {
    symbol: "NVDA", shortCode: "NVDA", name: "輝達", nameEn: "NVIDIA",
    sector: "半導體", market: "US", marketCap: 3.20,
    decision: {
      signal: "buy", score: 88,
      rationale: "Blackwell 供不應求，GB200 機櫃 ASP 較 H100 提升 3 倍。",
      risks: ["客戶集中", "地緣政治禁令"],
      catalysts: ["Q2 財報炸裂", "資料中心 capex 持續"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(132.8, 0.18, 66),
  },
  {
    symbol: "TSLA", shortCode: "TSLA", name: "特斯拉", nameEn: "Tesla",
    sector: "電動車", market: "US", marketCap: 0.98,
    decision: {
      signal: "sell", score: 36,
      rationale: "中國價格戰白熱化，Q1 交車數年減 8.5%，毛利率持續下滑。",
      risks: ["BYD 攻入歐美", "Cybertruck 滯銷"],
      catalysts: ["FSD v13 收費上路", "Robotaxi 揭幕"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(244.7, -0.08, 77),
  },
  {
    symbol: "MSFT", shortCode: "MSFT", name: "微軟", nameEn: "Microsoft",
    sector: "雲端運算", market: "US", marketCap: 3.10,
    decision: {
      signal: "buy", score: 79,
      rationale: "Azure AI 滲透加速，Copilot Pro 訂閱數突破 2,000 萬。",
      risks: ["OpenAI 關係不確定", "歐盟反壟斷"],
      catalysts: ["Q3 Azure 增速 30%+", "Copilot 企業價量齊揚"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(425.2, 0.04, 88),
  },

  // 🇭🇰 HK (2)
  {
    symbol: "0700.HK", shortCode: "0700", name: "騰訊", nameEn: "Tencent",
    sector: "網際網路", market: "HK", marketCap: 3.40,
    decision: {
      signal: "buy", score: 74,
      rationale: "微信小遊戲 + 小程序電商雙成長，混元大模型已具實際營收貢獻。",
      risks: ["遊戲版號政策", "美中網路監管"],
      catalysts: ["元寶 AI 變現", "Q1 廣告強勁"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(420.5, 0.07, 99),
  },
  {
    symbol: "9988.HK", shortCode: "9988", name: "阿里巴巴", nameEn: "Alibaba",
    sector: "網際網路", market: "HK", marketCap: 1.55,
    decision: {
      signal: "hold", score: 56,
      rationale: "雲業務轉盈，但電商市占被拼多多侵蝕，估值便宜但缺催化。",
      risks: ["拼多多 / TikTok 雙夾擊", "美股 ADR 退市疑慮"],
      catalysts: ["通義 AI Agent 上線", "回購持續"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(89.3, 0.01, 110),
  },

  // 🇨🇳 CN (2)
  {
    symbol: "600519.SS", shortCode: "600519", name: "貴州茅台", nameEn: "Kweichow Moutai",
    sector: "白酒", market: "CN", marketCap: 1.80,
    decision: {
      signal: "hold", score: 60,
      rationale: "通縮環境壓抑高端消費，但品牌護城河仍在，估值已合理。",
      risks: ["白酒消費下行", "限制 三公消費"],
      catalysts: ["雙十一年貨節需求", "出海戰略加速"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(1582, 0.02, 121),
  },
  {
    symbol: "000858.SZ", shortCode: "000858", name: "五糧液", nameEn: "Wuliangye",
    sector: "白酒", market: "CN", marketCap: 0.55,
    decision: {
      signal: "sell", score: 42,
      rationale: "庫存高、批價跌破出廠價，渠道信心受挫，技術面破位。",
      risks: ["渠道庫存高", "批價持續走弱"],
      catalysts: ["經銷商大會"],
      generatedAt: NOW,
    },
    spark30d: genSparkline(124.6, -0.06, 132),
  },
];

// ─── 真實資料 merge：用 snapshot 覆蓋 mock 的 decision / spark / quote ───────
//
// snapshot.json 由 `npm run refresh-data` 從 Yahoo + Gemma 4 真實生成。
// 若某檔沒在 snapshot 內 → 沿用上面的 mock。

export const PORTFOLIO: Stock[] = MOCK_PORTFOLIO.map((mock): Stock => {
  const cached = getCached(mock.symbol);

  // 真實 30 日 closes（從 OHLC 拿）
  const realCloses = cached.stock?.ohlc?.map((d) => d.close);

  // 真實 quote（snapshot 抓 Yahoo 的時點價格）
  const realQuote: Quote | undefined = cached.stock
    ? {
        price: cached.stock.regularMarketPrice,
        changePct:
          cached.stock.previousClose > 0
            ? ((cached.stock.regularMarketPrice - cached.stock.previousClose) /
                cached.stock.previousClose) *
              100
            : 0,
        prevClose: cached.stock.previousClose,
      }
    : undefined;

  // 真實 AI 決策（Gemma 4 真打）
  const realDecision: Decision | undefined = cached.ai
    ? {
        signal: cached.ai.signal,
        score: cached.ai.score,
        rationale: cached.ai.rationale,
        risks: cached.ai.risks,
        catalysts: cached.ai.catalysts,
        generatedAt: SNAPSHOT.refreshedAt,
      }
    : undefined;

  return {
    ...mock,
    decision: realDecision ?? mock.decision,
    spark30d: realCloses && realCloses.length >= 5 ? realCloses : mock.spark30d,
    quote: realQuote ?? mock.quote,
  };
});

/** 是否有任何即時資料 */
export const PORTFOLIO_IS_LIVE = hasSnapshot();

// ─── 派生工具 ─────────────────────────────────────

export function getStockBySymbol(symbol: string): Stock | undefined {
  return PORTFOLIO.find((s) => s.symbol === symbol);
}

export function stocksByMarket(market: Market): Stock[] {
  return PORTFOLIO.filter((s) => s.market === market);
}

export function bullishStocks(): Stock[] {
  return PORTFOLIO.filter((s) => s.decision.signal === "buy");
}

export function bearishStocks(): Stock[] {
  return PORTFOLIO.filter((s) => s.decision.signal === "sell");
}

export function portfolioHealth(): {
  avgScore: number;
  bullPct: number;
  bearPct: number;
} {
  const totalCap = PORTFOLIO.reduce((s, x) => s + x.marketCap, 0);
  const avgScore =
    PORTFOLIO.reduce((s, x) => s + x.decision.score * x.marketCap, 0) /
    totalCap;
  const bull = PORTFOLIO.filter((x) => x.decision.signal === "buy").length;
  const bear = PORTFOLIO.filter((x) => x.decision.signal === "sell").length;
  return {
    avgScore: Math.round(avgScore),
    bullPct: Math.round((bull / PORTFOLIO.length) * 100),
    bearPct: Math.round((bear / PORTFOLIO.length) * 100),
  };
}

/** 各市場聚合：avg change %、健康分、bull/bear */
export function marketAggregates() {
  return (Object.keys(MARKETS) as Market[]).map((m) => {
    const stocks = stocksByMarket(m);
    if (stocks.length === 0) {
      return { market: MARKETS[m], stocks: [], avgScore: 0, bullPct: 0, bearPct: 0, count: 0 };
    }
    const avgScore = Math.round(
      stocks.reduce((s, x) => s + x.decision.score, 0) / stocks.length,
    );
    const bull = stocks.filter((x) => x.decision.signal === "buy").length;
    const bear = stocks.filter((x) => x.decision.signal === "sell").length;
    return {
      market: MARKETS[m],
      stocks,
      avgScore,
      bullPct: Math.round((bull / stocks.length) * 100),
      bearPct: Math.round((bear / stocks.length) * 100),
      count: stocks.length,
    };
  });
}

export function allSymbols(): string[] {
  return PORTFOLIO.map((s) => s.symbol);
}
