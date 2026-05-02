/**
 * 11 種策略分析器 — 11 種策略分析器，對應內建 indicators 純函式
 *
 * 每個策略提供：
 *   - id / 中英文名稱 / 說明
 *   - 訊號決定函數（給定 mock 條件 → buy/hold/sell）
 *   - 顯示用 icon （lucide-react 對應）
 *
 * 用途：
 *   - Strategy Engine heatmap（11 策略 × 8 股票）
 *   - /api/analyze 的 strategy 參數驗證
 */

import type { LucideIcon } from "lucide-react";
import {
  TrendingUp, Activity, Layers, Waves, BarChart3, Target,
  Gauge, Sparkles, Shuffle, ShieldAlert, Compass,
} from "lucide-react";

import type { Signal, Stock } from "./portfolio";
import { getCached } from "./cached";

export type StrategyId =
  | "ma-trend"        // 均線多頭排列
  | "rsi-momentum"    // RSI 動能
  | "macd-cross"      // MACD 黃金交叉
  | "elliott-wave"    // 艾略特波浪
  | "volume-profile"  // 籌碼分布
  | "bollinger-band"  // 布林通道
  | "vwap-reversion"  // VWAP 均值回歸
  | "news-sentiment"  // 新聞情緒
  | "sector-rotation" // 類股輪動
  | "risk-overlay"    // 風險疊加（VaR / 波動率）
  | "consensus";      // 多策略共識

export interface Strategy {
  id: StrategyId;
  nameZh: string;
  nameEn: string;
  /** 技術詞彙、長版（heatmap tooltip 用，給有經驗的人看）*/
  description: string;
  /** 白話小學生版（卡片內 hover tooltip 用，1-2 句話）*/
  simpleDesc: string;
  icon: LucideIcon;
  /** 是否技術面（true）/ 基本面or其他（false）*/
  technical: boolean;
}

export const STRATEGIES: Strategy[] = [
  {
    id: "ma-trend",
    nameZh: "均線多頭",
    nameEn: "MA Trend",
    description: "20/60/120 日均線多頭排列偵測，找出長期趨勢轉強股票。",
    simpleDesc: "看股價最近一陣子是「往上走」還是「往下走」。如果短期均價已經爬到長期均價上面，就算往上走。",
    icon: TrendingUp,
    technical: true,
  },
  {
    id: "rsi-momentum",
    nameZh: "RSI 動能",
    nameEn: "RSI Momentum",
    description: "14 日 RSI 突破 50 + 上彎判定動能轉強，>70 警示過熱。",
    simpleDesc: "看股票「跑的快不快」。分數 0-100：超過 70 表示太熱可能會喘氣休息，低於 30 表示太冷可能反彈。",
    icon: Activity,
    technical: true,
  },
  {
    id: "macd-cross",
    nameZh: "MACD 黃金交叉",
    nameEn: "MACD Crossover",
    description: "DIF 上穿 DEA 形成黃金交叉，搭配柱狀圖紅黑由負轉正。",
    simpleDesc: "兩條線的賽跑：當「快線」追過「慢線」往上爬，叫黃金交叉，常被當買進訊號。",
    icon: Layers,
    technical: true,
  },
  {
    id: "elliott-wave",
    nameZh: "艾略特波浪",
    nameEn: "Elliott Wave",
    description: "辨識 5 波推動 + 3 波修正結構，標記目前所處波次與目標價。",
    simpleDesc: "把股價走勢看成海浪：5 個往上推 + 3 個往下修正。看現在在哪一波，預測下一波。",
    icon: Waves,
    technical: true,
  },
  {
    id: "volume-profile",
    nameZh: "籌碼分布",
    nameEn: "Volume Profile",
    description: "切價量分布 POC、VAH、VAL，找籌碼密集套牢區與支撐。",
    simpleDesc: "看哪個價位有最多人買賣過。那個價位通常就是「卡關處」，股價碰到容易停下來。",
    icon: BarChart3,
    technical: true,
  },
  {
    id: "bollinger-band",
    nameZh: "布林通道",
    nameEn: "Bollinger Band",
    description: "20 日 ±2σ 通道；突破上軌動能、跌破下軌超賣，搭配窄縮判斷波動。",
    simpleDesc: "畫上下兩條跑道線。股價貼到上線可能太貴，貼到下線可能太便宜，跑道變窄就快爆動。",
    icon: Target,
    technical: true,
  },
  {
    id: "vwap-reversion",
    nameZh: "VWAP 回歸",
    nameEn: "VWAP Reversion",
    description: "成交量加權均價回歸交易；偏離過大時逆勢、回到 VWAP 後續勢。",
    simpleDesc: "今日「平均成交價」是大家認可的合理價。離太遠通常會回來；剛回到平均線上時是好上車點。",
    icon: Gauge,
    technical: true,
  },
  {
    id: "news-sentiment",
    nameZh: "新聞情緒",
    nameEn: "News Sentiment",
    description: "彙整 24 小時內新聞 + 法說會內容，LLM 計算情緒分數 (-1 ~ +1)。",
    simpleDesc: "AI 把 24 小時新聞讀完，算出市場是「開心」還是「擔心」。分數 -1（很糟）到 +1（很好）。",
    icon: Sparkles,
    technical: false,
  },
  {
    id: "sector-rotation",
    nameZh: "類股輪動",
    nameEn: "Sector Rotation",
    description: "分析資金近 5/10/20 日類股輪動，標記強勢類股與弱勢類股。",
    simpleDesc: "錢會流動：今天買半導體，明天買金融股。看錢正在流向哪個產業，那個產業通常會比較強。",
    icon: Shuffle,
    technical: false,
  },
  {
    id: "risk-overlay",
    nameZh: "風險疊加",
    nameEn: "Risk Overlay",
    description: "VaR + 歷史波動率，動態調整訊號強度，高風險時降級訊號。",
    simpleDesc: "看股價「跳得多劇烈」。跳很大 = 風險高，這時就算其他訊號是買進，也會打折保守一點。",
    icon: ShieldAlert,
    technical: false,
  },
  {
    id: "consensus",
    nameZh: "多策略共識",
    nameEn: "Strategy Consensus",
    description: "整合上述 10 個策略，加權投票得出最終決策（多數決 + 信心 *score）。",
    simpleDesc: "把上面 10 種方法投票表決，多數同意才下決定。比一個人決定可靠。",
    icon: Compass,
    technical: false,
  },
];

