/**
 * Stock route helpers — 把 internal Yahoo symbol（"2330.TW"）對應到 URL slug（/tw/2330）
 *
 * 為什麼 URL 不直接用 Yahoo 格式：
 *   - "2330.TW" 含 dot，URL 看起來雜
 *   - "AAPL" 沒 market 前綴 → 模糊（理論上 AAPL 也可能是其他市場）
 *   - SEO：market-prefixed 對 Google 更友善（明確分類）
 */

import { PORTFOLIO, type Stock, type Market } from "./portfolio";

export interface StockRoute {
  market: Lowercase<Market>; // "tw" | "us" | "hk" | "cn"
  slug: string;              // "2330" | "nvda" | "0700" | "600519"
}

export function symbolToRoute(symbol: string): StockRoute | null {
  const stock = PORTFOLIO.find((s) => s.symbol === symbol);
  if (!stock) return null;
  return {
    market: stock.market.toLowerCase() as Lowercase<Market>,
    slug: stock.shortCode.toLowerCase(),
  };
}

export function routeToStock(market: string, slug: string): Stock | null {
  const m = market.toUpperCase() as Market;
  const s = slug.toUpperCase();
  return (
    PORTFOLIO.find(
      (st) => st.market === m && st.shortCode.toUpperCase() === s,
    ) ?? null
  );
}

/** 給 generateStaticParams 用 */
export function allStockRoutes(): StockRoute[] {
  return PORTFOLIO.map((s) => ({
    market: s.market.toLowerCase() as Lowercase<Market>,
    slug: s.shortCode.toLowerCase(),
  }));
}

/**
 * Related stocks — 給定一檔股票，回傳：
 *   1. 同市場同產業（最多 2 檔）
 *   2. 跨市場同產業（最多 2 檔）
 *   3. AI 最相似（同 signal + 接近 score）（最多 2 檔）
 * 去重後最多 4-5 檔
 */
export function getRelated(stock: Stock, limit = 5): Stock[] {
  const candidates: Array<{ s: Stock; weight: number }> = [];

  for (const s of PORTFOLIO) {
    if (s.symbol === stock.symbol) continue;
    let weight = 0;
    if (s.market === stock.market && s.sector === stock.sector) weight += 5;
    if (s.market !== stock.market && s.sector === stock.sector) weight += 3;
    if (s.decision.signal === stock.decision.signal) weight += 1;
    if (Math.abs(s.decision.score - stock.decision.score) < 10) weight += 1;
    if (weight > 0) candidates.push({ s, weight });
  }

  candidates.sort((a, b) => b.weight - a.weight);
  return candidates.slice(0, limit).map((c) => c.s);
}

/** 給 nice URL build 用 */
export function buildStockUrl(stock: Stock): string {
  return `/${stock.market.toLowerCase()}/${stock.shortCode.toLowerCase()}`;
}
