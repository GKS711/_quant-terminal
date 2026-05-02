/**
 * /api/refresh-news — 即時抓 Yahoo Finance 24h 新聞 (6 條)
 *
 * UI flow：News Feed section 「🔄 重抓 24h」按鈕 → 此 endpoint → 替換前端 list
 *
 * 設計：
 *   - curl shell-out（Node fetch 會被 Yahoo ban）
 *   - 用 4 個 query 串接抓 6 條（去重）
 *   - 簡易詞袋情緒打分（同 components/news-feed.tsx adaptYahooNews 邏輯）
 */

import { NextRequest } from "next/server";
import { execSync } from "node:child_process";
import type { NewsItem, SentimentLevel } from "@/lib/news-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36";

interface YahooNewsRaw {
  uuid: string;
  title: string;
  link: string;
  publisher: string;
  providerPublishTime: number;
  relatedTickers?: string[];
}

async function fetchYahooNews(): Promise<YahooNewsRaw[]> {
  const tries = ["AAPL", "NVDA", "TSMC", "Tencent"];
  const news: YahooNewsRaw[] = [];
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
    } catch {
      // 單一 query 失敗繼續下一個
    }
  }
  return news;
}

function scoreSentiment(title: string): { score: number; level: SentimentLevel } {
  const text = title.toLowerCase();
  const bullWords = ["surge", "rally", "gain", "rise", "beat", "strong", "breakthrough", "record", "soar", "boost"];
  const bearWords = ["fall", "drop", "miss", "weak", "concern", "fear", "decline", "plunge", "sell-off", "tumble", "slump"];
  let s = 0;
  bullWords.forEach((w) => { if (text.includes(w)) s += 0.18; });
  bearWords.forEach((w) => { if (text.includes(w)) s -= 0.18; });
  s = Math.max(-1, Math.min(1, s));
  const level: SentimentLevel =
    s > 0.5 ? "strong_bull" :
    s > 0.2 ? "bull" :
    s < -0.5 ? "strong_bear" :
    s < -0.2 ? "bear" : "neutral";
  return { score: s, level };
}

function adaptToNewsItem(raw: YahooNewsRaw, idx: number): NewsItem {
  const { score, level } = scoreSentiment(raw.title || "");
  const hoursAgo = raw.providerPublishTime
    ? Math.max(1, Math.floor((Date.now() / 1000 - raw.providerPublishTime) / 3600))
    : idx + 1;
  return {
    id: raw.uuid,
    title: raw.title,
    source: raw.publisher ?? "Yahoo Finance",
    publishedAt: raw.providerPublishTime
      ? new Date(raw.providerPublishTime * 1000).toISOString()
      : new Date().toISOString(),
    hoursAgo,
    symbols: (raw.relatedTickers ?? []).slice(0, 5),
    sentiment: score,
    sentimentLevel: level,
    summary: "",
    url: raw.link,
  };
}

export async function POST(_req: NextRequest) {
  const t0 = Date.now();
  try {
    const raw = await fetchYahooNews();
    if (raw.length === 0) {
      return Response.json({ ok: false, error: "yahoo: no news (rate limited?)" }, { status: 502 });
    }
    const news = raw.map(adaptToNewsItem);
    return Response.json({
      ok: true,
      news,
      refreshedAt: new Date().toISOString(),
      elapsedMs: Date.now() - t0,
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e?.message ?? e) }, { status: 502 });
  }
}

// 同時支援 GET（讓 Vercel cron 能直接 hit）
export async function GET(req: NextRequest) {
  return POST(req);
}
