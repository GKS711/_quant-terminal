import { Github, Linkedin, Twitter } from "lucide-react";

const COLS = [
  {
    title: "本作品集",
    links: [
      { label: "決策終端", href: "#decision" },
      { label: "策略矩陣", href: "#strategy" },
      { label: "回測表現", href: "#backtest" },
      { label: "AI 顧問",  href: "#advisor" },
      { label: "技術架構", href: "#tech" },
    ],
  },
  {
    title: "GitHub Source",
    links: [
      { label: "_quant-terminal", href: "https://github.com/GKS711/_quant-terminal" },
      { label: "README",               href: "https://github.com/GKS711/_quant-terminal#readme" },
      { label: "Issues",               href: "https://github.com/GKS711/_quant-terminal/issues" },
      { label: "Releases",             href: "https://github.com/GKS711/_quant-terminal/releases" },
    ],
  },
  {
    title: "技術棧",
    links: [
      { label: "Next.js 14",      href: "https://nextjs.org" },
      { label: "Tailwind CSS",    href: "https://tailwindcss.com" },
      { label: "Gemma 4 31B",     href: "https://ai.google.dev/gemma" },
      { label: "Recharts",        href: "https://recharts.org" },
    ],
  },
  {
    title: "免責",
    links: [
      { label: "本站內容僅供參考", href: "#" },
      { label: "不構成投資建議",   href: "#" },
      { label: "報價有延遲",       href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950/60">
      <div className="container-x py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-mint-400 text-ink-900">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18 L10 10 L14 14 L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[15px] font-medium tracking-tight">
                每日股市儀表板 <span className="text-ink-300 font-mono text-[12px]">/ GKS</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-ink-300 max-w-xs">
              台股 AI 量化分析作品集。後端是 Python / FastAPI / Litellm，每日自動執行；前端是 Next.js / Tailwind / Gemma 4。全部由 GKS 自行設計、實作、維護。
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://github.com/GKS711"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-300 hover:text-ink-50 hover:border-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-300 hover:text-ink-50 hover:border-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-300 hover:text-ink-50 hover:border-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-mono uppercase tracking-wider text-ink-400">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-ink-200 hover:text-ink-50 transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ink-400">
          <p>
            © {new Date().getFullYear()} 每日股市儀表板 — GKS 個人作品集 · 內容僅供研究參考，不構成投資建議
          </p>
          <p className="font-mono">Next.js 14 · Tailwind · Gemma 4 31B · Recharts</p>
        </div>
      </div>
    </footer>
  );
}
