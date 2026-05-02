"use client";

import { motion } from "framer-motion";
import {
  Database, Sparkles, Brain, Bell, Workflow,
  ArrowRight, ChevronRight,
} from "lucide-react";

const MINT_BRIGHT = "#6FC298";
const MINT = "#4EAA85";

interface FlowNode {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  count: string;
  detail: string[];
  color: string;
}

const NODES: FlowNode[] = [
  {
    icon: Database,
    title: "資料源",
    count: "8+",
    detail: ["efinance", "AkShare", "Tushare", "YFinance", "Longbridge", "Tavily / SerpAPI"],
    color: "#7CC8F2",
  },
  {
    icon: Workflow,
    title: "策略引擎",
    count: "11",
    detail: ["MA / RSI / MACD", "Elliott / 籌碼 / 布林", "VWAP / 新聞情緒", "類股 / 風險 / 共識"],
    color: "#A78BFA",
  },
  {
    icon: Brain,
    title: "LLM 推論",
    count: "Gemma 4 31B",
    detail: ["256K context", "JSON mode", "schema validated", "fallback chain"],
    color: MINT_BRIGHT,
  },
  {
    icon: Sparkles,
    title: "決策合成",
    count: "Daily",
    detail: ["買 / 持 / 賣", "信心 0-100", "風險檢核", "行動清單"],
    color: "#FCD34D",
  },
  {
    icon: Bell,
    title: "推送",
    count: "6 channels",
    detail: ["WeChat Work", "Telegram", "Discord", "Slack", "Email", "Web UI"],
    color: "#F472B6",
  },
];

/**
 * How It Works — 5 階段流水線視覺化
 *
 * 桌機：水平 5 節點 + 連線箭頭
 * 手機：垂直 stack
 */
export function HowItWorks() {
  return (
    <section
      className="relative py-20 border-b border-white/[0.06]"
      style={{ background: "#0a0c10" }}
      aria-label="系統架構流程"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Workflow className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>How It Works</span>
        </div>

        <h2
          className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.04em] text-white max-w-[680px]"
          style={{ fontWeight: 510 }}
        >
          每天 09:00，<span style={{ color: MINT_BRIGHT }} className="italic font-normal">系統自動跑完。</span>
        </h2>
        <p className="mt-3 text-[14px]" style={{ color: "#a8a8b3" }}>
          資料 → 策略 → LLM → 決策 → 推送 · GitHub Actions 排程 · 0 維護成本
        </p>

        {/* Pipeline */}
        <div className="mt-12 relative">
          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-stretch gap-3">
            {NODES.map((node, i) => (
              <PipeNode key={node.title} node={node} index={i} total={NODES.length} />
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-3">
            {NODES.map((node, i) => (
              <PipeNode key={node.title} node={node} index={i} total={NODES.length} mobile />
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-[#62666d]"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            ⏰ 每日 09:00 (UTC+8)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            ✅ Run-time ≈ 8 分鐘
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            🆓 GitHub Actions Free Tier
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            📦 Token: ~12k / 天
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function PipeNode({
  node, index, total, mobile = false,
}: { node: FlowNode; index: number; total: number; mobile?: boolean }) {
  const Icon = node.icon;
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: mobile ? 0 : 20, x: mobile ? -16 : 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${mobile ? "" : "flex-1"}`}
    >
      {/* Card */}
      <div
        className="rounded-xl p-4 h-full"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)",
          border: `1px solid ${node.color}24`,
          boxShadow: `0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg"
            style={{ background: `${node.color}1a`, border: `1px solid ${node.color}33` }}
          >
            <Icon className="h-4 w-4" style={{ color: node.color }} />
          </div>
          <span
            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ background: `${node.color}14`, color: node.color, border: `1px solid ${node.color}33`, fontWeight: 590 }}
          >
            {node.count}
          </span>
        </div>

        <h3 className="text-[15px] mb-2" style={{ color: "#f7f8f8", fontWeight: 590 }}>
          {node.title}
        </h3>

        <ul className="space-y-1">
          {node.detail.map((d, i) => (
            <li key={i} className="text-[11px] text-[#a8a8b3] flex items-center gap-1.5">
              <ChevronRight className="h-2.5 w-2.5" style={{ color: node.color, opacity: 0.6 }} />
              <span className="truncate">{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Arrow connector — desktop only, between nodes */}
      {!mobile && !isLast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + index * 0.12 + 0.4 }}
          className="absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 grid h-6 w-6 place-items-center rounded-full pointer-events-none"
          style={{ background: "#0a0c10", border: `1px solid ${MINT_BRIGHT}40` }}
        >
          <ArrowRight className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
        </motion.div>
      )}
    </motion.div>
  );
}
