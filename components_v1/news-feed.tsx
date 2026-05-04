"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { NEWS as MOCK_NEWS, sentimentColor, sentimentLabel, type NewsItem, type SentimentLevel } from "@/lib/news-data";
import { SNAPSHOT } from "@/lib/cached";

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";

/** Yahoo 真新聞 → NewsItem 格式（情緒先用標題簡單詞袋估算）*/
function adaptYahooNews(): NewsItem[] {
  const yahoo = SNAPSHOT.news ?? [];
  if (yahoo.length === 0) return [];
  return yahoo.map((n, i) => {
    const text = (n.title || "").toLowerCase();
    // 簡易情緒詞袋
    const bullWords = ["surge", "rally", "gain", "rise", "beat", "strong", "breakthrough", "record"];
    const bearWords = ["fall", "drop", "miss", "weak", "concern", "fear", "decline", "plunge", "sell-off"];
    let s = 0;
    bullWords.forEach((w) => { if (text.includes(w)) s += 0.18; });
    bearWords.forEach((w) => { if (text.includes(w)) s -= 0.18; });
    s = Math.max(-1, Math.min(1, s));
    const level: SentimentLevel =
      s > 0.5 ? "strong_bull" :
      s > 0.2 ? "bull" :
      s < -0.5 ? "strong_bear" :
      s < -0.2 ? "bear" : "neutral";
    const hoursAgo = n.providerPublishTime
      ? Math.max(1, Math.floor((Date.now() / 1000 - n.providerPublishTime) / 3600))
      : i + 1;
    return {
      id: n.uuid,
      title: n.title,
      source: n.publisher,
      publishedAt: new Date(n.providerPublishTime * 1000).toISOString(),
      hoursAgo,
      symbols: (n.relatedTickers || []).slice(0, 5),
      sentiment: s,
      sentimentLevel: level,
      summary: "",
      url: n.link,
    };
  });
}

