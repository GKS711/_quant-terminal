"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

const GOLD = "#F5A623";
const PINK = "#FF4D6D";
const BULL = "#26C281";
const BEAR = "#FF3B5C";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  hoursAgo: number;
  symbols: string[];
  sentiment: number;
  sentimentLevel: string;
  url?: string;
}

export function NewsPulse() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "bull" | "bear">("all");
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  // 首次載入
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/refresh-news", { method: "POST" });
      const j = await r.json();
      if (j.ok && Array.isArray(j.news)) {
        setNews(j.news);
        setRefreshedAt(new Date());
      } else {
        setError(j.error ?? "刷新失敗");
      }
    } catch (e: any) {
      setError(e?.message ?? "網路錯誤");
    }
    setLoading(false);
  }

  const filtered = news.filter((n) => {
    if (filter === "all") return true;
    if (filter === "bull") return n.sentiment > 0.2;
    if (filter === "bear") return n.sentiment < -0.2;
    return true;
  });

  const sentColor: Record<string, string> = {
    strong_bull: BULL,
    bull: "#5DD9A4",
    neutral: "#7A869A",
    bear: "#FF8FA8",
    strong_bear: BEAR,
  };

  return (
    <section
      id="news"
      className="border-t py-12"
      style={{ background: "#070D1A", borderColor: "rgba(245,166,35,0.10)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <div
              className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] mb-2"
              style={{ color: "#7A869A" }}
            >
              <Newspaper className="h-3 w-3" style={{ color: GOLD }} />
              <span>News Pulse · 24h 新聞流</span>
              {news.length > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
                  style={{
                    background: `${GOLD}1f`,
                    color: GOLD,
                    border: `1px solid ${GOLD}33`,
                    fontWeight: 590,
                  }}
                >
                  LIVE · YAHOO
                </span>
              )}
            </div>
            <h2
              className="text-[28px] sm:text-[36px] tracking-[-0.03em]"
              style={{ color: "#F4F6FA", fontWeight: 510 }}
            >
              新聞 +{" "}
              <span style={{ color: GOLD }} className="italic font-normal">
                情緒分數
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "bull", "bear"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-[12px] font-mono"
                style={{
                  background: filter === f ? `${GOLD}1f` : "rgba(244,246,250,0.04)",
                  color: filter === f ? GOLD : "#A9B3C4",
                  border: `1px solid ${filter === f ? `${GOLD}66` : "rgba(244,246,250,0.10)"}`,
                  fontWeight: filter === f ? 590 : 510,
                }}
              >
                {f === "all" ? "全部" : f === "bull" ? "↑ 偏多" : "↓ 偏空"}
              </button>
            ))}
            <span style={{ color: "#3E4A5E" }}>|</span>
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] disabled:opacity-50"
              style={{
                background: news.length > 0 ? `${GOLD}1f` : "rgba(244,246,250,0.04)",
                color: news.length > 0 ? GOLD : "#A9B3C4",
                border: `1px solid ${news.length > 0 ? `${GOLD}66` : "rgba(244,246,250,0.10)"}`,
              }}
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {loading ? "重抓中…" : news.length === 0 ? "載入新聞" : "重抓 24h"}
            </button>
          </div>
        </div>

        {refreshedAt && (
          <div className="text-[11px] font-mono mb-4" style={{ color: "#566175" }}>
            ✓ 已更新於 {refreshedAt.toLocaleTimeString("zh-TW")} · {filtered.length} / {news.length}
          </div>
        )}
        {error && (
          <div
            className="rounded p-3 mb-4 text-[12px]"
            style={{ background: `${PINK}14`, color: PINK, border: `1px solid ${PINK}33` }}
          >
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((n, i) => (
            <motion.a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
              className="block rounded-xl p-4 transition-colors"
              style={{
                background: "rgba(244,246,250,0.025)",
                border: "1px solid rgba(244,246,250,0.06)",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(244,246,250,0.04)",
                    color: "#A9B3C4",
                  }}
                >
                  {n.source}
                </span>
                <span
                  className="text-[10px] font-mono inline-flex items-center gap-1"
                  style={{ color: "#7A869A" }}
                >
                  <Clock className="h-2.5 w-2.5" />
                  {n.hoursAgo}h ago
                </span>
                <span
                  className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    color: sentColor[n.sentimentLevel] ?? "#A9B3C4",
                    background: `${sentColor[n.sentimentLevel] ?? "#7A869A"}1f`,
                  }}
                >
                  {n.sentimentLevel === "strong_bull"
                    ? "強多"
                    : n.sentimentLevel === "bull"
                    ? "偏多"
                    : n.sentimentLevel === "bear"
                    ? "偏空"
                    : n.sentimentLevel === "strong_bear"
                    ? "強空"
                    : "中性"}{" "}
                  {n.sentiment >= 0 ? "+" : ""}
                  {n.sentiment.toFixed(2)}
                </span>
              </div>
              <div
                className="text-[14px] leading-snug mb-2"
                style={{ color: "#F4F6FA", fontWeight: 510 }}
              >
                {n.title}
              </div>
              {n.symbols.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {n.symbols.slice(0, 5).map((sym) => (
                    <span
                      key={sym}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(244,246,250,0.04)",
                        color: "#A9B3C4",
                      }}
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="mt-2 inline-flex items-center gap-1 text-[11px]"
                style={{ color: GOLD }}
              >
                source <ExternalLink className="h-2.5 w-2.5" />
              </div>
            </motion.a>
          ))}
        </div>

        {!loading && news.length === 0 && (
          <div
            className="rounded-xl p-8 text-center"
            style={{
              background: "rgba(244,246,250,0.025)",
              border: "1px dashed rgba(244,246,250,0.10)",
              color: "#A9B3C4",
            }}
          >
            點「載入新聞」抓 Yahoo Finance 24h 內最新新聞
          </div>
        )}
      </div>
    </section>
  );
}
