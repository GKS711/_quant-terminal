"use client";

import { useState, useEffect } from "react";
import { Clock, ExternalLink, RefreshCw } from "lucide-react";

const AMBER = "#FF6B00";
const BULL = "#3F8500";
const BEAR = "#E5484D";

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
    return level === "strong_bull" ? "STRONG BULL" : level === "bull" ? "BULL" : level === "bear" ? "BEAR" : level === "strong_bear" ? "STRONG BEAR" : "NEUTRAL";
  }
  function sentColor(level: string) {
    if (level === "strong_bull" || level === "bull") return BULL;
    if (level === "bear" || level === "strong_bear") return BEAR;
    return "#767D88";
  }

  return (
    <section
      id="news"
      className="py-24"
      style={{ background: "#000000", borderBottom: "1px solid #27272A" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div
              className="text-[11px] uppercase mb-4"
              style={{ color: "#767D88", letterSpacing: "0.35px", fontWeight: 450 }}
            >
              ───  Wires  ·  24h 新聞流  ───
            </div>
            <h2
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 500,
                color: "#FFFFFF",
                lineHeight: 1.0,
                letterSpacing: "-1px",
              }}
            >
              市場 <span style={{ color: AMBER }}>當下聲音</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "bull", "bear"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-[10px] uppercase px-3 py-1.5 transition-colors"
                style={{
                  color: filter === f ? AMBER : "#767D88",
                  fontWeight: filter === f ? 600 : 500,
                  letterSpacing: "0.35px",
                  borderBottom: filter === f ? `1px solid ${AMBER}` : "1px solid transparent",
                }}
              >
                {f === "all" ? "ALL" : f === "bull" ? "BULL" : "BEAR"}
              </button>
            ))}
            <span style={{ color: "#5E5E5E" }} className="mx-2">|</span>
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase disabled:opacity-50 transition-colors"
              style={{
                background: "transparent",
                color: AMBER,
                border: `1px solid ${AMBER}`,
                fontWeight: 600,
                letterSpacing: "0.2em",
                borderRadius: "4px",
              }}
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading…" : news.length === 0 ? "Fetch" : "Refresh"}
            </button>
          </div>
        </div>

        {refreshedAt && (
          <div
            className="text-[10px] uppercase mb-6 font-mono"
            style={{ color: "#5E5E5E", letterSpacing: "0.35px" }}
          >
            updated {refreshedAt.toLocaleTimeString("zh-TW")}  ·  {filtered.length} / {news.length}
          </div>
        )}
        {error && (
          <div
            className="px-4 py-3 mb-6 text-[12px] font-mono"
            style={{ background: "#0A0A0A", color: BEAR, border: `1px solid ${BEAR}33`, borderRadius: "4px" }}
          >
            ⚠ {error}
          </div>
        )}

        {/* 2-col reading layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {filtered.map((n, i) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block pb-6"
              style={{ borderBottom: "1px solid #27272A" }}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="text-[10px] font-mono tabular-nums"
                  style={{ color: "#5E5E5E", fontWeight: 500 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[10px] uppercase font-mono"
                  style={{ color: "#C9CCD1", letterSpacing: "0.35px", fontWeight: 500 }}
                >
                  {n.source}
                </span>
                <span style={{ color: "#5E5E5E" }} className="mx-1">·</span>
                <span
                  className="text-[10px] uppercase font-mono inline-flex items-center gap-1"
                  style={{ color: "#767D88", letterSpacing: "0.35px" }}
                >
                  <Clock className="h-2.5 w-2.5" />
                  {n.hoursAgo}h
                </span>
                <span
                  className="ml-auto text-[10px] uppercase font-mono"
                  style={{ color: sentColor(n.sentimentLevel), letterSpacing: "0.35px", fontWeight: 600 }}
                >
                  {sentLabel(n.sentimentLevel)}
                </span>
              </div>
              <h3
                className="mb-3"
                style={{
                  fontSize: "20px",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  lineHeight: 1.2,
                  letterSpacing: "-0.4px",
                }}
              >
                {n.title}
              </h3>
              {n.symbols.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {n.symbols.slice(0, 5).map((sym) => (
                    <span
                      key={sym}
                      className="text-[10px] font-mono px-2 py-0.5"
                      style={{
                        background: "#0A0A0A",
                        color: "#C9CCD1",
                        border: "1px solid #27272A",
                        letterSpacing: "-0.16px",
                      }}
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase"
                style={{ color: AMBER, letterSpacing: "0.35px", fontWeight: 500 }}
              >
                Read source <ExternalLink className="h-2.5 w-2.5" />
              </div>
            </a>
          ))}
        </div>

        {!loading && news.length === 0 && (
          <div
            className="py-16 text-center text-[14px] uppercase"
            style={{
              color: "#767D88",
              letterSpacing: "0.35px",
              border: "1px solid #27272A",
              borderRadius: "4px",
            }}
          >
            click fetch to load wires
          </div>
        )}
      </div>
    </section>
  );
}
