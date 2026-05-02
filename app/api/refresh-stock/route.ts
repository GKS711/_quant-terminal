/**
 * /api/refresh-stock — 即時重抓單檔股票（Yahoo OHLC + 11 策略 + Gemma 4 決策）
 *
 * 前端按下「🔄 重抓」按鈕觸發。30 秒內回傳新鮮資料，前端 in-memory 更新（不寫 fs）。
 *
 * 設計取捨：
 *   - 單檔（不全 12 檔）：Vercel serverless 60s timeout 撐得住單檔
 *   - 不寫 snapshot.json：Vercel filesystem read-only；snapshot 仍是 build-time baseline
 *   - Yahoo 失敗 → fallback 拿 snapshot.json 當前值（前端顯示「資料來自 build-time」）
 */

import { NextRequest } from "next/server";
import { execSync } from "node:child_process";
import { computeAllStrategies } from "@/lib/indicators";
import type { OHLC } from "@/lib/yahoo-fetch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// 與 scripts/refresh-data.mjs 對齊：Node fetch 會被 Yahoo ban，必須用 curl shell-out
const UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36";

const ALLOWED = new Set([
  "2330.TW", "2454.TW", "2317.TW", "0050.TW",
  "AAPL", "NVDA", "TSLA", "MSFT",
  "0700.HK", "9988.HK",
  "600519.SS", "000858.SZ",
]);

const NAME_MAP: Record<string, { name: string; sector: string; market: string; shortCode: string }> = {
  "2330.TW": { name: "台積電", sector: "半導體", market: "TW", shortCode: "2330" },
  "2454.TW": { name: "聯發科", sector: "IC 設計", market: "TW", shortCode: "2454" },
  "2317.TW": { name: "鴻海", sector: "電子代工", market: "TW", shortCode: "2317" },
  "0050.TW": { name: "元大台灣 50", sector: "ETF", market: "TW", shortCode: "0050" },
  "AAPL": { name: "Apple", sector: "Tech", market: "US", shortCode: "AAPL" },
  "NVDA": { name: "NVIDIA", sector: "半導體", market: "US", shortCode: "NVDA" },
  "TSLA": { name: "Tesla", sector: "EV", market: "US", shortCode: "TSLA" },
  "MSFT": { name: "Microsoft", sector: "Tech", market: "US", shortCode: "MSFT" },
  "0700.HK": { name: "騰訊", sector: "Tech", market: "HK", shortCode: "0700" },
  "9988.HK": { name: "阿里巴巴", sector: "Tech", market: "HK", shortCode: "9988" },
  "600519.SS": { name: "貴州茅台", sector: "白酒", market: "CN", shortCode: "600519" },
  "000858.SZ": { name: "五糧液", sector: "白酒", market: "CN", shortCode: "000858" },
};

