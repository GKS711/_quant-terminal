import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockResponse } from "@/lib/mock-chat";
import { checkRateLimit, getClientIp, RATE_LIMIT_CHAT, cleanupOld } from "@/lib/rate-limit";
import { PORTFOLIO, MARKETS, type Stock } from "@/lib/portfolio";
import { SNAPSHOT } from "@/lib/cached";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY_TURNS = 12;
const SERVER_TIMEOUT_MS = 45_000;

const CURRENCY_SYM: Record<string, string> = {
  TWD: "NT$", USD: "$", HKD: "HK$", CNY: "¥",
};

/**
 * 動態組裝 systemPrompt — 把 build-time snapshot 的真實 12 檔報價 + 30 日變動 +
 * 11 策略共識訊號注入進去，讓 AI 顧問能直接引用真實數字回答，不必說「我沒有資料」。
 */
function buildSystemPrompt(): string {
  const lines: string[] = [];
  for (const stock of PORTFOLIO) {
    const market = MARKETS[stock.market];
    const sym = CURRENCY_SYM[market.currency] ?? "$";
    const price = stock.quote?.price ?? stock.spark30d?.at(-1) ?? 0;
    const closes = stock.spark30d ?? [];
    const change30d =
      closes.length >= 2 ? ((closes.at(-1)! - closes[0]) / closes[0]) * 100 : 0;
    const ai = stock.decision;
    lines.push(
      `- ${market.flag} ${stock.shortCode} ${stock.name}（${stock.sector}）` +
      `${sym}${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` +
      ` | 30d ${change30d >= 0 ? "+" : ""}${change30d.toFixed(2)}%` +
      ` | AI共識：${ai.signal.toUpperCase()} ${ai.score}/100`,
    );
  }
  const refreshedAt = SNAPSHOT.refreshedAt
    ? new Date(SNAPSHOT.refreshedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    : "尚未更新";
  return `你是「AI 顧問」的多市場投資副駕，涵蓋台股 / 美股 / 港股 / A 股共 12 檔精選股票（後端是 _quant-terminal 開源系統）。
任務：用沉穩、白話的繁體中文，向散戶解釋投資觀念與多空訊號。

【今日真實快照】（資料更新：${refreshedAt}）
${lines.join("\n")}

【回答規則】
- 被問到任何上述 12 檔個股時，**直接引用上面快照的真實價格、30 天變動、AI 共識訊號**，不要說「我沒有資料」
- 引用方式自然嵌入：例如「目前 NVDA 收 $208.26、30 天累漲 15.55%、AI 共識 hold 24/100，多策略偏中性」
- 多市場貨幣自動切換：TW→NT$、US→$、HK→HK$、CN→¥
- **不要捏造**沒列出的股價數字，沒列出的才說「我沒有最新資料」
- 用短段落 + 條列；長度適中，不要冗長
- 每次回答結尾附一句免責聲明（你不是合格的理財顧問）
- 你提供的是「決策參考」、「多空觀察」，不是「買進指令」——語氣要委婉，幫使用者建立判斷依據
- 用繁體中文回覆`;
}

interface ChatBody {
  message?: string;
  history?: { role: "user" | "model"; text: string }[];
}

/**
 * Gemma 4 (2026/04 發布) 支援 systemInstruction；Gemma 3 與更早版本不支援，
 * 需要用「在 history 開頭注入規則 + 助理確認」的方式 seed。
 */
function supportsSystemInstruction(modelName: string): boolean {
  const m = modelName.toLowerCase();
  if (m.startsWith("gemini")) return true;
  if (m.startsWith("gemma-4")) return true;
  // gemma-3-*, gemma-2-*, 其他
  return false;
}

export async function POST(req: NextRequest) {
  // ── Rate limit (per-IP) ──
  cleanupOld();
  const ip = getClientIp(req);
  const rl = checkRateLimit(`chat:${ip}`, RATE_LIMIT_CHAT);
  if (!rl.ok) {
    return new Response(
      `太頻繁了，請 ${Math.ceil(rl.resetMs / 1000)} 秒後再試。`,
      { status: 429, headers: { "retry-after": String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  const body = (await req.json().catch(() => ({}))) as ChatBody;
  const message = (body.message ?? "").trim();
  if (!message) {
    return new Response("message is required", { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return new Response(`message too long (max ${MAX_MESSAGE_CHARS} chars)`, { status: 413 });
  }
  // 強制 history 上限：保留最後 N 輪
  if (body.history && body.history.length > MAX_HISTORY_TURNS * 2) {
    body.history = body.history.slice(-MAX_HISTORY_TURNS * 2);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL ?? "gemma-4-31b-it";

  // -------- Mock fallback (沒設定 API key 時) --------
  if (!apiKey) {
    return streamText(mockResponse(message));
  }

  // -------- Live Gemini / Gemma --------
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const useSystemInstruction = supportsSystemInstruction(modelName);
    const systemPrompt = buildSystemPrompt();

    const model = genAI.getGenerativeModel(
      useSystemInstruction
        ? { model: modelName, systemInstruction: systemPrompt }
        : { model: modelName },
    );

    // Gemini API 要求 conversation 必須以 user role 開頭，所以丟棄 leading model entries
    // （前端 welcome message 是 model role，必須濾掉）
    let cleanedHistory = body.history ?? [];
    while (cleanedHistory.length > 0 && cleanedHistory[0].role !== "user") {
      cleanedHistory = cleanedHistory.slice(1);
    }
    const historyParts = cleanedHistory.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    // 對舊版 Gemma 用 chat-template seed
    const seedHistory = useSystemInstruction
      ? historyParts
      : [
          { role: "user" as const, parts: [{ text: systemPrompt }] },
          { role: "model" as const, parts: [{ text: "了解，我會以繁體中文、簡潔風格回答台股相關問題。" }] },
          ...historyParts,
        ];

    const chat = model.startChat({
      history: seedHistory,
      generationConfig: {
        temperature: 0.4,
        // Gemma 4 是 thinking model，推理 token 也計入
        // 中文回答容易被消耗，4096 足夠完整詳答
        maxOutputTokens: 4096,
      },
    });

    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            // Gemma 4 是 thinking model，回傳 parts[] 內含 thought:true 的推理過程
            // 過濾掉 thought 部分，只串流給用戶看的最終回答
            const parts = (chunk as any).candidates?.[0]?.content?.parts ?? [];
            const visibleText = parts
              .filter((p: any) => !p.thought && p.text)
              .map((p: any) => p.text)
              .join("");
            if (visibleText) controller.enqueue(encoder.encode(visibleText));
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode("\n\n[串流發生錯誤——切換為示範回應]\n\n" + mockResponse(message)),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-source": modelName.toLowerCase().startsWith("gemma") ? "gemma-live" : "gemini-live",
        "x-model": modelName,
      },
    });
  } catch (err) {
    return streamText(mockResponse(message));
  }
}

/** 把固定字串依詞元切片串流。 */
function streamText(text: string): Response {
  const encoder = new TextEncoder();
  const tokens = text.match(/(\s+|[^\s]+)/g) ?? [text];
  const stream = new ReadableStream({
    async start(controller) {
      for (const t of tokens) {
        controller.enqueue(encoder.encode(t));
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-source": "mock",
    },
  });
}
