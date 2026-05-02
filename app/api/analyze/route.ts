/**
 * /api/analyze — 餵 Gemma 4 31B 一檔股票的最近價格 + 策略名稱，要求回 JSON 決策
 *
 * Codex 建議套用三層：
 *   1. responseMimeType: "application/json"（讓 Gemma 知道要 JSON）
 *   2. 強指令禁止 markdown / 額外文字
 *   3. zod 驗證；驗證失敗 → 1 次重試 → 仍失敗 fallback to mock
 *
 * 防止模型發明價格：把實際 quote 帶進 prompt，禁止它自己推算。
 */

import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { getStockBySymbol, type Signal } from "@/lib/portfolio";
import { getStrategyById, type StrategyId, getStrategySignal } from "@/lib/strategies";
import { checkRateLimit, getClientIp, RATE_LIMIT_ANALYZE, cleanupOld } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIMARY_TIMEOUT_MS = 30_000;
const FALLBACK_TIMEOUT_MS = 20_000;

// ─── 結果 schema（Codex 推薦 strict JSON） ──────────────────

const AnalyzeResultSchema = z
  .object({
    signal: z.enum(["buy", "hold", "sell"]),
    score: z.number().int().min(0).max(100),
    rationale: z.string().min(1).max(120),
    risks: z.array(z.string().min(1)).min(1).max(5),
    checklist: z.array(z.string().min(1)).min(1).max(5),
  })
  .strict();

export type AnalyzeResult = z.infer<typeof AnalyzeResultSchema>;

// ─── Request schema ───────────────────────────────────────

const RequestSchema = z.object({
  symbol: z.string(),       // "2330.TW"
  strategy: z.string(),     // 策略 id
  lookbackDays: z.number().int().min(5).max(180).default(30),
});

// ─── Prompt builder ───────────────────────────────────────

function buildPrompt(args: {
  symbol: string;
  shortCode: string;
  name: string;
  sector: string;
  strategyZh: string;
  strategyDesc: string;
  price?: number;
  changePct?: number;
  context?: string;
}): string {
  const priceLine =
    args.price !== undefined
      ? `今日報價：NT$${args.price.toFixed(2)} (${args.changePct! >= 0 ? "+" : ""}${args.changePct?.toFixed(2)}%)`
      : `（未提供即時報價）`;

  return `你是台股量化分析引擎。針對下列標的與策略，輸出**單一 JSON 物件**作為決策結果。

【標的】
代號：${args.shortCode}（${args.symbol}）
名稱：${args.name}
產業：${args.sector}
${priceLine}

【策略】
${args.strategyZh}：${args.strategyDesc}

${args.context ? `【背景脈絡】\n${args.context}\n` : ""}
【嚴格輸出格式】
僅輸出 JSON，不要 markdown、不要 code fence、不要任何前後文字。
{
  "signal": "buy" | "hold" | "sell",
  "score": 0-100 整數,
  "rationale": "一句話繁體中文，不超過 60 字",
  "risks": ["風險 1", "風險 2", ...] (2-4 條),
  "checklist": ["建議動作 1", "動作 2", ...] (2-4 條)
}

【重要規則】
- 不要捏造未提供的股價數字
- score 必須是 0-100 整數
- signal 只能是 "buy" / "hold" / "sell"（小寫）
- 整體輸出必須是有效 JSON，可直接 JSON.parse`;
}

// ─── 從 LLM 文字輸出抓第一個完整 JSON object（brace counter）──
function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

// ─── Mock fallback（用 deterministic strategy signal）──────

