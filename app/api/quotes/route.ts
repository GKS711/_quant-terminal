import { NextRequest } from "next/server";
import YahooFinance from "yahoo-finance2";
import { SNAPSHOT } from "@/lib/cached";

// v2.14.0+ 是 class，要 instantiate
const yf = new YahooFinance();

// 註：yahoo-finance2 v2.14 會在第一次呼叫時 console.log 出
//   1) yahoo survey 推廣（套件已說「will only be shown once」）
//   2) cookie consent redirect 警告（套件已說「safely ignore this if request succeeds」）
// 兩條都是套件內的 informational message，不影響功能也不可程式化抑制（v2.14 沒有
// suppressNotices API），dev log 看到一次就好。

export const runtime = "nodejs";
export const revalidate = 30; // 30 秒快取，避免打爆 Yahoo

// 預設追蹤的 12 檔（4 市場），與 lib/portfolio.ts 對齊
const DEFAULT_TICKERS = [
  // TW (4)
  "2330.TW", "2454.TW", "2317.TW", "0050.TW",
  // US (4)
  "AAPL", "NVDA", "TSLA", "MSFT",
  // HK (2)
  "0700.HK", "9988.HK",
  // CN (2)
  "600519.SS", "000858.SZ",
];

const ALLOWED_TICKERS = new Set(DEFAULT_TICKERS);
const MAX_TICKERS_PER_REQUEST = 12;

const NAME_MAP: Record<string, string> = {
  "2330.TW":   "台積電",
  "2454.TW":   "聯發科",
  "2317.TW":   "鴻海",
  "0050.TW":   "元大台灣 50",
  "AAPL":      "Apple",
  "NVDA":      "NVIDIA",
  "TSLA":      "Tesla",
  "MSFT":      "Microsoft",
  "0700.HK":   "騰訊",
  "9988.HK":   "阿里巴巴",
  "600519.SS": "貴州茅台",
  "000858.SZ": "五糧液",
};

const CURRENCY_MAP: Record<string, string> = {
  "AAPL": "USD", "NVDA": "USD", "TSLA": "USD", "MSFT": "USD",
  "0700.HK": "HKD", "9988.HK": "HKD",
  "600519.SS": "CNY", "000858.SZ": "CNY",
};

export interface Quote {
  ticker: string;       // e.g. "2330.TW"
  shortTicker: string;  // e.g. "2330"
  name: string;
  price: number;
  changePercent: number;
  currency: string;
  marketTime?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedSymbols = searchParams.get("symbols")?.split(",").filter(Boolean) ?? DEFAULT_TICKERS;

  // 白名單過濾 + cap 數量（防 abuse）
  const tickers = requestedSymbols
    .filter((t) => ALLOWED_TICKERS.has(t))
    .slice(0, MAX_TICKERS_PER_REQUEST);

  if (tickers.length === 0) {
    return Response.json(
      { ok: false, error: "no allowed tickers", quotes: [] },
      { status: 400 },
    );
  }

  try {
    // v2 type union 對 union ticker arg 較難滿足，用 any 穿透
    const results = await (yf as any).quote(tickers);
    const arr = Array.isArray(results) ? results : [results];

    const quotes: Quote[] = arr.map((q: any) => ({
      ticker: q.symbol,
      shortTicker: String(q.symbol).replace(/\.(TW|HK|SS|SZ)$/, ""),
      name: NAME_MAP[q.symbol] ?? q.shortName ?? q.longName ?? q.symbol,
      price: Number(q.regularMarketPrice ?? 0),
      changePercent: Number(q.regularMarketChangePercent ?? 0),
      currency: q.currency ?? CURRENCY_MAP[q.symbol] ?? "TWD",
      marketTime: q.regularMarketTime ? new Date(q.regularMarketTime * 1000).toISOString() : undefined,
    }));

    return Response.json(
      { ok: true, quotes, source: "yahoo", fetchedAt: new Date().toISOString() },
      { headers: { "cache-control": "s-maxage=30, stale-while-revalidate=120" } },
    );
  } catch (err: any) {
    // Yahoo 抓不到 → 優先用 snapshot.json 的真實 build-time 數據
    // snapshot 也沒有時 → 退回 hardcoded mock
    const HARDCODED_FALLBACK: Record<string, { price: number; changePercent: number }> = {
      "2330.TW":   { price: 1469.0, changePercent: 2.21 },
      "2454.TW":   { price: 1518.0, changePercent: 3.12 },
      "2317.TW":   { price: 218.0,  changePercent: 1.86 },
      "0050.TW":   { price: 195.0,  changePercent: 0.92 },
      "AAPL":      { price: 214.5,  changePercent: 0.45 },
      "NVDA":      { price: 132.8,  changePercent: 5.20 },
      "TSLA":      { price: 244.7,  changePercent: -3.10 },
      "MSFT":      { price: 425.2,  changePercent: 0.84 },
      "0700.HK":   { price: 420.5,  changePercent: 1.62 },
      "9988.HK":   { price: 89.3,   changePercent: -0.42 },
      "600519.SS": { price: 1582.0, changePercent: 0.55 },
      "000858.SZ": { price: 124.6,  changePercent: -1.85 },
    };
    let snapshotHits = 0;
    const fallbackQuotes: Quote[] = tickers.map((ticker) => {
      const cached = SNAPSHOT.stocks?.[ticker];
      if (cached?.regularMarketPrice) {
        snapshotHits++;
        const prev = cached.previousClose || cached.regularMarketPrice;
        return {
          ticker,
          shortTicker: ticker.replace(/\.(TW|HK|SS|SZ)$/, ""),
          name: NAME_MAP[ticker] ?? cached.longName ?? ticker,
          price: cached.regularMarketPrice,
          changePercent: prev > 0 ? ((cached.regularMarketPrice - prev) / prev) * 100 : 0,
          currency: cached.currency ?? CURRENCY_MAP[ticker] ?? "TWD",
        };
      }
      const f = HARDCODED_FALLBACK[ticker] ?? { price: 100, changePercent: 0 };
      return {
        ticker,
        shortTicker: ticker.replace(/\.(TW|HK|SS|SZ)$/, ""),
        name: NAME_MAP[ticker] ?? ticker,
        price: f.price,
        changePercent: f.changePercent,
        currency: CURRENCY_MAP[ticker] ?? "TWD",
      };
    });
    const source = snapshotHits === tickers.length
      ? `snapshot (${SNAPSHOT.refreshedAt?.slice(0, 16) ?? "cached"})`
      : snapshotHits > 0
      ? `partial snapshot (${snapshotHits}/${tickers.length}) + mock`
      : "mock (yahoo+snapshot unavailable)";
    return Response.json(
      {
        ok: true,
        quotes: fallbackQuotes,
        source,
        error: err?.message ?? "fetch failed",
        fetchedAt: new Date().toISOString(),
      },
      { headers: { "cache-control": "s-maxage=30, stale-while-revalidate=120" } },
    );
  }
}
