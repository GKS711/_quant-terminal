import { Github, ExternalLink } from "lucide-react";

const SERIF = '"Iowan Old Style", "Palatino", "Georgia", serif';
const INK = "#211922";

export function Footer() {
  return (
    <footer
      style={{
        background: "#F5F4EF",
        borderTop: "1px solid rgba(33,25,34,0.08)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-16">
        {/* Magazine masthead */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Colophon · 版本資訊
            </div>
            <h3
              className="text-[28px] sm:text-[32px]"
              style={{
                fontFamily: SERIF,
                color: INK,
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontStyle: "italic" }}>每日</span>股市儀表板
            </h3>
            <p className="mt-2 text-[14px] max-w-[480px] leading-relaxed" style={{ color: "#62625B" }}>
              讓全球市場像一份雜誌每天送到你手上。資料來自公開源、AI 解讀公開、計算公式公開。
            </p>
          </div>

          <a
            href="https://github.com/GKS711/_quant-terminal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(33,25,34,0.15)",
              color: INK,
            }}
          >
            <Github className="h-3.5 w-3.5" />
            View on GitHub
          </a>
        </div>

        {/* 3 col */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Sources
            </div>
            <ul className="space-y-1.5 text-[13px]" style={{ color: "#62625B" }}>
              <li>Yahoo Finance v8 (報價 / OHLC)</li>
              <li>Stooq.com (備援)</li>
              <li>Yahoo + GNews + RSS (新聞)</li>
              <li>Google Gemma 4 31B (AI 推論)</li>
            </ul>
          </div>
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Stack
            </div>
            <ul className="space-y-1.5 text-[13px]" style={{ color: "#62625B" }}>
              <li>Next.js 14 · TypeScript strict</li>
              <li>Tailwind · Geist Sans / Mono</li>
              <li>11 種策略純函式 · zod 驗證</li>
            </ul>
          </div>
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Open
            </div>
            <ul className="space-y-1.5 text-[13px]">
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  style={{ color: "#3B4F8C" }}
                >
                  <ExternalLink className="h-3 w-3" />
                  README
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal/blob/main/DESIGN.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  style={{ color: "#3B4F8C" }}
                >
                  <ExternalLink className="h-3 w-3" />
                  DESIGN.md
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal/blob/main/scripts/refresh-data.mjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  style={{ color: "#3B4F8C" }}
                >
                  <ExternalLink className="h-3 w-3" />
                  資料 pipeline
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom rule */}
        <div
          className="pt-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[10px] uppercase tracking-[0.15em]"
          style={{
            borderTop: "1px solid rgba(33,25,34,0.08)",
            color: "#91918C",
          }}
        >
          <div>© 2026 GKS · Personal portfolio · Not investment advice</div>
          <div>
            v2.1 · Editorial Layout · Issue 001
          </div>
        </div>
      </div>
    </footer>
  );
}
