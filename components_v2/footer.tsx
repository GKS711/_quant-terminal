import { Github, ExternalLink } from "lucide-react";

const AMBER = "#FF6B00";

export function Footer() {
  return (
    <footer
      style={{
        background: "#000000",
        borderTop: "1px solid #27272A",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
        <div
          className="text-[11px] uppercase mb-6"
          style={{ color: "#767D88", letterSpacing: "0.35px", fontWeight: 450 }}
        >
          ───  Colophon  ·  版本資訊  ───
        </div>

        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <h3
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 500,
              color: "#FFFFFF",
              lineHeight: 1.0,
              letterSpacing: "-1px",
            }}
          >
            <span style={{ color: AMBER }}>每日</span>股市儀表板
          </h3>
          <a
            href="https://github.com/GKS711/_quant-terminal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase px-5 py-2.5 transition-colors"
            style={{
              border: "1px solid #27272A",
              color: "#FFFFFF",
              letterSpacing: "0.18em",
              fontWeight: 500,
              borderRadius: "4px",
            }}
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>

        <p
          className="text-[16px] mb-12 max-w-[520px]"
          style={{ color: "#C9CCD1", lineHeight: 1.6, letterSpacing: "-0.16px" }}
        >
          讓全球市場像一份雜誌每天送到你手上。資料來自公開源、AI 解讀公開、計算公式公開。
        </p>

        {/* 3 col tight grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-12"
          style={{ background: "#27272A" }}
        >
          {[
            {
              title: "Sources",
              items: [
                "Yahoo Finance v8",
                "Stooq.com (fallback)",
                "Yahoo + GNews + RSS",
                "Google Gemma 4 31B",
              ],
            },
            {
              title: "Stack",
              items: [
                "Next.js 14 · TS strict",
                "Tailwind · Geist Sans/Mono",
                "11 strategy pure-fns · zod",
              ],
            },
            {
              title: "Open",
              items: [
                { label: "README", href: "https://github.com/GKS711/_quant-terminal#readme" },
                { label: "DESIGN.md", href: "https://github.com/GKS711/_quant-terminal/blob/main/DESIGN.md" },
                { label: "Pipeline", href: "https://github.com/GKS711/_quant-terminal/blob/main/scripts/refresh-data.mjs" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="p-6" style={{ background: "#000000" }}>
              <div
                className="text-[11px] uppercase mb-4"
                style={{ color: AMBER, letterSpacing: "0.35px", fontWeight: 600 }}
              >
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.items.map((it, i) =>
                  typeof it === "string" ? (
                    <li
                      key={i}
                      className="text-[13px] font-mono"
                      style={{ color: "#C9CCD1", letterSpacing: "-0.16px" }}
                    >
                      {it}
                    </li>
                  ) : (
                    <li key={i}>
                      <a
                        href={it.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-mono"
                        style={{ color: AMBER, letterSpacing: "-0.16px" }}
                      >
                        <ExternalLink className="h-3 w-3" />
                        {it.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div
          className="pt-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[10px] uppercase font-mono"
          style={{ borderTop: "1px solid #27272A", color: "#5E5E5E", letterSpacing: "0.35px" }}
        >
          <div>© 2026 GKS  ·  Personal portfolio  ·  Not investment advice</div>
          <div>v2.2  ·  Cinematic Dark  ·  Issue 001</div>
        </div>
      </div>
    </footer>
  );
}
