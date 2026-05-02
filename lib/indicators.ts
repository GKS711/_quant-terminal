/**
 * 技術指標純函式 — 從一系列 close prices（或 OHLC）計算
 *
 * 不依賴外部套件，零成本。
 */

import type { OHLC } from "./yahoo-fetch";

// ─── 簡單移動平均（SMA）─────────────────────────
export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += values[j];
    out.push(sum / period);
  }
  return out;
}

// ─── 指數移動平均（EMA）─────────────────────────
export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) { out.push(null); continue; }
    if (prev === null) {
      // initialize as SMA of first `period`
      let sum = 0;
      for (let j = 0; j < period; j++) sum += values[j];
      prev = sum / period;
      out.push(prev);
    } else {
      prev = values[i] * k + prev * (1 - k);
      out.push(prev);
    }
  }
  return out;
}

// ─── RSI（Wilder smoothing）─────────────────────
export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = [];
  if (values.length < period + 1) return values.map(() => null);

  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses += -diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i <= period; i++) out.push(null);

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    if (avgLoss === 0) out.push(100);
    else {
      const rs = avgGain / avgLoss;
      out.push(100 - 100 / (1 + rs));
    }
  }
  return out;
}

// ─── MACD = EMA12 - EMA26，signal = EMA9(MACD)，hist = MACD - signal ───
export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = values.map((_, i) => {
    const f = emaFast[i], s = emaSlow[i];
    if (f == null || s == null) return null;
    return f - s;
  });
  const cleanedMacd = macdLine.filter((v): v is number => v != null);
  const signalLineRaw = ema(cleanedMacd, signal);
  // align back to original length
  const offset = macdLine.length - cleanedMacd.length;
  const signalLine: (number | null)[] = macdLine.map((v, i) => {
    if (v == null) return null;
    const idx = i - offset;
    return idx >= 0 ? signalLineRaw[idx] ?? null : null;
  });
  const hist = macdLine.map((m, i) => {
    const sig = signalLine[i];
    return m == null || sig == null ? null : m - sig;
  });
  return { macd: macdLine, signal: signalLine, hist };
}

// ─── Bollinger Bands ────────────────────────────
export function bollinger(values: number[], period = 20, mult = 2) {
  const ma = sma(values, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      upper.push(null); lower.push(null); continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += Math.pow(values[j] - (ma[i] as number), 2);
    const std = Math.sqrt(sum / period);
    upper.push((ma[i] as number) + mult * std);
    lower.push((ma[i] as number) - mult * std);
  }
  return { ma, upper, lower };
}

// ─── 從 OHLC + 各指標推 Strategy Signal（買 / 持 / 賣 + score 0-100）─────────

export type Signal = "buy" | "hold" | "sell";

export interface StrategyOutput {
  signal: Signal;
  score: number; // 0-100
  detail: string;
}

/**
 * 11 個策略對應到 OHLC → signal 的純函式
 *
 * 每個策略獨立計算，最後 consensus 是加權投票
 */
