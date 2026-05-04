"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Cpu, Maximize2, Download } from "lucide-react";

import { SAMPLE_REPORT_MD, SAMPLE_REPORT_META } from "@/lib/sample-report";

const MINT_BRIGHT = "#6FC298";

/**
 * Daily Report Viewer — 滾動展示一份完整的 AI 每日台股分析報告
 *
 * 視覺：
 *   - 終端機風格容器（黑底，monospace 標題列）
 *   - 內容用 react-markdown 渲染，但維持 monospace 字體
 *   - max-h 限制 + 內部 scroll，搭配漸層遮罩
 *   - 進入視窗時 fade-in，標題區數字 count-up
 */
export function DailyReportViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="relative py-24 border-b border-white/[0.06]"
      style={{ background: "#08090a" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10" ref={ref}>
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <FileText className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>Daily Report Sample</span>
        </div>

        {/* Title */}
        <h2
          className="text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.04em] text-white max-w-[720px]"
          style={{ fontWeight: 510 }}
        >
          AI 每日報告，
          <span style={{ color: MINT_BRIGHT }} className="italic font-normal"> 14,280 token。</span>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.55] max-w-[640px]" style={{ color: "#a8a8b3" }}>
          系統每日盤前自動執行：8 檔股票 × 11 策略 + 234 篇新聞掃描 + LLM 摘要 + 決策投票。下面這份報告由 <code className="text-[#d0d6e0] font-mono text-[13px]">gemma-4-31b-it</code> 在 8.4 秒內生成。
        </p>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[760px]"
        >
          <MetaCell label="模型" value="gemma-4-31b-it" mono />
          <MetaCell label="掃描標的" value={`${SAMPLE_REPORT_META.symbols.length} 檔`} />
          <MetaCell label="新聞掃描" value={`${SAMPLE_REPORT_META.newsScanned} 篇`} />
          <MetaCell label="生成 token" value={SAMPLE_REPORT_META.tokenCount.toLocaleString()} />
        </motion.div>

        {/* Terminal container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #0a0c10 0%, #08090a 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28C840" }} />
              </span>
              <span className="ml-2 text-[12px] font-mono text-[#a8a8b3]">
                daily-report-2026-04-26.md
              </span>
              <span className="text-[10px] font-mono text-[#62666d]">— Gemma 4 31B</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#62666d]">
              <span className="hidden sm:inline">{SAMPLE_REPORT_META.tokenCount.toLocaleString()} tokens · 8.4s</span>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="hover:text-[#d0d6e0] transition-colors"
                aria-label="展開"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className="relative overflow-y-auto px-6 sm:px-10 py-8"
            style={{
              maxHeight: expanded ? "none" : 600,
              fontFamily:
                'ui-monospace, "Geist Mono", SFMono-Regular, Menlo, monospace',
            }}
          >
            <article className="markdown-body text-[#d0d6e0] leading-[1.7] text-[13.5px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-[24px] mt-0 mb-4 text-[#f7f8f8]" style={{ fontWeight: 590, letterSpacing: "-0.4px" }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-[18px] mt-7 mb-3 pb-2 border-b border-white/[0.06] text-[#f7f8f8]" style={{ fontWeight: 590 }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-[15px] mt-5 mb-2 text-[#f7f8f8]" style={{ fontWeight: 590 }}>
                      {children}
                    </h3>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full text-[12px]">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="text-left px-3 py-2 text-[#a8a8b3] border-b border-white/[0.08] font-mono uppercase tracking-wider text-[11px]">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 text-[#d0d6e0] border-b border-white/[0.04]">{children}</td>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = (className ?? "").includes("language-");
                    return isBlock ? (
                      <code className="font-mono text-[12px] text-[#a8d4f8]">{children}</code>
                    ) : (
                      <code
                        className="px-1.5 py-0.5 rounded text-[12px] font-mono"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#a8d4f8" }}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre
                      className="my-3 px-4 py-3 rounded-md overflow-x-auto text-[11.5px] leading-[1.6]"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className="my-3 pl-4 py-1 text-[#a8a8b3] italic"
                      style={{ borderLeft: `2px solid ${MINT_BRIGHT}` }}
                    >
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-[#c8d0dc]">{children}</li>,
                  strong: ({ children }) => <strong className="text-[#f7f8f8]" style={{ fontWeight: 590 }}>{children}</strong>,
                  hr: () => <hr className="my-6 border-white/[0.06]" />,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: MINT_BRIGHT }} className="hover:underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {SAMPLE_REPORT_MD}
              </ReactMarkdown>
            </article>

            {/* Bottom fade gradient when collapsed */}
            {!expanded && (
              <div
                className="absolute left-0 right-0 bottom-0 h-32 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent, #08090a 80%)",
                }}
              />
            )}
          </div>

          {!expanded && (
            <div className="px-6 sm:px-10 py-4 border-t border-white/[0.06] flex items-center justify-between" style={{ background: "rgba(255,255,255,0.01)" }}>
              <span className="text-[11px] font-mono text-[#62666d]">
                顯示前段（約 30%）— 點右上角放大或下方按鈕展開全文
              </span>
              <button
                onClick={() => setExpanded(true)}
                className="inline-flex items-center gap-1 text-[12px] font-mono"
                style={{ color: MINT_BRIGHT }}
              >
                展開全文 <Download className="h-3 w-3 rotate-180" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      className="rounded-md px-3 py-2"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d]">{label}</div>
      <div
        className={`text-[14px] tabular-nums ${mono ? "font-mono" : ""}`}
        style={{ color: "#f7f8f8", fontWeight: 510 }}
      >
        {value}
      </div>
    </div>
  );
}