export function NewsFeed() {
  const [filter, setFilter] = useState<"all" | "bull" | "bear">("all");
  const realNews = useMemo(() => adaptYahooNews(), []);
  const [freshNews, setFreshNews] = useState<NewsItem[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const NEWS = freshNews ?? (realNews.length > 0 ? realNews : MOCK_NEWS);
  const isReal = freshNews !== null || realNews.length > 0;
  const isLive = freshNews !== null;

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const r = await fetch("/api/refresh-news", { method: "POST" });
      const j = await r.json();
      if (j.ok && Array.isArray(j.news)) {
        setFreshNews(j.news as NewsItem[]);
        setRefreshedAt(new Date());
      } else {
        setRefreshError(j.error ?? "刷新失敗");
      }
    } catch (e: any) {
      setRefreshError(e?.message ?? "網路錯誤");
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = NEWS.filter((n) => {
    if (filter === "all") return true;
    if (filter === "bull") return n.sentiment > 0.2;
    if (filter === "bear") return n.sentiment < -0.2;
    return true;
  });

  return (
    <section
      className="relative py-20 border-b border-white/[0.06]"
      style={{ background: "#08090a" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Newspaper className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>News Feed · 24h</span>
          {isReal ? (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
              style={{
                background: "rgba(16,185,129,0.10)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.30)",
                fontWeight: 590,
              }}
              title="從 Yahoo Finance search API 抓的真實新聞"
            >
              LIVE · YAHOO
            </span>
          ) : (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
              style={{
                background: "rgba(252,211,77,0.10)",
                color: "#FCD34D",
                border: "1px solid rgba(252,211,77,0.30)",
                fontWeight: 590,
              }}
            >
              DEMO
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.04em] text-white max-w-[680px]"
              style={{ fontWeight: 510 }}
            >
              新聞 + <span style={{ color: MINT_BRIGHT }} className="italic font-normal">情緒分數</span>
            </h2>
            <p className="mt-3 text-[14px]" style={{ color: "#a8a8b3" }}>
              LLM 自動掃描 24h 內 234 篇新聞，每則 -1 ~ +1 情緒打分
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-mono flex-wrap">
            {/* refresh button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              aria-live="polite"
              title="重抓 Yahoo Finance 24h 最新新聞"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
              style={{
                background: isLive ? `${MINT}1f` : "rgba(255,255,255,0.02)",
                color: isLive ? MINT_BRIGHT : "#a8a8b3",
                border: `1px solid ${isLive ? `${MINT}66` : "rgba(255,255,255,0.10)"}`,
                fontWeight: 510,
              }}
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "重抓中…" : isLive ? "已更新 · 再抓" : "重抓 24h"}
            </button>

            {/* divider */}
            <span className="mx-1 text-[#3a3d42]">|</span>

            {(["all", "bull", "bear"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full px-3 py-1.5 transition-colors"
                style={{
                  background: filter === f ? "rgba(78,170,133,0.15)" : "rgba(255,255,255,0.02)",
                  color: filter === f ? MINT_BRIGHT : "#a8a8b3",
                  border: `1px solid ${filter === f ? "rgba(78,170,133,0.4)" : "rgba(255,255,255,0.08)"}`,
                  fontWeight: filter === f ? 590 : 510,
                }}
              >
                {f === "all" ? "全部" : f === "bull" ? "↑ 偏多" : "↓ 偏空"}
              </button>
            ))}
          </div>
        </div>

        {/* refresh status hint */}
        {(refreshedAt || refreshError) && (
          <div
            className="mb-4 text-[11px] font-mono"
            style={{ color: refreshError ? "#F59E0B" : "#62666d" }}
            aria-live="polite"
          >
            {refreshError
              ? `⚠ 刷新失敗：${refreshError}（顯示 build-time 資料）`
              : `✓ 已更新於 ${refreshedAt!.toLocaleTimeString("zh-TW")} · LIVE 即時資料`}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <NewsCard key={item.id} news={item} delay={i * 0.06} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] text-[#62666d]">
            目前沒有符合篩選條件的新聞。
          </div>
        )}
      </div>
    </section>
  );
}

function NewsCard({ news, delay }: { news: NewsItem; delay: number }) {
  const color = sentimentColor(news.sentimentLevel);
  const label = sentimentLabel(news.sentimentLevel);
  const clickable = !!news.url;

  const Wrapper: any = clickable ? motion.a : motion.article;
  const wrapperProps = clickable
    ? { href: news.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
      className={`block rounded-xl p-5 group ${clickable ? "cursor-pointer" : ""}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        textDecoration: "none",
      }}
    >
      {/* meta row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#62666d] uppercase tracking-wider">
          <span style={{ color: "#a8a8b3", fontWeight: 590 }}>{news.source}</span>
          <span>·</span>
          <Clock className="h-2.5 w-2.5" />
          <span>{news.hoursAgo}h ago</span>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider"
          style={{
            background: `${color}1a`,
            color,
            border: `1px solid ${color}40`,
            fontWeight: 590,
          }}
        >
          {label}
          <span className="tabular-nums">
            {news.sentiment >= 0 ? "+" : ""}{news.sentiment.toFixed(2)}
          </span>
        </span>
      </div>

      {/* title */}
      <h3
        className="text-[15px] leading-[1.4] mb-2 group-hover:text-white transition-colors"
        style={{ color: "#e5e7eb", fontWeight: 590, letterSpacing: "-0.1px" }}
      >
        {news.title}
      </h3>

      {/* summary */}
      <p className="text-[12.5px] leading-[1.55] text-[#a8a8b3] line-clamp-2 mb-3">
        {news.summary}
      </p>

      {/* symbols + link */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <div className="flex flex-wrap gap-1.5">
          {news.symbols.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 rounded text-[#a8a8b3]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-0.5 text-[#62666d] group-hover:text-[#a8a8b3] transition-colors">
          source <ExternalLink className="h-2.5 w-2.5" />
        </span>
      </div>
    </Wrapper>
  );
}
