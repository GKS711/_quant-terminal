import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="grid h-7 w-7 place-items-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FF6E40 0%, #E91E63 50%, #0066FF 100%)",
                }}
              />
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#000" }}>
                每日股市儀表板
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#767676", lineHeight: 1.6 }}>
              讓 retail 投資人不用看盤就掌握股市全局。圖片大過文字，AI 替你讀完今天。
            </p>
          </div>

          {/* Sources */}
          <div>
            <div
              className="text-[11px] uppercase mb-3"
              style={{ color: "#FF6E40", letterSpacing: "0.2em", fontWeight: 700 }}
            >
              Sources
            </div>
            <ul className="space-y-2 text-[13px]" style={{ color: "#3A3A3A" }}>
              <li>Yahoo Finance v8</li>
              <li>Stooq.com (fallback)</li>
              <li>Google Gemma 4 31B</li>
              <li>11 strategies pure-fns</li>
            </ul>
          </div>

          {/* Open */}
          <div>
            <div
              className="text-[11px] uppercase mb-3"
              style={{ color: "#0066FF", letterSpacing: "0.2em", fontWeight: 700 }}
            >
              Open
            </div>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                  style={{ color: "#000", fontWeight: 500 }}
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#000" }}
                >
                  README
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/GKS711/_quant-terminal/blob/main/DESIGN.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#000" }}
                >
                  DESIGN.md
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[11px]"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)", color: "#A0A0A0" }}
        >
          <div>© 2026 GKS · Personal portfolio · Not investment advice</div>
          <div className="font-mono uppercase tracking-widest" style={{ color: "#FF6E40" }}>
            v3.0 · Vibrant
          </div>
        </div>
      </div>
    </footer>
  );
}
