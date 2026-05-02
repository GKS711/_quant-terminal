/**
 * 快照資料整合層 — 從 build 時產生的 snapshot.json 讀真實資料
 *
 * 跑 `npm run refresh-data` 會重新抓 Yahoo + Gemma + News，更新此 snapshot。
 *
 * 在 portfolio.ts / strategy 函式 / news component 內 merge 進 mock fallback：
 *   - snapshot 存在 → 用真實
 *   - snapshot 不存在 / 缺某欄 → 用 mock
 */

import snapshot from "./snapshot.json";

export interface CachedSnapshot {
  refreshedAt: string;
  stocks: Record<string, {
    symbol: string;
    currency: string;
    longName: string;
    regularMarketPrice: number;
    previousClose: number;
    ohlc: Array<{
      time: number; open: number; high: number; low: number; close: number; volume: number;
    }>;
  }>;
  strategies: Record<string, Record<string, {
    signal: "buy" | "hold" | "sell";
    score: number;
    detail: string;
  }>>;
  aiDecisions: Record<string, {
    signal: "buy" | "hold" | "sell";
    score: number;
    rationale: string;
    risks: string[];
    catalysts: string[];
  }>;
  news: Array<{
    uuid: string;
    title: string;
    link: string;
    publisher: string;
    providerPublishTime: number;
    relatedTickers: string[];
  }>;
}

export const SNAPSHOT = snapshot as unknown as CachedSnapshot;

/** 是否有真實 snapshot（不是空殼）*/
export function hasSnapshot(): boolean {
  return Object.keys(SNAPSHOT.stocks ?? {}).length > 0;
}

/** snapshot age in hours */
export function snapshotAgeHours(): number {
  if (!SNAPSHOT.refreshedAt) return 99999;
  return (Date.now() - new Date(SNAPSHOT.refreshedAt).getTime()) / (1000 * 60 * 60);
}

/** 取一檔股票的真實資料（如果有） */
export function getCached(symbol: string) {
  const stock = SNAPSHOT.stocks?.[symbol];
  const strategies = SNAPSHOT.strategies?.[symbol];
  const ai = SNAPSHOT.aiDecisions?.[symbol];
  return { stock, strategies, ai };
}

/** 取真實 30 日收盤價序列 */
export function getCachedCloses(symbol: string): number[] | null {
  const ohlc = SNAPSHOT.stocks?.[symbol]?.ohlc;
  if (!ohlc || ohlc.length === 0) return null;
  return ohlc.map((d) => d.close);
}
