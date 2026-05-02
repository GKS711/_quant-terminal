"use client";

import { motion } from "framer-motion";
import {
  Server, Brain, Database, Layers, Bell, GitBranch,
} from "lucide-react";

const MINT_BRIGHT = "#6FC298";

interface TechCard {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  highlight: string;
  oneLine: string;       // 一句話介紹（不超過 18 字）
  color: string;
}

const TECH_CARDS: TechCard[] = [
  { icon: Server,    title: "FastAPI Backend", highlight: "Python 3.10+", oneLine: "型別友善 / 自動排程 / 0 維護", color: "#7CC8F2" },
  { icon: Brain,     title: "Litellm × 40+ Models", highlight: "1 行切換", oneLine: "Gemini / Claude / DeepSeek / Ollama", color: "#6FC298" },
  { icon: Database,  title: "8+ 資料源", highlight: "免費接入", oneLine: "efinance / AkShare / YFinance / Tushare", color: "#FFB347" },
  { icon: Layers,    title: "11 種策略引擎", highlight: "多策略共識", oneLine: "技術 + 籌碼 + 新聞 + 風險加權投票", color: "#A78BFA" },
  { icon: Bell,      title: "多通道推送", highlight: "6 channels", oneLine: "WeChat / Telegram / Slack / Discord", color: "#F472B6" },
  { icon: GitBranch, title: "GitHub Actions", highlight: "$0 cost", oneLine: "每日 09:00 自動執行 / 失敗重試", color: "#FCD34D" },
];

export function TechStack() {
  return (
    <section
      className="relative py-20 border-b border-white/[0.06]"
      style={{ background: "#0a0c10" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Server className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>Tech Stack</span>
        </div>

        <h2
          className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.04em] text-white max-w-[680px]"
          style={{ fontWeight: 510 }}
        >
          完整工程鏈，<span style={{ color: MINT_BRIGHT }} className="italic font-normal">100% 開源。</span>
        </h2>
        <p className="mt-3 text-[14px] max-w-[480px]" style={{ color: "#a8a8b3" }}>
          後端在{" "}
          <a href="https://github.com/GKS711/_quant-terminal" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: MINT_BRIGHT }}>
            github.com/GKS711/_quant-terminal
          </a>
        </p>

        {/* Cards grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TECH_CARDS.map((card, i) => (
            <TechCardItem key={card.title} card={card} delay={i * 0.06} />
          ))}
        </div>

        {/* Detail row underneath（textually sparse）*/}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-[12.5px]">
          {TECH_CARDS.map((card) => (
            <div key={card.title} className="flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5" style={{ color: card.color }}>
                <card.icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <span className="text-[#f7f8f8]" style={{ fontWeight: 590 }}>{card.title}</span>
                <span className="text-[#62666d]"> · </span>
                <span className="text-[#a8a8b3]">{card.oneLine}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechCardItem({ card, delay }: { card: TechCard; delay: number }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4 }}
      className="group rounded-xl p-4 flex flex-col items-center text-center"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="grid h-14 w-14 place-items-center rounded-xl mb-3 transition-transform group-hover:scale-110"
        style={{ background: `${card.color}1a`, border: `1px solid ${card.color}33` }}
      >
        <Icon className="h-7 w-7" style={{ color: card.color }} />
      </div>
      <h3 className="text-[12px] text-[#f7f8f8] mb-1" style={{ fontWeight: 590 }}>
        {card.title}
      </h3>
      <span
        className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{
          background: `${card.color}14`,
          color: card.color,
          border: `1px solid ${card.color}33`,
          fontWeight: 590,
        }}
      >
        {card.highlight}
      </span>
    </motion.div>
  );
}