// ─── 策略 × 股票訊號矩陣（mock，但要看起來合理）──────────────────

/**
 * 給定一檔股票 + 策略 → mock 訊號
 *
 * 邏輯：基於股票本身的 decision 主訊號，加上策略 id 的「個性」（有的策略偏多有的偏空），
 * 加 deterministic 雜訊讓矩陣看起來不會一行全綠或全紅，但又跟整體決策一致。
 */
export function getStrategySignal(
  stock: Stock,
  strategyId: StrategyId,
): { signal: Signal; score: number } {
  // ─── 優先用 snapshot 的真實計算結果 ─────────
  const cached = getCached(stock.symbol).strategies?.[strategyId];
  if (cached) {
    return { signal: cached.signal, score: Math.round(cached.score) };
  }

  // ─── Fallback：deterministic mock（snapshot 不存在時）─────
  const seed = hashCode(stock.shortCode + strategyId);
  const noise = (seed % 30) - 15; // -15 ~ +14

  // 策略個性偏移
  const strategyBias: Record<StrategyId, number> = {
    "ma-trend": 5,           // 偏多
    "rsi-momentum": 0,
    "macd-cross": 3,
    "elliott-wave": -2,
    "volume-profile": 0,
    "bollinger-band": -3,
    "vwap-reversion": -5,    // 偏空（找回歸機會）
    "news-sentiment": 8,     // 通常偏多（新聞放大效應）
    "sector-rotation": 0,
    "risk-overlay": -8,      // 風險疊加 → 降級
    "consensus": 0,          // 共識：等於主決策
  };

  let score = stock.decision.score + (strategyBias[strategyId] ?? 0) + noise;
  score = Math.max(0, Math.min(100, score));

  // 共識策略 → 直接用主訊號
  if (strategyId === "consensus") {
    return { signal: stock.decision.signal, score: stock.decision.score };
  }

  // 其他策略：score 推算 signal
  let signal: Signal;
  if (score >= 65) signal = "buy";
  else if (score <= 40) signal = "sell";
  else signal = "hold";

  return { signal, score: Math.round(score) };
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getStrategyById(id: StrategyId): Strategy | undefined {
  return STRATEGIES.find((s) => s.id === id);
}

export function technicalStrategies(): Strategy[] {
  return STRATEGIES.filter((s) => s.technical);
}

export function fundamentalStrategies(): Strategy[] {
  return STRATEGIES.filter((s) => !s.technical);
}