async function fetchOhlc(symbol: string): Promise<OHLC[]> {
  const hosts = ["query2.finance.yahoo.com", "query1.finance.yahoo.com"];
  let lastErr: Error | null = null;
  for (const host of hosts) {
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(symbol)}?range=2mo&interval=1d`;
    try {
      const out = execSync(
        `curl -sLf --max-time 10 -H "User-Agent: ${UA}" -H "Referer: https://finance.yahoo.com/" "${url}"`,
        { encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 },
      );
      const j = JSON.parse(out);
      const result = j?.chart?.result?.[0];
      if (!result) throw new Error("empty result");
      const ts: number[] = result.timestamp ?? [];
      const q = result.indicators?.quote?.[0] ?? {};
      const closes = q.close ?? [];
      const opens = q.open ?? [];
      const highs = q.high ?? [];
      const lows = q.low ?? [];
      const vols = q.volume ?? [];
      const ohlc: OHLC[] = [];
      for (let i = 0; i < ts.length; i++) {
        if (closes[i] == null) continue;
        ohlc.push({
          time: ts[i],
          open: Number(opens[i] ?? closes[i]),
          high: Number(highs[i] ?? closes[i]),
          low: Number(lows[i] ?? closes[i]),
          close: Number(closes[i]),
          volume: Number(vols[i] ?? 0),
        });
      }
      return ohlc.slice(-30);
    } catch (e: any) {
      lastErr = new Error(`${host}: ${e?.message?.split("\n")[0] ?? e}`);
    }
  }
  throw lastErr ?? new Error(`${symbol}: all hosts failed`);
}

async function callGemma(args: {
  symbol: string;
  meta: { name: string; sector: string; market: string; shortCode: string };
  ohlc: OHLC[];
  strategySnapshot: Record<string, { signal: string; score: number; detail?: string }>;
}, apiKey: string) {
  const { symbol, meta, ohlc, strategySnapshot } = args;
  const closes = ohlc.map((d) => d.close);
  const lastPrice = closes.at(-1) ?? 0;
  const change30d = closes.length >= 2 ? ((closes.at(-1)! - closes[0]) / closes[0]) * 100 : 0;

  const consensus = strategySnapshot.consensus ?? { signal: "hold", score: 50, detail: "" };
  const buyCount = Object.values(strategySnapshot).filter((s) => s.signal === "buy").length;
  const sellCount = Object.values(strategySnapshot).filter((s) => s.signal === "sell").length;

  const prompt = `你是台股／美股／港股／A 股量化分析引擎。針對下列標的，根據真實價格與 11 策略訊號，輸出**單一 JSON 物件**作為決策結果。

【標的】
代號：${meta.shortCode}（${symbol}）
名稱：${meta.name}
產業：${meta.sector}
市場：${meta.market}
今日收盤：${lastPrice.toFixed(2)}（30 日變動 ${change30d > 0 ? "+" : ""}${change30d.toFixed(2)}%）

【11 策略訊號摘要】
- 多頭訊號：${buyCount} / 11
- 空頭訊號：${sellCount} / 11
- 共識決策：${consensus.signal} (score ${consensus.score}) — ${consensus.detail ?? ""}

【嚴格輸出格式】
僅輸出 JSON，不要 markdown、不要 code fence、不要其他文字。
{
  "signal": "buy" | "hold" | "sell",
  "score": 0-100 整數,
  "rationale": "一句話繁體中文，不超過 60 字，要根據上述真實數據而非泛泛而論",
  "risks": ["風險 1", "風險 2"],
  "catalysts": ["利多 1", "利多 2"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
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
    const text = parts.filter((p: any) => !p.thought && p.text).map((p: any) => p.text).join("").trim();

    let raw: any;
    try {
      raw = JSON.parse(text);
    } catch {
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

    return {
      signal: String(raw.signal ?? "hold"),
      score: Math.max(0, Math.min(100, Math.round(Number(raw.score ?? 50)))),
      rationale: String(raw.rationale ?? "").slice(0, 200),
      risks: Array.isArray(raw.risks) ? raw.risks.slice(0, 4).map(String) : [],
      catalysts: Array.isArray(raw.catalysts) ? raw.catalysts.slice(0, 4).map(String) : [],
    };
  } catch (e: any) {
    return { error: e?.message ?? "gemma failed" };
  }
}

export async function POST(req: NextRequest) {
  let body: { symbol?: string };
  try {
    body = (await req.json()) as { symbol?: string };
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const symbol = String(body.symbol ?? "").trim();
  if (!ALLOWED.has(symbol)) {
    return Response.json({ ok: false, error: "unknown symbol" }, { status: 400 });
  }
  const meta = NAME_MAP[symbol];

  const t0 = Date.now();
  // 1. Yahoo OHLC
  let ohlc: OHLC[];
  try {
    ohlc = await fetchOhlc(symbol);
    if (ohlc.length < 5) throw new Error("insufficient ohlc");
  } catch (e: any) {
    return Response.json({ ok: false, error: `yahoo: ${e?.message ?? e}` }, { status: 502 });
  }

  // 2. 11 strategies
  const strategiesAll = computeAllStrategies(ohlc);
  const strategies: Record<string, { signal: string; score: number; detail?: string }> = {};
  for (const [k, v] of Object.entries(strategiesAll)) {
    strategies[k] = { signal: v.signal, score: v.score, detail: (v as any).detail };
  }

  // 3. Gemma 4 真打
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  let decision: any = null;
  if (apiKey) {
    decision = await callGemma({ symbol, meta, ohlc, strategySnapshot: strategies }, apiKey);
  } else {
    decision = { error: "no GEMINI_API_KEY (server)" };
  }

  const last = ohlc.at(-1)!;
  const first = ohlc[0];
  const change30d = ((last.close - first.close) / first.close) * 100;

  return Response.json({
    ok: true,
    symbol,
    meta,
    quote: {
      price: last.close,
      change30dPct: Number(change30d.toFixed(2)),
      time: last.time,
    },
    ohlc,
    strategies,
    decision,
    elapsedMs: Date.now() - t0,
    refreshedAt: new Date().toISOString(),
  });
}
