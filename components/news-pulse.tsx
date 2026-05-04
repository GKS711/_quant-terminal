"use client";

import { useState, useEffect } from "react";
import { Clock, ExternalLink, RefreshCw } from "lucide-react";

const SERIF = '"Iowan Old Style", "Palatino", "Georgia", serif';
const INK = "#211922";
const BULL = "#3E7A52";
const BEAR = "#A23E3E";

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
      } else setError(j.error ?? "刷新失敗");
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

  function sentLabel(level: string) {
    return level === "strong_bull" ? "強多" : level === "bull" ? "偏多" : level === "bear" ? "偏空" : level === "strong_bear" ? "強空" : "中性";
  }
  function sentColor(level: string) {
    if (level === "strong_bull" || level === "bull") return BULL;
    if (level === "bear" || level === "strong_bear") return BEAR;
    return "#91918C";
  }

  return (
    <section
      id="news"
      className="py-20"
      style={{ background: "#FAF9F6", borderTop: "1px solid rgba(33,25,34,0.08)" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Wires · 今日快報
            </div>
            <h2
              className="text-[36px] sm:text-[44px]"
              style={{
                fontFamily: SERIF,
                color: INK,
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
              }}
            >
              二十四小時內的{" "}
              <span style={{ fontStyle: "italic" }}>市場聲音</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "bull", "bear"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-[12px]"
                style={{
                  color: filter === f ? INK : "#91918C",
                  fontWeight: filter === f ? 500 : 400,
                  fontFamily: filter === f ? SERIF : undefined,
                  fontStyle: filter === f ? "italic" : "normal",
                }}
              >
                {f === "all" ? "全部" : f === "bull" ? "偏多" : "偏空"}
              </button>
            ))}
            <span style={{ color: "#A39E98" }} className="mx-1">·</span>
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] disabled:opacity-50"
              style={{
                background: "transparent",
                color: INK,
                border: "1px solid rgba(33,25,34,0.15)",
              }}
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {loading ? "重抓中…" : news.length === 0 ? "載入" : "再抓"}
            </button>
          </div>
        </div>

        {refreshedAt && (
          <div className="text-[11px] mb-6" style={{ color: "#A39E98" }}>
            最後更新 {refreshedAt.toLocaleTimeString("zh-TW")} · 顯示 {filtered.length} / {news.length}
          </div>
        )}
        {error && (
          <div
            className="rounded p-3 mb-4 text-[12px]"
            style={{
              background: "#F5F4EF",
              color: BEAR,
              border: `1px solid ${BEAR}33`,
              fontFamily: SERIF,
              fontStyle: "italic",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Magazine column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {filtered.map((n, i) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block pb-6"
              style={{
                borderBottom: "1px solid rgba(33,25,34,0.08)",
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="text-[10px] font-mono tabular-nums"
                  style={{ color: "#A39E98", fontWeight: 500 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: "#62625B", fontWeight: 590 }}
                >
                  {n.source}
                </span>
                <span className="text-[10px]" style={{ color: "#A39E98" }}>·</span>
                <span className="text-[10px] inline-flex items-center gap-1" style={{ color: "#91918C" }}>
                  <Clock className="h-2.5 w-2.5" />
                  {n.hoursAgo}h ago
                </span>
                <span
                  className="ml-auto text-[10px] uppercase tracking-[0.1em]"
                  style={{ color: sentColor(n.sentimentLevel), fontWeight: 590 }}
                >
                  {sentLabel(n.sentimentLevel)} {n.sentiment >= 0 ? "+" : ""}{n.sentiment.toFixed(2)}
                </span>
              </div>
              <h3
                className="text-[19px] sm:text-[21px] mb-2 leading-snug"
                style={{
                  fontFamily: SERIF,
                  color: INK,
                  fontWeight: 400,
                }}
              >
                {n.title}
              </h3>
              {n.symbols.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {n.symbols.slice(0, 5).map((sym) => (
                    <span
                      key={sym}
                      className="text-[10px] font-mono px-1.5 py-0.5"
                      style={{
                        background: "#F5F4EF",
                        color: "#62625B",
                      }}
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="mt-3 inline-flex items-center gap-1 text-[11px]"
                style={{ color: "#3B4F8C" }}
              >
                繼續閱讀 <ExternalLink className="h-2.5 w-2.5" />
              </div>
            </a>
          ))}
        </div>

        {!loading && news.length === 0 && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "#F5F4EF",
              color: "#91918C",
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "16px",
            }}
          >
            按上方「載入」抓 24 小時內最新新聞
          </div>
        )}
      </div>
    </section>
  );
}
