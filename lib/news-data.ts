/**
 * 新聞 mock data — 模擬 _quant-terminal 系統用 Tavily / SerpAPI 抓的 24h 新聞
 *
 * 真實版可改成 fetch /api/news 路由（裡面接 Tavily / SerpAPI）
 *
 * 情緒分數 -1 ~ +1：
 *   > 0.5  強多
 *   0.2 - 0.5 偏多
 *   -0.2 - 0.2 中性
 *   -0.5 - -0.2 偏空
 *   < -0.5 強空
 */

export type SentimentLevel = "strong_bull" | "bull" | "neutral" | "bear" | "strong_bear";

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string; // ISO
  hoursAgo: number;
  symbols: string[];
  sentiment: number;       // -1 ~ +1
  sentimentLevel: SentimentLevel;
  summary: string;
  url?: string;
}

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "NVIDIA Q1 法說：Blackwell 全面供不應求，2026 H2 ASP 將再上修",
    source: "Reuters",
    publishedAt: "2026-04-26T22:30:00+08:00",
    hoursAgo: 1,
    symbols: ["NVDA", "2330", "2317", "2308"],
    sentiment: 0.82,
    sentimentLevel: "strong_bull",
    summary: "黃仁勳預期 GB200 機櫃 ASP 較 H100 提升 3 倍，台積電 / 鴻海 / 台達電同步受惠。",
  },
  {
    id: "n2",
    title: "聯準會主席鮑爾：6 月可能再降息一碼，全球風險資產普漲",
    source: "Bloomberg",
    publishedAt: "2026-04-26T18:00:00+08:00",
    hoursAgo: 5,
    symbols: ["AAPL", "MSFT", "0050", "9988"],
    sentiment: 0.64,
    sentimentLevel: "bull",
    summary: "市場 fed funds futures 暗示 6 月降息機率升至 78%，科技股估值有撐。",
  },
  {
    id: "n3",
    title: "騰訊元寶 AI 月活突破 5,000 萬，混元大模型開始實質貢獻營收",
    source: "南華早報",
    publishedAt: "2026-04-26T14:20:00+08:00",
    hoursAgo: 9,
    symbols: ["0700"],
    sentiment: 0.71,
    sentimentLevel: "strong_bull",
    summary: "Q1 預估 AI 相關產品貢獻營收 12 億美元，廣告 + 小遊戲 + 雲三引擎齊發。",
  },
  {
    id: "n4",
    title: "Tesla 中國 Q1 交車年減 8.5%，比亞迪市占首次超越 Model Y",
    source: "Wall Street Journal",
    publishedAt: "2026-04-26T11:45:00+08:00",
    hoursAgo: 12,
    symbols: ["TSLA"],
    sentiment: -0.58,
    sentimentLevel: "strong_bear",
    summary: "Cybertruck 美國滯銷、Model Y 中國被夾擊，分析師下修目標價至 $220。",
  },
  {
    id: "n5",
    title: "美中科技戰升級：傳新一輪先進製程出口管制清單將公布",
    source: "Financial Times",
    publishedAt: "2026-04-26T08:00:00+08:00",
    hoursAgo: 16,
    symbols: ["2330", "NVDA", "2454"],
    sentiment: -0.42,
    sentimentLevel: "bear",
    summary: "傳將擴大限制 3nm/2nm 對中出貨，但分析師認為實質衝擊 < 5% 營收。",
  },
  {
    id: "n6",
    title: "中國央行：Q1 外匯儲備 3.21 兆美元，創 9 年新高",
    source: "CNBC",
    publishedAt: "2026-04-26T07:30:00+08:00",
    hoursAgo: 16,
    symbols: ["600519", "9988"],
    sentiment: 0.18,
    sentimentLevel: "neutral",
    summary: "外匯儲備穩健 + 人民幣維持 7.10 - 7.20 區間，有助消費類股估值修復。",
  },
];

export function sentimentColor(level: SentimentLevel): string {
  switch (level) {
    case "strong_bull": return "#10b981";
    case "bull":        return "#6FC298";
    case "neutral":     return "#a8a8a8";
    case "bear":        return "#F59E0B";
    case "strong_bear": return "#E5484D";
  }
}
export function sentimentLabel(level: SentimentLevel): string {
  return ({
    strong_bull: "強多",
    bull: "偏多",
    neutral: "中性",
    bear: "偏空",
    strong_bear: "強空",
  } as Record<SentimentLevel, string>)[level];
}
