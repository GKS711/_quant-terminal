/**
 * 直連 Yahoo Finance v8 chart API（不依賴 yahoo-finance2，因為 v2.14 拿掉了 historical）
 *
 * 重要：v8/chart 不需要 crumb auth，只要帶 User-Agent
 */

export interface OHLC {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartResult {
  symbol: string;
  currency: string;
  exchangeName: string;
  regularMarketPrice: number;
  previousClose: number;
  changePct: number;
  longName?: string;
  shortName?: string;
  ohlc: OHLC[];
  source: "yahoo-v8";
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Yahoo v8 chart endpoint
 *   https://query1.finance.yahoo.com/v8/finance/chart/{symbol}
 *   query: range (1mo, 3mo, 1y...) + interval (1d, 1wk...)
 */
export async function fetchYahooChart(
  symbol: string,
  range: "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" = "1mo",
  interval: "1d" | "1wk" | "1mo" = "1d",
  signal?: AbortSignal,
): Promise<ChartResult> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;

  const r = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal,
  });

  if (!r.ok) throw new Error(`Yahoo v8 ${r.status} ${r.statusText}`);
  const j = await r.json();

  const result = j?.chart?.result?.[0];
  if (!result) {
    const err = j?.chart?.error?.description ?? "no data";
    throw new Error(`Yahoo v8 empty: ${err}`);
  }

  const meta = result.meta ?? {};
  const timestamps: number[] = result.timestamp ?? [];
  const quote = result.indicators?.quote?.[0] ?? {};
  const opens: (number | null)[] = quote.open ?? [];
  const highs: (number | null)[] = quote.high ?? [];
  const lows: (number | null)[] = quote.low ?? [];
  const closes: (number | null)[] = quote.close ?? [];
  const volumes: (number | null)[] = quote.volume ?? [];

  const ohlc: OHLC[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const o = opens[i], h = highs[i], l = lows[i], c = closes[i], v = volumes[i];
    if (o == null || h == null || l == null || c == null) continue; // skip days w/o data
    ohlc.push({
      time: timestamps[i],
      open: Number(o),
      high: Number(h),
      low:  Number(l),
      close: Number(c),
      volume: v ?? 0,
    });
  }

  const lastPrice = Number(meta.regularMarketPrice ?? 0);
  const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? lastPrice);
  const changePct = prevClose > 0 ? ((lastPrice - prevClose) / prevClose) * 100 : 0;

  return {
    symbol: meta.symbol ?? symbol,
    currency: meta.currency ?? "USD",
    exchangeName: meta.fullExchangeName ?? meta.exchangeName ?? "",
    regularMarketPrice: lastPrice,
    previousClose: prevClose,
    changePct,
    longName: meta.longName,
    shortName: meta.shortName,
    ohlc,
    source: "yahoo-v8",
  };
}

/** 帶 timeout 的 fetch wrapper */
export async function fetchYahooChartWithTimeout(
  symbol: string,
  timeoutMs = 8000,
  range: "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" = "1mo",
): Promise<ChartResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetchYahooChart(symbol, range, "1d", ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}