function mockResult(symbol: string, strategy: StrategyId): AnalyzeResult {
  const stock = getStockBySymbol(symbol);
  if (!stock) {
    return {
      signal: "hold",
      score: 50,
      rationale: "資料不足，先觀察，避免追高殺低。",
      risks: ["資料不足", "市場波動"],
      checklist: ["等待更多訊號", "分批進場為佳"],
    };
  }
  const sig = getStrategySignal(stock, strategy);
  return {
    signal: sig.signal,
    score: sig.score,
    rationale: stock.decision.rationale,
    risks: stock.decision.risks.length > 0 ? stock.decision.risks : ["市場波動"],
    checklist:
      stock.decision.catalysts.length > 0
        ? stock.decision.catalysts.slice(0, 3)
        : ["持續追蹤", "嚴守紀律"],
  };
}

// ─── Main handler ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 0. Rate limit
  cleanupOld();
  const ip = getClientIp(req);
  const rl = checkRateLimit(`analyze:${ip}`, RATE_LIMIT_ANALYZE);
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited", retryAfterMs: rl.resetMs },
      { status: 429, headers: { "retry-after": String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  // 1. 解析 + 驗證 request
  let parsed: z.infer<typeof RequestSchema>;
  try {
    const body = await req.json();
    parsed = RequestSchema.parse(body);
  } catch (e: unknown) {
    return Response.json(
      { ok: false, error: "invalid request body", detail: String(e) },
      { status: 400 },
    );
  }

  const { symbol, strategy } = parsed;
  const stock = getStockBySymbol(symbol);
  if (!stock) {
    return Response.json(
      { ok: false, error: `unknown symbol: ${symbol}` },
      { status: 404 },
    );
  }

  const strategyMeta = getStrategyById(strategy as StrategyId);
  if (!strategyMeta) {
    return Response.json(
      { ok: false, error: `unknown strategy: ${strategy}` },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL ?? "gemma-4-31b-it";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL ?? "gemma-4-26b-a4b-it";

  // 2. Mock fallback 當沒 key
  if (!apiKey) {
    return Response.json({
      ok: true,
      source: "mock",
      result: mockResult(symbol, strategy as StrategyId),
    });
  }

  // 3. 真打 Gemma 4 31B
  const tryModel = async (model: string): Promise<AnalyzeResult> => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const m = genAI.getGenerativeModel({
      model,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 600,
        // Gemma 支援 application/json mime type 確保純 JSON 輸出
        responseMimeType: "application/json",
      },
    });

    const prompt = buildPrompt({
      symbol: stock.symbol,
      shortCode: stock.shortCode,
      name: stock.name,
      sector: stock.sector,
      strategyZh: strategyMeta.nameZh,
      strategyDesc: strategyMeta.description,
      price: stock.quote?.price,
      changePct: stock.quote?.changePct,
      context: `策略 mock 訊號參考：${getStrategySignal(stock, strategy as StrategyId).signal} / 分數 ${getStrategySignal(stock, strategy as StrategyId).score}`,
    });

    const result = await m.generateContent(prompt);
    const text = result.response.text().trim();

    // 用 brace-counter 從第一個 { 找到對應的 }，避免 Gemma 在後面接多餘內容
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      const extracted = extractFirstJsonObject(text);
      if (!extracted) throw new Error("model did not return JSON");
      raw = JSON.parse(extracted);
    }
    return AnalyzeResultSchema.parse(raw);
  };

  const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms)),
    ]);

  try {
    const result = await withTimeout(tryModel(modelName), PRIMARY_TIMEOUT_MS);
    return Response.json({ ok: true, source: modelName, result });
  } catch (e1: unknown) {
    // Retry with fallback model（也設 timeout）
    try {
      const result = await withTimeout(tryModel(fallbackModel), FALLBACK_TIMEOUT_MS);
      return Response.json({
        ok: true,
        source: `${fallbackModel} (fallback)`,
        result,
        retriedAfter: String(e1),
      });
    } catch (e2: unknown) {
      return Response.json({
        ok: true,
        source: "mock (after live failures)",
        result: mockResult(symbol, strategy as StrategyId),
        liveError: String(e2),
      });
    }
  }
}

// ─── 給前端用的 Signal 型別 export ──────────────────────────
export type { Signal };