export function computeStrategy(strategyId: string, ohlc: OHLC[]): StrategyOutput {
  if (ohlc.length < 2) return { signal: "hold", score: 50, detail: "資料不足" };

  const closes = ohlc.map((d) => d.close);
  const lastPrice = closes[closes.length - 1];

  switch (strategyId) {
    case "ma-trend": {
      const ma5 = sma(closes, 5);
      const ma20 = sma(closes, 20);
      const m5 = ma5[ma5.length - 1];
      const m20 = ma20[ma20.length - 1];
      if (m5 == null || m20 == null) return { signal: "hold", score: 50, detail: "資料不足" };
      const diff = ((m5 - m20) / m20) * 100;
      if (diff > 1.5)  return { signal: "buy",  score: Math.min(95, 60 + diff * 5),  detail: `MA5(${m5.toFixed(1)}) > MA20(${m20.toFixed(1)}) +${diff.toFixed(2)}%` };
      if (diff < -1.5) return { signal: "sell", score: Math.max(5, 40 + diff * 5),   detail: `MA5(${m5.toFixed(1)}) < MA20(${m20.toFixed(1)}) ${diff.toFixed(2)}%` };
      return { signal: "hold", score: 55, detail: `MA5/MA20 收斂 ${diff.toFixed(2)}%` };
    }

    case "rsi-momentum": {
      const r = rsi(closes, 14);
      const v = r[r.length - 1];
      if (v == null) return { signal: "hold", score: 50, detail: "RSI 計算中" };
      if (v > 70) return { signal: "sell", score: Math.max(20, 100 - v),  detail: `RSI ${v.toFixed(1)} 過熱` };
      if (v > 55) return { signal: "buy",  score: Math.min(85, 50 + v / 2), detail: `RSI ${v.toFixed(1)} 動能轉強` };
      if (v < 30) return { signal: "buy",  score: 60, detail: `RSI ${v.toFixed(1)} 超賣反彈` };
      if (v < 45) return { signal: "sell", score: 40, detail: `RSI ${v.toFixed(1)} 動能轉弱` };
      return { signal: "hold", score: 55, detail: `RSI ${v.toFixed(1)} 中性` };
    }

    case "macd-cross": {
      const m = macd(closes);
      const macdNow  = m.macd[m.macd.length - 1];
      const sigNow   = m.signal[m.signal.length - 1];
      const histNow  = m.hist[m.hist.length - 1];
      const histPrev = m.hist[m.hist.length - 2];
      if (macdNow == null || sigNow == null || histNow == null || histPrev == null) {
        return { signal: "hold", score: 50, detail: "MACD 計算中" };
      }
      if (histNow > 0 && histPrev <= 0) return { signal: "buy",  score: 80, detail: "黃金交叉成形" };
      if (histNow < 0 && histPrev >= 0) return { signal: "sell", score: 25, detail: "死亡交叉成形" };
      if (histNow > 0) return { signal: "buy",  score: 65, detail: "MACD 在零軸上" };
      return { signal: "sell", score: 35, detail: "MACD 在零軸下" };
    }

    case "bollinger-band": {
      const b = bollinger(closes, 20, 2);
      const ma = b.ma[b.ma.length - 1];
      const up = b.upper[b.upper.length - 1];
      const lo = b.lower[b.lower.length - 1];
      if (ma == null || up == null || lo == null) return { signal: "hold", score: 50, detail: "資料不足" };
      const pct = (lastPrice - lo) / (up - lo); // 0-1
      if (pct > 0.95) return { signal: "sell", score: 30, detail: `貼近上軌 ${(pct*100).toFixed(0)}%` };
      if (pct > 0.7)  return { signal: "buy",  score: 70, detail: `上軌帶 ${(pct*100).toFixed(0)}% 動能` };
      if (pct < 0.05) return { signal: "buy",  score: 65, detail: `貼近下軌反彈` };
      if (pct < 0.3)  return { signal: "sell", score: 40, detail: `下軌帶 ${(pct*100).toFixed(0)}%` };
      return { signal: "hold", score: 55, detail: `中軌附近 ${(pct*100).toFixed(0)}%` };
    }

    case "vwap-reversion": {
      // 簡化 VWAP：用 (high+low+close)/3 加權
      let pv = 0, vol = 0;
      for (const d of ohlc.slice(-20)) {
        const tp = (d.high + d.low + d.close) / 3;
        pv += tp * (d.volume || 1);
        vol += d.volume || 1;
      }
      const vwap = vol > 0 ? pv / vol : lastPrice;
      const diff = ((lastPrice - vwap) / vwap) * 100;
      if (diff > 3)  return { signal: "sell", score: 35, detail: `偏離 VWAP +${diff.toFixed(2)}%` };
      if (diff < -3) return { signal: "buy",  score: 65, detail: `偏離 VWAP ${diff.toFixed(2)}% 回歸機會` };
      return { signal: "hold", score: 55, detail: `近 VWAP ${diff.toFixed(2)}%` };
    }

    case "volume-profile": {
      const recentVol = ohlc.slice(-5).reduce((s, d) => s + d.volume, 0) / 5;
      const avgVol = ohlc.reduce((s, d) => s + d.volume, 0) / ohlc.length;
      const ratio = avgVol > 0 ? recentVol / avgVol : 1;
      const trend = closes[closes.length - 1] > closes[Math.max(0, closes.length - 6)] ? 1 : -1;
      if (ratio > 1.5 && trend === 1)  return { signal: "buy",  score: 75, detail: `量增 ${ratio.toFixed(2)}x + 價揚` };
      if (ratio > 1.5 && trend === -1) return { signal: "sell", score: 30, detail: `量增 ${ratio.toFixed(2)}x + 價跌` };
      return { signal: "hold", score: 55, detail: `量比 ${ratio.toFixed(2)}x` };
    }

    case "elliott-wave": {
      // 極簡：看最近 30 天高低點計數判斷 wave 位置
      const half = Math.floor(closes.length / 2);
      const firstHalfMax = Math.max(...closes.slice(0, half));
      const secondHalfMax = Math.max(...closes.slice(half));
      const trend = secondHalfMax > firstHalfMax * 1.05 ? "up" : secondHalfMax < firstHalfMax * 0.95 ? "down" : "side";
      if (trend === "up")   return { signal: "hold", score: 60, detail: "推測第 3 / 5 波" };
      if (trend === "down") return { signal: "hold", score: 40, detail: "推測修正波" };
      return { signal: "hold", score: 55, detail: "推測整理波" };
    }

    case "news-sentiment": {
      // 沒有真新聞 → 用 5 日 momentum 作 proxy
      if (closes.length < 6) return { signal: "hold", score: 50, detail: "" };
      const five = ((closes[closes.length-1] - closes[closes.length-6]) / closes[closes.length-6]) * 100;
      if (five > 5)  return { signal: "buy",  score: 75, detail: `5 日動能 +${five.toFixed(2)}%` };
      if (five < -5) return { signal: "sell", score: 30, detail: `5 日動能 ${five.toFixed(2)}%` };
      return { signal: "hold", score: 55, detail: `5 日動能 ${five.toFixed(2)}%` };
    }

    case "sector-rotation": {
      // proxy：30 日累積報酬
      if (closes.length < 2) return { signal: "hold", score: 50, detail: "" };
      const r = ((closes[closes.length-1] - closes[0]) / closes[0]) * 100;
      if (r > 8)  return { signal: "buy",  score: 75, detail: `30d +${r.toFixed(2)}% 強勢` };
      if (r < -8) return { signal: "sell", score: 30, detail: `30d ${r.toFixed(2)}% 弱勢` };
      return { signal: "hold", score: 55, detail: `30d ${r.toFixed(2)}%` };
    }

    case "risk-overlay": {
      // 計算近 30 日標準差（波動率），高波動降信心
      if (closes.length < 5) return { signal: "hold", score: 50, detail: "" };
      const rets = closes.slice(1).map((c, i) => Math.log(c / closes[i]));
      const mean = rets.reduce((s, r) => s + r, 0) / rets.length;
      const variance = rets.reduce((s, r) => s + (r - mean) ** 2, 0) / rets.length;
      const std = Math.sqrt(variance) * Math.sqrt(252) * 100; // 年化
      if (std > 35) return { signal: "sell", score: 35, detail: `年化波動 ${std.toFixed(1)}% 偏高` };
      if (std < 15) return { signal: "buy",  score: 65, detail: `年化波動 ${std.toFixed(1)}% 穩定` };
      return { signal: "hold", score: 55, detail: `年化波動 ${std.toFixed(1)}%` };
    }

    case "consensus":
    default: {
      // 看其他 10 個策略投票
      const others = ["ma-trend", "rsi-momentum", "macd-cross", "bollinger-band", "vwap-reversion", "volume-profile", "elliott-wave", "news-sentiment", "sector-rotation", "risk-overlay"];
      let buyW = 0, sellW = 0, totalW = 0;
      for (const id of others) {
        const r = computeStrategy(id, ohlc);
        if (r.signal === "buy") buyW += r.score;
        else if (r.signal === "sell") sellW += (100 - r.score);
        totalW += 100;
      }
      const buyPct  = (buyW / totalW) * 100;
      const sellPct = (sellW / totalW) * 100;
      const score = Math.round(buyPct);
      if (buyPct > 60)  return { signal: "buy",  score, detail: `多策略偏多 ${buyPct.toFixed(0)}%` };
      if (sellPct > 60) return { signal: "sell", score, detail: `多策略偏空 ${sellPct.toFixed(0)}%` };
      return { signal: "hold", score, detail: `多策略中性` };
    }
  }
}

/** 11 策略對該檔 OHLC 跑一次，回 Map<strategyId, StrategyOutput> */
export function computeAllStrategies(ohlc: OHLC[]): Record<string, StrategyOutput> {
  const ids = ["ma-trend", "rsi-momentum", "macd-cross", "elliott-wave", "volume-profile", "bollinger-band", "vwap-reversion", "news-sentiment", "sector-rotation", "risk-overlay", "consensus"];
  const out: Record<string, StrategyOutput> = {};
  for (const id of ids) out[id] = computeStrategy(id, ohlc);
  return out;
}
