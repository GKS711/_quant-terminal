#!/usr/bin/env node
/**
 * 真實資料重新整理腳本 — 在 build 之前或 cron 跑
 *
 * 流程：
 *   1. 從 Yahoo v8/chart 抓 12 檔 30 日 OHLC（並行）
 *   2. 對每檔跑 11 策略 → 真實訊號
 *   3. 對每檔呼叫 Gemma 4 31B → 真實 AI 決策（rationale / risks / catalysts）
 *   4. 嘗試 Yahoo 新聞 search → 真實 news（不需 key）
 *   5. 寫入 lib/cached/snapshot.json，前端啟動時讀取
 *
 * 失敗時保留現有 snapshot（不破壞已有資料）
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE_DIR = join(ROOT, "lib", "cached");
const SNAPSHOT = join(CACHE_DIR, "snapshot.json");

// 短 UA — 經實測 Yahoo 對長 UA + 頻繁 request 會 ban
const UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36";

const SYMBOLS = [
  "2330.TW", "2454.TW", "2317.TW", "0050.TW",
  "AAPL", "NVDA", "TSLA", "MSFT",
  "0700.HK", "9988.HK",
  "600519.SS", "000858.SZ",
];

// ─── Yahoo v8 chart fetch（shell out to curl，Node fetch 被 Yahoo 識別） ──
async function fetchOhlc(symbol) {
  const hosts = ["query2.finance.yahoo.com", "query1.finance.yahoo.com"];
  let lastErr;
  for (const host of hosts) {
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(symbol)}?range=2mo&interval=1d`;
    try {
      // 用 curl shell-out，Yahoo 不會 429（可能 TLS fingerprint 差異）
      const out = execSync(
        `curl -sLf --max-time 10 -H "User-Agent: ${UA}" -H "Referer: https://finance.yahoo.com/" "${url}"`,
        { encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 },
      );
      const j = JSON.parse(out);
      return await parseChart(symbol, j);
    } catch (e) {
      lastErr = new Error(`${host}: ${e.message?.split("\n")[0] ?? e}`);
    }
  }
  throw lastErr ?? new Error(`${symbol}: all hosts failed`);
}

async function parseChart(symbol, j) {
  const result = j?.chart?.result?.[0];
  if (!result) throw new Error(`${symbol}: empty result`);

  const meta = result.meta ?? {};
  const ts = result.timestamp ?? [];
  const q = result.indicators?.quote?.[0] ?? {};
  const closes = q.close ?? [];
  const opens = q.open ?? [];
  const highs = q.high ?? [];
  const lows  = q.low ?? [];
  const vols  = q.volume ?? [];

  const ohlc = [];
  for (let i = 0; i < ts.length; i++) {
    if (closes[i] == null) continue;
    ohlc.push({
      time: ts[i],
      open:  Number(opens[i] ?? closes[i]),
      high:  Number(highs[i] ?? closes[i]),
      low:   Number(lows[i] ?? closes[i]),
      close: Number(closes[i]),
      volume: Number(vols[i] ?? 0),
    });
  }
  // 取最近 30 天
  const last30 = ohlc.slice(-30);
  return {
    symbol,
    currency: meta.currency ?? "USD",
    longName: meta.longName ?? meta.shortName ?? symbol,
    regularMarketPrice: Number(meta.regularMarketPrice ?? last30.at(-1)?.close ?? 0),
    previousClose: Number(meta.chartPreviousClose ?? meta.previousClose ?? last30.at(-1)?.close ?? 0),
    ohlc: last30,
  };
}

// ─── Yahoo Finance news search ─────────────────────────────
async function fetchYahooNews() {
  const tries = ["AAPL", "NVDA", "TSMC", "Tencent"];
  const news = [];
  for (const q of tries) {
    try {
      const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&newsCount=4&quotesCount=0`;
      const out = execSync(
        `curl -sLf --max-time 10 -H "User-Agent: ${UA}" -H "Referer: https://finance.yahoo.com/" "${url}"`,
        { encoding: "utf-8", maxBuffer: 4 * 1024 * 1024 },
      );
      const j = JSON.parse(out);
      for (const n of j?.news ?? []) {
        if (news.find((x) => x.uuid === n.uuid)) continue;
        news.push({
          uuid: n.uuid,
          title: n.title,
          link: n.link,
          publisher: n.publisher,
          providerPublishTime: n.providerPublishTime,
          relatedTickers: n.relatedTickers ?? [],
        });
        if (news.length >= 6) break;
      }
      if (news.length >= 6) break;
    } catch (e) { console.warn(`  news ${q} failed:`, e.message?.split("\n")[0]); }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return news;
}

// ─── 技術指標（純 JS 重新實作，跟 lib/indicators.ts 對齊）─
function sma(values, period) {
  const out = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) { out.push(null); continue; }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += values[j];
    out.push(sum / period);
  }
  return out;
}
function ema(values, period) {
  const out = [];
  const k = 2 / (period + 1);
  let prev = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) { out.push(null); continue; }
    if (prev === null) {
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
function rsi(values, period = 14) {
  const out = values.map(() => null);
  if (values.length < period + 1) return out;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = values[i] - values[i-1];
    if (d >= 0) gains += d; else losses -= d;
  }
  let avgG = gains / period, avgL = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const d = values[i] - values[i-1];
    const g = d > 0 ? d : 0;
    const l = d < 0 ? -d : 0;
    avgG = (avgG * (period - 1) + g) / period;
    avgL = (avgL * (period - 1) + l) / period;
    out[i] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  }
  return out;
}

function computeStrategy(strategyId, ohlc) {
  if (ohlc.length < 5) return { signal: "hold", score: 50, detail: "資料不足" };
  const closes = ohlc.map(d => d.close);
  const last = closes[closes.length - 1];

  switch (strategyId) {
    case "ma-trend": {
      const m5 = sma(closes, 5).at(-1), m20 = sma(closes, 20).at(-1);
      if (m5 == null || m20 == null) return { signal: "hold", score: 50, detail: "" };
      const diff = ((m5 - m20) / m20) * 100;
      if (diff > 1.5)  return { signal: "buy",  score: Math.min(95, 60 + diff * 5), detail: `MA5>MA20 +${diff.toFixed(2)}%` };
      if (diff < -1.5) return { signal: "sell", score: Math.max(5, 40 + diff * 5),  detail: `MA5<MA20 ${diff.toFixed(2)}%` };
      return { signal: "hold", score: 55, detail: `MA 收斂` };
    }
    case "rsi-momentum": {
      const v = rsi(closes, 14).at(-1);
      if (v == null) return { signal: "hold", score: 50, detail: "" };
      if (v > 70) return { signal: "sell", score: Math.max(20, 100 - v),    detail: `RSI ${v.toFixed(1)} 過熱` };
      if (v > 55) return { signal: "buy",  score: Math.min(85, 50 + v / 2), detail: `RSI ${v.toFixed(1)}` };
      if (v < 30) return { signal: "buy",  score: 60, detail: `RSI ${v.toFixed(1)} 超賣反彈` };
      if (v < 45) return { signal: "sell", score: 40, detail: `RSI ${v.toFixed(1)}` };
      return { signal: "hold", score: 55, detail: `RSI ${v.toFixed(1)}` };
    }
    case "macd-cross": {
      const f = ema(closes, 12), s = ema(closes, 26);
      const macdLine = closes.map((_, i) => (f[i] != null && s[i] != null) ? f[i] - s[i] : null);
      const filtered = macdLine.filter(v => v != null);
      const sigLineRaw = ema(filtered, 9);
      const offset = macdLine.length - filtered.length;
      const histNow = (() => {
        const idx = macdLine.length - 1;
        const m = macdLine[idx];
        const sigIdx = idx - offset;
        const sig = sigLineRaw[sigIdx];
        return (m != null && sig != null) ? m - sig : null;
      })();
      const histPrev = (() => {
        const idx = macdLine.length - 2;
        const m = macdLine[idx];
        const sigIdx = idx - offset;
        const sig = sigLineRaw[sigIdx];
        return (m != null && sig != null) ? m - sig : null;
      })();
      if (histNow == null || histPrev == null) return { signal: "hold", score: 50, detail: "" };
      if (histNow > 0 && histPrev <= 0) return { signal: "buy",  score: 80, detail: "黃金交叉" };
      if (histNow < 0 && histPrev >= 0) return { signal: "sell", score: 25, detail: "死亡交叉" };
      if (histNow > 0) return { signal: "buy",  score: 65, detail: "MACD 在零軸上" };
      return { signal: "sell", score: 35, detail: "MACD 在零軸下" };
    }
    case "bollinger-band": {
      const ma = sma(closes, 20).at(-1);
      if (ma == null) return { signal: "hold", score: 50, detail: "" };
      const slice = closes.slice(-20);
      const sumSq = slice.reduce((s, c) => s + (c - ma) ** 2, 0);
      const std = Math.sqrt(sumSq / 20);
      const up = ma + 2 * std, lo = ma - 2 * std;
      const pct = (last - lo) / (up - lo);
      if (pct > 0.95) return { signal: "sell", score: 30, detail: `貼上軌` };
      if (pct > 0.7)  return { signal: "buy",  score: 70, detail: `上軌帶動能` };
      if (pct < 0.05) return { signal: "buy",  score: 65, detail: `貼下軌反彈` };
      if (pct < 0.3)  return { signal: "sell", score: 40, detail: `下軌帶` };
      return { signal: "hold", score: 55, detail: `中軌附近` };
    }
    case "vwap-reversion": {
      let pv = 0, vol = 0;
      for (const d of ohlc.slice(-20)) {
        const tp = (d.high + d.low + d.close) / 3;
        pv += tp * (d.volume || 1);
        vol += d.volume || 1;
      }
      const vwap = vol > 0 ? pv / vol : last;
      const diff = ((last - vwap) / vwap) * 100;
      if (diff > 3)  return { signal: "sell", score: 35, detail: `偏離 +${diff.toFixed(2)}%` };
      if (diff < -3) return { signal: "buy",  score: 65, detail: `偏離 ${diff.toFixed(2)}%` };
      return { signal: "hold", score: 55, detail: "" };
    }
    case "volume-profile": {
      const recent = ohlc.slice(-5).reduce((s, d) => s + d.volume, 0) / 5;
      const avg = ohlc.reduce((s, d) => s + d.volume, 0) / ohlc.length;
      const ratio = avg > 0 ? recent / avg : 1;
      const trend = closes[closes.length-1] > closes[Math.max(0, closes.length-6)] ? 1 : -1;
      if (ratio > 1.5 && trend === 1)  return { signal: "buy",  score: 75, detail: `量增 ${ratio.toFixed(2)}x +價揚` };
      if (ratio > 1.5 && trend === -1) return { signal: "sell", score: 30, detail: `量增 ${ratio.toFixed(2)}x +價跌` };
      return { signal: "hold", score: 55, detail: `量比 ${ratio.toFixed(2)}x` };
    }
    case "elliott-wave": {
      const half = Math.floor(closes.length / 2);
      const fmax = Math.max(...closes.slice(0, half));
      const smax = Math.max(...closes.slice(half));
      if (smax > fmax * 1.05) return { signal: "hold", score: 60, detail: "推測 3/5 波" };
      if (smax < fmax * 0.95) return { signal: "hold", score: 40, detail: "修正波" };
      return { signal: "hold", score: 55, detail: "整理波" };
    }
    case "news-sentiment": {
      const five = ((closes.at(-1) - closes.at(-6)) / closes.at(-6)) * 100;
      if (five > 5)  return { signal: "buy",  score: 75, detail: `5d +${five.toFixed(2)}%` };
      if (five < -5) return { signal: "sell", score: 30, detail: `5d ${five.toFixed(2)}%` };
      return { signal: "hold", score: 55, detail: `5d ${five.toFixed(2)}%` };
    }
    case "sector-rotation": {
      const r = ((closes.at(-1) - closes[0]) / closes[0]) * 100;
      if (r > 8)  return { signal: "buy",  score: 75, detail: `30d +${r.toFixed(2)}%` };
      if (r < -8) return { signal: "sell", score: 30, detail: `30d ${r.toFixed(2)}%` };
      return { signal: "hold", score: 55, detail: `30d ${r.toFixed(2)}%` };
    }
    case "risk-overlay": {
      const rets = closes.slice(1).map((c, i) => Math.log(c / closes[i]));
      const mean = rets.reduce((s, r) => s + r, 0) / rets.length;
      const variance = rets.reduce((s, r) => s + (r - mean) ** 2, 0) / rets.length;
      const std = Math.sqrt(variance) * Math.sqrt(252) * 100;
      if (std > 35) return { signal: "sell", score: 35, detail: `波動 ${std.toFixed(1)}%` };
      if (std < 15) return { signal: "buy",  score: 65, detail: `波動 ${std.toFixed(1)}%` };
      return { signal: "hold", score: 55, detail: `波動 ${std.toFixed(1)}%` };
    }
    case "consensus":
    default: {
      const others = ["ma-trend", "rsi-momentum", "macd-cross", "bollinger-band", "vwap-reversion", "volume-profile", "elliott-wave", "news-sentiment", "sector-rotation", "risk-overlay"];
      let buyW = 0, sellW = 0, total = 0;
      for (const id of others) {
        const r = computeStrategy(id, ohlc);
        if (r.signal === "buy") buyW += r.score;
        else if (r.signal === "sell") sellW += (100 - r.score);
        total += 100;
      }
      const buyPct = (buyW / total) * 100;
      const sellPct = (sellW / total) * 100;
      const score = Math.round(buyPct);
      if (buyPct > 60)  return { signal: "buy",  score, detail: `多策略偏多 ${buyPct.toFixed(0)}%` };
      if (sellPct > 60) return { signal: "sell", score, detail: `多策略偏空 ${sellPct.toFixed(0)}%` };
      return { signal: "hold", score, detail: `多策略中性` };
    }
  }
}

// ─── Gemma 4 31B 真打決策 ──────────────────────────────────
async function callGemmaDecision(stock, ohlc, strategySnapshot, apiKey) {
  if (!apiKey) return null;

  const closes = ohlc.map(d => d.close);
  const lastPrice = closes.at(-1);
  const change30d = ((closes.at(-1) - closes[0]) / closes[0]) * 100;

  const consensus = strategySnapshot.consensus;
  const buyCount = Object.values(strategySnapshot).filter(s => s.signal === "buy").length;
  const sellCount = Object.values(strategySnapshot).filter(s => s.signal === "sell").length;

  const prompt = `你是台股／美股／港股／A 股量化分析引擎。針對下列標的，根據真實價格與 11 策略訊號，輸出**單一 JSON 物件**作為決策結果。

【標的】
代號：${stock.shortCode}（${stock.symbol}）
名稱：${stock.name}
產業：${stock.sector}
市場：${stock.market}
今日收盤：${lastPrice?.toFixed(2)}（30 日變動 ${change30d > 0 ? "+" : ""}${change30d.toFixed(2)}%）

【11 策略訊號摘要】
- 多頭訊號：${buyCount} / 11
- 空頭訊號：${sellCount} / 11
- 共識決策：${consensus.signal} (score ${consensus.score}) — ${consensus.detail}

【嚴格輸出格式】
僅輸出 JSON，不要 markdown、不要 code fence、不要其他文字。
{
  "signal": "buy" | "hold" | "sell",
  "score": 0-100 整數,
  "rationale": "一句話繁體中文，不超過 60 字，要根據上述真實數據而非泛泛而論",
  "risks": ["風險 1", "風險 2"] (2-4 條，繁體中文),
  "catalysts": ["利多 1", "利多 2"] (2-4 條，繁體中文)
}

注意：
- score 必須是 0-100 整數
- signal 只能是 "buy" / "hold" / "sell" 小寫
- rationale 要提到具體訊號（哪個策略、變動幅度等），不要說「市場有風險」這種廢話`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600, responseMimeType: "application/json" },
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error(`Gemma ${r.status}`);
    const j = await r.json();
    const parts = j.candidates?.[0]?.content?.parts ?? [];
    const text = parts.filter(p => !p.thought && p.text).map(p => p.text).join("").trim();

    // brace-counter to extract first JSON
    let raw;
    try { raw = JSON.parse(text); }
    catch {
      const start = text.indexOf("{");
      let depth = 0, inStr = false, esc = false;
      for (let i = start; i < text.length; i++) {
        const c = text[i];
        if (esc) { esc = false; continue; }
        if (c === "\\") { esc = true; continue; }
        if (c === '"') { inStr = !inStr; continue; }
        if (inStr) continue;
        if (c === "{") depth++;
        else if (c === "}") { depth--; if (depth === 0) { raw = JSON.parse(text.slice(start, i + 1)); break; } }
      }
      if (!raw) throw new Error("no JSON");
    }

    if (!raw.signal || typeof raw.score !== "number" || !raw.rationale) {
      throw new Error("invalid schema");
    }
    return {
      signal: raw.signal,
      score: Math.max(0, Math.min(100, Math.round(raw.score))),
      rationale: String(raw.rationale).slice(0, 200),
      risks: Array.isArray(raw.risks) ? raw.risks.slice(0, 4).map(String) : [],
      catalysts: Array.isArray(raw.catalysts) ? raw.catalysts.slice(0, 4).map(String) : [],
    };
  } catch (e) {
    return { error: e.message };
  }
}

// ─── 主流程 ────────────────────────────────────────────────
async function main() {
  console.log("📊 Refresh real data — Yahoo v8 chart + Gemma 4 31B");
  console.log("================================================\n");

  // 讀取舊 snapshot 作為 fallback
  let oldSnapshot = {};
  if (existsSync(SNAPSHOT)) {
    try { oldSnapshot = JSON.parse(readFileSync(SNAPSHOT, "utf-8")); } catch {}
  }

  // 1. 抓 OHLC（序列 + 隨機 delay 避免反爬）
  console.log("1️⃣  Fetching Yahoo v8 OHLC for 12 stocks (sequential, polite)...");
  const ohlcMap = {};
  let ohlcOk = 0;
  for (const sym of SYMBOLS) {
    try {
      const data = await fetchOhlc(sym);
      ohlcMap[sym] = data;
      ohlcOk++;
      console.log(`  ✅ ${sym}: ${data.ohlc.length} days, ${data.regularMarketPrice} ${data.currency}`);
    } catch (e) {
      console.log(`  ❌ ${sym}: ${e.message}`);
      if (oldSnapshot.stocks?.[sym]) {
        ohlcMap[sym] = oldSnapshot.stocks[sym];
        console.log(`     → 用舊快照繼續`);
      }
    }
    // polite delay 4-6s（避免 Yahoo ban）
    await new Promise((r) => setTimeout(r, 4000 + Math.random() * 2000));
  }
  console.log(`   → ${ohlcOk}/${SYMBOLS.length} OHLC 抓到\n`);

  // 2. 對每檔跑 11 策略
  console.log("2️⃣  Computing 11 strategies for each stock...");
  const strategiesMap = {};
  const ids = ["ma-trend", "rsi-momentum", "macd-cross", "elliott-wave", "volume-profile", "bollinger-band", "vwap-reversion", "news-sentiment", "sector-rotation", "risk-overlay", "consensus"];
  for (const sym of SYMBOLS) {
    const data = ohlcMap[sym];
    if (!data?.ohlc) continue;
    strategiesMap[sym] = {};
    for (const id of ids) strategiesMap[sym][id] = computeStrategy(id, data.ohlc);
    const c = strategiesMap[sym].consensus;
    console.log(`  📊 ${sym}: consensus ${c.signal.toUpperCase()} ${c.score}`);
  }
  console.log("");

  // 3. Gemma 4 真打決策
  const apiKey = process.env.GEMINI_API_KEY;
  const aiMap = {};
  if (apiKey) {
    console.log("3️⃣  Calling Gemma 4 31B for AI decisions (sequential)...");
    // Stock metadata（match portfolio.ts 順序與資訊）
    const META = {
      "2330.TW":   { shortCode: "2330",   name: "台積電",   sector: "半導體", market: "TW" },
      "2454.TW":   { shortCode: "2454",   name: "聯發科",   sector: "半導體", market: "TW" },
      "2317.TW":   { shortCode: "2317",   name: "鴻海",     sector: "電子代工", market: "TW" },
      "0050.TW":   { shortCode: "0050",   name: "元大台灣 50", sector: "ETF",  market: "TW" },
      "AAPL":      { shortCode: "AAPL",   name: "蘋果",     sector: "消費電子", market: "US" },
      "NVDA":      { shortCode: "NVDA",   name: "輝達",     sector: "半導體", market: "US" },
      "TSLA":      { shortCode: "TSLA",   name: "特斯拉",   sector: "電動車", market: "US" },
      "MSFT":      { shortCode: "MSFT",   name: "微軟",     sector: "雲端運算", market: "US" },
      "0700.HK":   { shortCode: "0700",   name: "騰訊",     sector: "網際網路", market: "HK" },
      "9988.HK":   { shortCode: "9988",   name: "阿里巴巴", sector: "網際網路", market: "HK" },
      "600519.SS": { shortCode: "600519", name: "貴州茅台", sector: "白酒", market: "CN" },
      "000858.SZ": { shortCode: "000858", name: "五糧液",   sector: "白酒", market: "CN" },
    };
    for (const sym of SYMBOLS) {
      const data = ohlcMap[sym];
      const strats = strategiesMap[sym];
      const meta = META[sym];
      if (!data?.ohlc || !strats || !meta) continue;
      process.stdout.write(`  🧠 ${sym}... `);
      const stock = { symbol: sym, ...meta };
      const result = await callGemmaDecision(stock, data.ohlc, strats, apiKey);
      if (result && !result.error) {
        aiMap[sym] = result;
        console.log(`✅ ${result.signal} ${result.score}`);
      } else {
        console.log(`❌ ${result?.error ?? "unknown"}`);
      }
      await new Promise((r) => setTimeout(r, 500)); // 避免速率限制
    }
  } else {
    console.log("3️⃣  ⚠️  GEMINI_API_KEY 未設定，跳過 AI 決策");
  }
  console.log("");

  // 4. Yahoo 新聞
  console.log("4️⃣  Fetching Yahoo Finance news...");
  let news = [];
  try {
    news = await fetchYahooNews();
    console.log(`  ✅ ${news.length} 則新聞抓到`);
  } catch (e) {
    console.log(`  ❌ ${e.message}`);
  }
  console.log("");

  // 5. 寫入 snapshot
  console.log("5️⃣  Saving snapshot...");
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const snapshot = {
    refreshedAt: new Date().toISOString(),
    stocks: ohlcMap,
    strategies: strategiesMap,
    aiDecisions: aiMap,
    news,
  };
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2));
  console.log(`  ✅ Wrote ${SNAPSHOT}`);

  console.log("\n📈 Summary:");
  console.log(`  OHLC:        ${Object.keys(ohlcMap).length} / 12 stocks`);
  console.log(`  Strategies:  ${Object.keys(strategiesMap).length} / 12 stocks`);
  console.log(`  AI decisions: ${Object.keys(aiMap).length} / 12 stocks`);
  console.log(`  News:        ${news.length} items`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
