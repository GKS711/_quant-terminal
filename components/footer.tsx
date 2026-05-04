import { Github, ExternalLink } from "lucide-react";

const GOLD = "#F5A623";
const PINK = "#FF4D6D";

export function Footer() {
  return (
    <footer
      className="border-t mt-12"
      style={{
        background: "#070D1A",
        borderColor: "rgba(245,166,35,0.10)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Logo block */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="grid h-7 w-7 place-items-center rounded-md"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${PINK} 100%)`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 18 L10 10 L14 14 L20 6"
                    stroke="#0B1426"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[14px]" style={{ fontWeight: 590, color: "#F4F6FA" }}>
                每日股市儀表板
              </span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: "#A9B3C4" }}>
              全球多市場 AI 量化分析儀表板。讓 retail 投資人不用看盤就掌握股市全局。
            </p>
            <div className="text-[10px] font-mono mt-3" style={{ color: "#566175" }}>
              by GKS · 2026 · 個人作品集
            </div>
          </div>

          {/* Links */}
          <div>
            <div
              className="text-[10px] font-mono uppercase tracking-widest mb-3"
              style={{ color: GOLD }}
            >
              Source / Open
            </div>
            <ul className="space-y-1.5 text-[12px]">
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  style={{ color: "#D6DCE6" }}
                >
                  <Github className="h-3 w-3" />
                  GitHub _quant-terminal
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  style={{ color: "#D6DCE6" }}
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
                  style={{ color: "#D6DCE6" }}
                >
                  <ExternalLink className="h-3 w-3" />
                  DESIGN.md
                </a>
              </li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <div
              className="text-[10px] font-mono uppercase tracking-widest mb-3"
              style={{ color: GOLD }}
            >
              Stack
            </div>
            <ul className="space-y-1.5 text-[12px]" style={{ color: "#A9B3C4" }}>
              <li>Next.js 14 · TypeScript strict</li>
              <li>Tailwind · framer-motion</li>
              <li>Yahoo Finance v8 · Stooq fallback</li>
              <li>Gemma 4 31B (Google AI Studio)</li>
              <li>11 種策略純函式</li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[10px] font-mono"
          style={{
            borderColor: "rgba(244,246,250,0.06)",
            color: "#566175",
          }}
        >
          <div>© 2026 GKS · 個人作品集 · 內容僅供研究參考，不構成投資建議</div>
          <div className="inline-flex items-center gap-2">
            <span style={{ color: PINK }}>● v2.0</span>
            <span>·</span>
            <span>大膽當代配色</span>
            <span>·</span>
            <span>5 國 100 檔</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
