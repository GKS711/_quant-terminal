/**
 * Extended Universe — 全球市場雷達 100 檔
 *
 * v2 設計：
 *   - Tier 1（前 12 檔精選）：portfolio.ts 全完整 OHLC + 11 策略 + Gemma AI decision
 *   - Tier 2（擴充 88 檔）：本檔 metadata only，sector scanner 用，點開即時抓 (/api/refresh-stock)
 *
 * 5 國分布：TW 20 / US 40 / HK 15 / CN 15 / JP 10 = 100
 *
 * 為什麼不是 500：
 *   - Yahoo Finance v8 對單 IP 嚴格限流（100 檔抓 ~10 分鐘）
 *   - Gemma free tier 可承載（gemma-3-27b RPD 14.4k vs 100 檔 << 限額）
 *   - 但全部 build-time 抓 ~15-20 分鐘嫌長，Tier 2 改即時抓更靈活
 *   - V3 可擴 500 檔（要分批 refresh + KV 快取）
 */

import type { Market } from "./portfolio";

export interface ExtendedStock {
  symbol: string;
  shortCode: string;
  name: string;
  market: Market;
  sector: string;
  marketCap: number; // 兆當地幣（粗估）
}

export const EXTENDED_UNIVERSE: ExtendedStock[] = [
  // ════════════════ 🇹🇼 台股 20 ════════════════
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
  { symbol: "2002.TW", shortCode: "2002", name: "中鋼",         market: "TW", sector: "鋼鐵",       marketCap: 0.36 },
  { symbol: "2603.TW", shortCode: "2603", name: "長榮",         market: "TW", sector: "海運",       marketCap: 0.45 },
  { symbol: "2882.TW", shortCode: "2882", name: "國泰金",       market: "TW", sector: "金融",       marketCap: 0.81 },
  { symbol: "2912.TW", shortCode: "2912", name: "統一超",       market: "TW", sector: "零售",       marketCap: 0.32 },
  { symbol: "0056.TW", shortCode: "0056", name: "元大高股息",   market: "TW", sector: "ETF",       marketCap: 0.30 },

  // ════════════════ 🇺🇸 美股 40 ════════════════
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
  { symbol: "MA",      shortCode: "MA",    name: "Mastercard",   market: "US", sector: "支付",       marketCap: 0.43 },
  { symbol: "UNH",     shortCode: "UNH",   name: "UnitedHealth", market: "US", sector: "醫療",       marketCap: 0.50 },
  { symbol: "XOM",     shortCode: "XOM",   name: "Exxon Mobil",  market: "US", sector: "能源",       marketCap: 0.51 },
  { symbol: "ORCL",    shortCode: "ORCL",  name: "Oracle",       market: "US", sector: "雲端運算",   marketCap: 0.45 },
  { symbol: "PG",      shortCode: "PG",    name: "Procter&Gamble", market: "US", sector: "消費品",  marketCap: 0.40 },
  { symbol: "HD",      shortCode: "HD",    name: "Home Depot",   market: "US", sector: "零售",       marketCap: 0.35 },
  { symbol: "BAC",     shortCode: "BAC",   name: "Bank of America", market: "US", sector: "金融",   marketCap: 0.32 },
  { symbol: "ABBV",    shortCode: "ABBV",  name: "AbbVie",       market: "US", sector: "醫療",       marketCap: 0.32 },
  { symbol: "KO",      shortCode: "KO",    name: "Coca-Cola",    market: "US", sector: "食品",       marketCap: 0.27 },
  { symbol: "PEP",     shortCode: "PEP",   name: "PepsiCo",      market: "US", sector: "食品",       marketCap: 0.23 },
  { symbol: "COST",    shortCode: "COST",  name: "Costco",       market: "US", sector: "零售",       marketCap: 0.40 },
  { symbol: "CRM",     shortCode: "CRM",   name: "Salesforce",   market: "US", sector: "雲端運算",   marketCap: 0.30 },
  { symbol: "ADBE",    shortCode: "ADBE",  name: "Adobe",        market: "US", sector: "軟體",       marketCap: 0.25 },
  { symbol: "DIS",     shortCode: "DIS",   name: "Disney",       market: "US", sector: "媒體",       marketCap: 0.20 },
  { symbol: "MCD",     shortCode: "MCD",   name: "McDonald's",   market: "US", sector: "餐飲",       marketCap: 0.21 },
  { symbol: "PYPL",    shortCode: "PYPL",  name: "PayPal",       market: "US", sector: "支付",       marketCap: 0.07 },
  { symbol: "UBER",    shortCode: "UBER",  name: "Uber",         market: "US", sector: "共享經濟",   marketCap: 0.13 },
  { symbol: "SHOP",    shortCode: "SHOP",  name: "Shopify",      market: "US", sector: "電商雲端",   marketCap: 0.13 },
  { symbol: "INTC",    shortCode: "INTC",  name: "Intel",        market: "US", sector: "半導體",     marketCap: 0.10 },
  { symbol: "QCOM",    shortCode: "QCOM",  name: "Qualcomm",     market: "US", sector: "半導體",     marketCap: 0.18 },
  { symbol: "TXN",     shortCode: "TXN",   name: "Texas Instruments", market: "US", sector: "半導體", marketCap: 0.18 },
  { symbol: "SPY",     shortCode: "SPY",   name: "S&P 500 ETF",  market: "US", sector: "ETF",       marketCap: 0.55 },
  { symbol: "QQQ",     shortCode: "QQQ",   name: "Nasdaq 100 ETF", market: "US", sector: "ETF",     marketCap: 0.30 },
  { symbol: "VOO",     shortCode: "VOO",   name: "Vanguard S&P 500", market: "US", sector: "ETF",   marketCap: 0.45 },
  { symbol: "IWM",     shortCode: "IWM",   name: "Russell 2000 ETF", market: "US", sector: "ETF",   marketCap: 0.06 },

  // ════════════════ 🇭🇰 港股 15 ════════════════
  { symbol: "0700.HK", shortCode: "0700", name: "騰訊",         market: "HK", sector: "網際網路",   marketCap: 4.5 },
  { symbol: "9988.HK", shortCode: "9988", name: "阿里巴巴",     market: "HK", sector: "電商雲端",   marketCap: 1.8 },
  { symbol: "0941.HK", shortCode: "0941", name: "中國移動",     market: "HK", sector: "電信",       marketCap: 1.6 },
  { symbol: "0939.HK", shortCode: "0939", name: "建設銀行",     market: "HK", sector: "金融",       marketCap: 1.5 },
  { symbol: "2318.HK", shortCode: "2318", name: "中國平安",     market: "HK", sector: "保險",       marketCap: 0.85 },
  { symbol: "3690.HK", shortCode: "3690", name: "美團",         market: "HK", sector: "電商雲端",   marketCap: 0.92 },
  { symbol: "0005.HK", shortCode: "0005", name: "匯豐控股",     market: "HK", sector: "金融",       marketCap: 1.20 },
  { symbol: "2628.HK", shortCode: "2628", name: "中國人壽",     market: "HK", sector: "保險",       marketCap: 0.55 },
  { symbol: "0388.HK", shortCode: "0388", name: "香港交易所",   market: "HK", sector: "金融",       marketCap: 0.45 },
  { symbol: "9618.HK", shortCode: "9618", name: "京東",         market: "HK", sector: "電商雲端",   marketCap: 0.48 },
  { symbol: "1024.HK", shortCode: "1024", name: "快手",         market: "HK", sector: "媒體",       marketCap: 0.27 },
  { symbol: "1398.HK", shortCode: "1398", name: "工商銀行",     market: "HK", sector: "金融",       marketCap: 1.85 },
  { symbol: "2018.HK", shortCode: "2018", name: "瑞聲科技",     market: "HK", sector: "電子零組件", marketCap: 0.06 },
  { symbol: "1810.HK", shortCode: "1810", name: "小米集團",     market: "HK", sector: "消費電子",   marketCap: 0.65 },
  { symbol: "2899.HK", shortCode: "2899", name: "紫金礦業",     market: "HK", sector: "原物料",     marketCap: 0.55 },

  // ════════════════ 🇨🇳 A 股 15 ════════════════
  { symbol: "600519.SS", shortCode: "600519", name: "貴州茅台", market: "CN", sector: "白酒",       marketCap: 2.0 },
  { symbol: "000858.SZ", shortCode: "000858", name: "五糧液",   market: "CN", sector: "白酒",       marketCap: 0.85 },
  { symbol: "600036.SS", shortCode: "600036", name: "招商銀行", market: "CN", sector: "金融",       marketCap: 0.95 },
  { symbol: "601318.SS", shortCode: "601318", name: "中國平安", market: "CN", sector: "保險",       marketCap: 0.82 },
  { symbol: "600276.SS", shortCode: "600276", name: "恆瑞醫藥", market: "CN", sector: "生技醫藥",   marketCap: 0.40 },
  { symbol: "000333.SZ", shortCode: "000333", name: "美的集團", market: "CN", sector: "消費電子",   marketCap: 0.55 },
  { symbol: "601398.SS", shortCode: "601398", name: "工商銀行 A", market: "CN", sector: "金融",     marketCap: 1.85 },
  { symbol: "000725.SZ", shortCode: "000725", name: "京東方 A", market: "CN", sector: "光電",       marketCap: 0.18 },
  { symbol: "000651.SZ", shortCode: "000651", name: "格力電器", market: "CN", sector: "消費電子",   marketCap: 0.25 },
  { symbol: "600585.SS", shortCode: "600585", name: "海螺水泥", market: "CN", sector: "原物料",     marketCap: 0.13 },
  { symbol: "300750.SZ", shortCode: "300750", name: "寧德時代", market: "CN", sector: "電動車",     marketCap: 1.12 },
  { symbol: "002594.SZ", shortCode: "002594", name: "比亞迪",   market: "CN", sector: "電動車",     marketCap: 0.86 },
  { symbol: "601012.SS", shortCode: "601012", name: "隆基綠能", market: "CN", sector: "綠能",       marketCap: 0.18 },
  { symbol: "600030.SS", shortCode: "600030", name: "中信證券", market: "CN", sector: "金融",       marketCap: 0.32 },
  { symbol: "601888.SS", shortCode: "601888", name: "中國中免", market: "CN", sector: "零售",       marketCap: 0.19 },

  // ════════════════ 🇯🇵 日股 10 ════════════════
  { symbol: "7203.T",  shortCode: "7203",  name: "豐田汽車",     market: "JP", sector: "汽車",       marketCap: 35.0 },
  { symbol: "6758.T",  shortCode: "6758",  name: "索尼集團",     market: "JP", sector: "消費電子",   marketCap: 14.5 },
  { symbol: "9984.T",  shortCode: "9984",  name: "軟銀集團",     market: "JP", sector: "投資",       marketCap: 12.0 },
  { symbol: "8306.T",  shortCode: "8306",  name: "三菱日聯金融", market: "JP", sector: "金融",       marketCap: 18.2 },
  { symbol: "6098.T",  shortCode: "6098",  name: "Recruit",      market: "JP", sector: "人力資源",   marketCap: 14.8 },
  { symbol: "6861.T",  shortCode: "6861",  name: "基恩士",       market: "JP", sector: "工業自動化", marketCap: 17.0 },
  { symbol: "7974.T",  shortCode: "7974",  name: "任天堂",       market: "JP", sector: "遊戲",       marketCap: 11.5 },
  { symbol: "9432.T",  shortCode: "9432",  name: "NTT",          market: "JP", sector: "電信",       marketCap: 14.5 },
  { symbol: "8035.T",  shortCode: "8035",  name: "東京電子",     market: "JP", sector: "半導體",     marketCap: 14.0 },
  { symbol: "9983.T",  shortCode: "9983",  name: "迅銷 (UNIQLO)", market: "JP", sector: "零售",      marketCap: 16.0 },
];

/** Tier 1：前 80 檔（建議 build-time refresh 抓 OHLC + AI decision） */
export const TIER1_SYMBOLS = EXTENDED_UNIVERSE.slice(0, 80).map((s) => s.symbol);

/** Tier 2：剩餘 20 檔（metadata only，前端點開即時抓 /api/refresh-stock） */
export const TIER2_SYMBOLS = EXTENDED_UNIVERSE.slice(80).map((s) => s.symbol);

export const EXTENDED_TOTAL = EXTENDED_UNIVERSE.length;

/** 按市場分組（給 sector scanner 用） */
export function groupByMarket(): Record<string, ExtendedStock[]> {
  return EXTENDED_UNIVERSE.reduce((acc, s) => {
    (acc[s.market] ??= []).push(s);
    return acc;
  }, {} as Record<string, ExtendedStock[]>);
}

/** 按 sector 分組 */
export function groupBySector(): Record<string, ExtendedStock[]> {
  return EXTENDED_UNIVERSE.reduce((acc, s) => {
    (acc[s.sector] ??= []).push(s);
    return acc;
  }, {} as Record<string, ExtendedStock[]>);
}
