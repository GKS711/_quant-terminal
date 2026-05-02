/**
 * Extended universe — 擴充標的池（50 檔）
 *
 * 為什麼不是 500：
 *   - Yahoo Finance v8 對單 IP 嚴格限流（12 檔抓 1 分鐘已是極限）
 *   - 真正抓 500 需要 paid API（FMP / Alpha Vantage Premium / Twelve Data Pro）
 *   - 後端 _quant-terminal 設定可隨意改 STOCK_LIST 但前端展示 50 已夠視覺
 *
 * 為什麼有意義：
 *   - 主頁 12 檔精選 = AI 重點分析、有 sparkline / 完整 11 策略 / Gemma rationale
 *   - /markets 頁 50 檔 = 擴充瀏覽，只有靜態 metadata + sector + 簡單訊號
 */

import type { Market, SectorTag } from "./portfolio";

export interface ExtendedStock {
  symbol: string;
  shortCode: string;
  name: string;
  market: Market;
  sector: string; // 用 string 而非 SectorTag，extended 涵蓋更多產業
  marketCap: number; // 兆當地幣
}

export const EXTENDED_UNIVERSE: ExtendedStock[] = [
  // 🇹🇼 台股（15）
  { symbol: "2330.TW", shortCode: "2330", name: "台積電",       market: "TW", sector: "半導體",     marketCap: 25.4 },
  { symbol: "2454.TW", shortCode: "2454", name: "聯發科",       market: "TW", sector: "半導體",     marketCap: 2.3 },
  { symbol: "2317.TW", shortCode: "2317", name: "鴻海",         market: "TW", sector: "電子代工",   marketCap: 2.6 },
  { symbol: "0050.TW", shortCode: "0050", name: "元大台灣 50",  market: "TW", sector: "ETF",       marketCap: 0.55 },
  { symbol: "2308.TW", shortCode: "2308", name: "台達電",       market: "TW", sector: "電子零組件", marketCap: 1.05 },
  { symbol: "2382.TW", shortCode: "2382", name: "廣達",         market: "TW", sector: "電子代工",   marketCap: 1.32 },
  { symbol: "2303.TW", shortCode: "2303", name: "聯電",         market: "TW", sector: "半導體",     marketCap: 0.71 },
  { symbol: "2891.TW", shortCode: "2891", name: "中信金",       market: "TW", sector: "金融",       marketCap: 0.65 },
  { symbol: "2412.TW", shortCode: "2412", name: "中華電",       market: "TW", sector: "電信",       marketCap: 0.9 },
  { symbol: "1303.TW", shortCode: "1303", name: "南亞",         market: "TW", sector: "塑化",       marketCap: 0.4 },
  { symbol: "1216.TW", shortCode: "1216", name: "統一",         market: "TW", sector: "食品",       marketCap: 0.46 },
  { symbol: "00878.TW", shortCode: "00878", name: "國泰永續高股息", market: "TW", sector: "ETF",   marketCap: 0.32 },
  { symbol: "00919.TW", shortCode: "00919", name: "群益台灣精選高息", market: "TW", sector: "ETF", marketCap: 0.18 },
  { symbol: "3008.TW", shortCode: "3008", name: "大立光",       market: "TW", sector: "光電",       marketCap: 0.42 },
  { symbol: "3037.TW", shortCode: "3037", name: "欣興",         market: "TW", sector: "電子零組件", marketCap: 0.27 },

  // 🇺🇸 美股（15）
  { symbol: "AAPL",    shortCode: "AAPL",  name: "Apple",        market: "US", sector: "消費電子",   marketCap: 3.55 },
  { symbol: "NVDA",    shortCode: "NVDA",  name: "NVIDIA",       market: "US", sector: "半導體",     marketCap: 3.20 },
  { symbol: "MSFT",    shortCode: "MSFT",  name: "Microsoft",    market: "US", sector: "雲端運算",   marketCap: 3.10 },
  { symbol: "GOOGL",   shortCode: "GOOGL", name: "Alphabet",     market: "US", sector: "網際網路",   marketCap: 2.30 },
  { symbol: "AMZN",    shortCode: "AMZN",  name: "Amazon",       market: "US", sector: "電商雲端",   marketCap: 2.10 },
  { symbol: "META",    shortCode: "META",  name: "Meta",         market: "US", sector: "網際網路",   marketCap: 1.45 },
  { symbol: "TSLA",    shortCode: "TSLA",  name: "Tesla",        market: "US", sector: "電動車",     marketCap: 0.98 },
  { symbol: "BRK-B",   shortCode: "BRK-B", name: "Berkshire",    market: "US", sector: "金融",       marketCap: 0.95 },
  { symbol: "JPM",     shortCode: "JPM",   name: "JPMorgan",     market: "US", sector: "金融",       marketCap: 0.65 },
  { symbol: "AVGO",    shortCode: "AVGO",  name: "Broadcom",     market: "US", sector: "半導體",     marketCap: 0.95 },
  { symbol: "AMD",     shortCode: "AMD",   name: "AMD",          market: "US", sector: "半導體",     marketCap: 0.27 },
  { symbol: "NFLX",    shortCode: "NFLX",  name: "Netflix",      market: "US", sector: "媒體",       marketCap: 0.32 },
  { symbol: "JNJ",     shortCode: "JNJ",   name: "Johnson&Johnson", market: "US", sector: "醫療",   marketCap: 0.40 },
  { symbol: "V",       shortCode: "V",     name: "Visa",         market: "US", sector: "支付",       marketCap: 0.62 },
  { symbol: "WMT",     shortCode: "WMT",   name: "Walmart",      market: "US", sector: "零售",       marketCap: 0.66 },

  // 🇭🇰 港股（10）
  { symbol: "0700.HK", shortCode: "0700", name: "騰訊",         market: "HK", sector: "網際網路",   marketCap: 3.40 },
  { symbol: "9988.HK", shortCode: "9988", name: "阿里巴巴",     market: "HK", sector: "網際網路",   marketCap: 1.55 },
  { symbol: "3690.HK", shortCode: "3690", name: "美團",         market: "HK", sector: "網際網路",   marketCap: 0.78 },
  { symbol: "1810.HK", shortCode: "1810", name: "小米",         market: "HK", sector: "消費電子",   marketCap: 0.55 },
  { symbol: "9618.HK", shortCode: "9618", name: "京東",         market: "HK", sector: "電商",       marketCap: 0.42 },
  { symbol: "0941.HK", shortCode: "0941", name: "中國移動",     market: "HK", sector: "電信",       marketCap: 1.30 },
  { symbol: "0939.HK", shortCode: "0939", name: "建設銀行",     market: "HK", sector: "金融",       marketCap: 1.20 },
  { symbol: "1299.HK", shortCode: "1299", name: "友邦保險",     market: "HK", sector: "保險",       marketCap: 0.55 },
  { symbol: "2318.HK", shortCode: "2318", name: "中國平安",     market: "HK", sector: "保險",       marketCap: 0.85 },
  { symbol: "2382.HK", shortCode: "2382", name: "舜宇光學",     market: "HK", sector: "光電",       marketCap: 0.06 },

  // 🇨🇳 A 股（10）
  { symbol: "600519.SS", shortCode: "600519", name: "貴州茅台", market: "CN", sector: "白酒",       marketCap: 1.80 },
  { symbol: "000858.SZ", shortCode: "000858", name: "五糧液",   market: "CN", sector: "白酒",       marketCap: 0.55 },
  { symbol: "601318.SS", shortCode: "601318", name: "中國平安", market: "CN", sector: "保險",       marketCap: 0.95 },
  { symbol: "600036.SS", shortCode: "600036", name: "招商銀行", market: "CN", sector: "金融",       marketCap: 0.92 },
  { symbol: "300750.SZ", shortCode: "300750", name: "寧德時代", market: "CN", sector: "電動車",     marketCap: 1.06 },
  { symbol: "002415.SZ", shortCode: "002415", name: "海康威視", market: "CN", sector: "安控",       marketCap: 0.30 },
  { symbol: "601012.SS", shortCode: "601012", name: "隆基綠能", market: "CN", sector: "太陽能",     marketCap: 0.18 },
  { symbol: "000001.SZ", shortCode: "000001", name: "平安銀行", market: "CN", sector: "金融",       marketCap: 0.21 },
  { symbol: "600276.SS", shortCode: "600276", name: "恆瑞醫藥", market: "CN", sector: "醫療",       marketCap: 0.30 },
  { symbol: "601888.SS", shortCode: "601888", name: "中國中免", market: "CN", sector: "零售",       marketCap: 0.36 },
];

export const EXTENDED_TOTAL = EXTENDED_UNIVERSE.length;
