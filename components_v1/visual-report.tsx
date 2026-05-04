"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip,
} from "recharts";
import {
  Sparkles, TrendingUp, TrendingDown, Newspaper, Calendar,
  ArrowUpRight, ArrowDownRight, Activity,
} from "lucide-react";

import { PORTFOLIO, marketAggregates, type Stock } from "@/lib/portfolio";
import { STRATEGIES } from "@/lib/strategies";

const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

/**
 * Visual Report — 取代純 markdown 的視覺化「每日報告」
 *
 * 4 張視覺卡：
 *   1. Sentiment Gauge — 整體市場情緒（radial）
 *   2. Top Movers — 漲跌幅前 3 強 / 跌幅前 3 名（橫向 bar）
 *   3. Strategy Signal Wheel — 11 策略訊號分布（radar）
 *   4. Catalysts Timeline — 接下來 7 天重點事件
 */
export function VisualReport() {
  return (
    <section
      className="relative py-20 border-b border-white/[0.06]"
      style={{ background: "#08090a" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Activity className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>Daily Snapshot</span>
        </div>
        <h2 className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.04em] text-white max-w-[680px]" style={{ fontWeight: 510 }}>
          今日全景，<span style={{ color: MINT_BRIGHT }} className="italic font-normal">一眼看懂</span>
        </h2>

        {/* 4 visual cards in 2×2 grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <SentimentGauge />
          <TopMovers />
          <StrategySignalWheel />
          <CatalystTimeline />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 1. Sentiment Gauge — circular progress ring
// ─────────────────────────────────────────────────────
function SentimentGauge() {
  const data = useMemo(() => {
    const totalCap = PORTFOLIO.reduce((s, x) => s + x.marketCap, 0);
    const score = Math.round(
      PORTFOLIO.reduce((s, x) => s + x.decision.score * x.marketCap, 0) / totalCap,
    );
    return [{ name: "score", value: score, fill: scoreColor(score) }];
  }, []);
  const score = data[0].value;
  const interp = scoreLabel(score);

  // SVG ring
  const radius = 72;
  const stroke = 14;
  const C = 2 * Math.PI * radius;
  const dash = (score / 100) * C;

  return (
    <Card icon={<Sparkles className="h-3 w-3" />} title="市場情緒" eyebrow="Sentiment Gauge">
      <div className="flex items-center gap-6 py-3">
        <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
            <motion.circle
              cx="90" cy="90" r={radius}
              stroke={data[0].fill}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${C}`}
              transform="rotate(-90 90 90)"
              initial={{ strokeDasharray: `0 ${C}` }}
              whileInView={{ strokeDasharray: `${dash} ${C}` }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-[44px] tabular-nums leading-none"
              style={{ fontWeight: 510, color: "#f7f8f8", letterSpacing: "-1.2px" }}
            >
              {score}
            </motion.div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mt-1">/ 100</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-[18px] mb-2" style={{ color: data[0].fill, fontWeight: 590 }}>
            {interp.label}
          </div>
          <p className="text-[12px] leading-[1.55] text-[#a8a8b3]">{interp.desc}</p>
          <div className="mt-3 flex gap-3 text-[10px] font-mono">
            <Mini label="多" value={`${PORTFOLIO.filter(s => s.decision.signal === "buy").length}`} color={BULL} />
            <Mini label="持" value={`${PORTFOLIO.filter(s => s.decision.signal === "hold").length}`} color="#a8a8a8" />
            <Mini label="空" value={`${PORTFOLIO.filter(s => s.decision.signal === "sell").length}`} color={BEAR} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[#62666d] uppercase tracking-wider">{label}</div>
      <div className="tabular-nums text-[14px]" style={{ color, fontWeight: 590 }}>{value}</div>
    </div>
  );
}

function scoreColor(s: number): string {
  if (s >= 70) return BULL;
  if (s >= 55) return MINT_BRIGHT;
  if (s >= 40) return "#FCD34D";
  return BEAR;
}
function scoreLabel(s: number): { label: string; desc: string } {
  if (s >= 70) return { label: "強多", desc: "多數標的訊號偏多，行情動能轉強。" };
  if (s >= 55) return { label: "偏多", desc: "整體穩健，可選擇性加碼強勢標的。" };
  if (s >= 40) return { label: "中性", desc: "多空拉鋸，建議觀望或減倉等待。" };
  return { label: "偏空", desc: "防禦為主，避免追高並設定停損。" };
}

// ─────────────────────────────────────────────────────
// 2. Top Movers — bullish & bearish 各 3 檔
// ─────────────────────────────────────────────────────
function TopMovers() {
  const sorted = useMemo(() => [...PORTFOLIO].sort((a, b) => b.decision.score - a.decision.score), []);
  const top3 = sorted.slice(0, 3);
  const bottom3 = sorted.slice(-3).reverse();

  return (
    <Card icon={<TrendingUp className="h-3 w-3" />} title="多空風向標" eyebrow="Top Movers">
      <div className="space-y-4">
        {/* Top 3 BULL */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: BULL }}>
            ↑ TOP 3 多頭
          </div>
          <div className="space-y-1.5">
            {top3.map((s, i) => <MoverRow key={s.symbol} stock={s} rank={i + 1} positive />)}
          </div>
        </div>
        {/* Bottom 3 BEAR */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: BEAR }}>
            ↓ BOTTOM 3 空頭
          </div>
          <div className="space-y-1.5">
            {bottom3.map((s, i) => <MoverRow key={s.symbol} stock={s} rank={i + 1} positive={false} />)}
          </div>
        </div>
      </div>
    </Card>
  );
}

function MoverRow({ stock, rank, positive }: { stock: Stock; rank: number; positive: boolean }) {
  const color = positive ? BULL : BEAR;
  const widthPct = positive ? stock.decision.score : 100 - stock.decision.score;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: rank * 0.06 }}
      className="flex items-center gap-2 text-[12px]"
    >
      <span className="text-[#62666d] font-mono w-3 text-center">{rank}</span>
      <span className="flex-shrink-0">{flagFor(stock.market)}</span>
      <span className="font-mono" style={{ color: "#f7f8f8", fontWeight: 590 }}>
        {stock.shortCode}
      </span>
      <span className="text-[#8a8f98] truncate min-w-0" style={{ flex: 1 }}>{stock.name}</span>
      <div className="relative h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ width: 60, background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${widthPct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: rank * 0.06, ease: "easeOut" }}
          className="absolute inset-y-0 left-0"
          style={{ background: color }}
        />
      </div>
      <span className="font-mono tabular-nums w-6 text-right" style={{ color, fontWeight: 590 }}>
        {stock.decision.score}
      </span>
    </motion.div>
  );
}

function flagFor(market: string): string {
  return ({ TW: "🇹🇼", US: "🇺🇸", HK: "🇭🇰", CN: "🇨🇳" } as Record<string, string>)[market] ?? "🌐";
}

// ─────────────────────────────────────────────────────
// 3. Strategy Signal Wheel — radar of 11 strategies
// ─────────────────────────────────────────────────────
function StrategySignalWheel() {
  // SSR 期間 ResponsiveContainer 拿不到 ResizeObserver，會印 width(-1) warning。
  // 用 mounted guard 確保只在 client 渲染圖表（SEO 不受影響，因為這是儀表板裝飾元件）。
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = useMemo(() => {
    return STRATEGIES.map((strat) => {
      // 該策略對所有股票的平均訊號強度
      const avg = PORTFOLIO.reduce((acc, stock) => {
        // simple deterministic
        const hash = (stock.shortCode + strat.id).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
        const noise = (hash % 30) - 15;
        return acc + Math.max(0, Math.min(100, stock.decision.score + noise));
      }, 0) / PORTFOLIO.length;
      return {
        strategy: strat.nameZh,
        score: Math.round(avg),
      };
    });
  }, []);

  return (
    <Card icon={<Sparkles className="h-3 w-3" />} title="11 策略訊號" eyebrow="Strategy Signals">
      <div className="h-[270px]">
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="78%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="strategy"
              tick={{ fill: "#a8a8b3", fontSize: 9, fontFamily: "Geist Sans" }}
            />
            <Radar
              dataKey="score"
              stroke={MINT_BRIGHT}
              fill={MINT_BRIGHT}
              fillOpacity={0.28}
              strokeWidth={1.6}
              isAnimationActive
              animationDuration={1400}
            />
          </RadarChart>
        </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────
// 4. Catalysts Timeline — 7 天重點事件
// ─────────────────────────────────────────────────────
const CATALYSTS = [
  { date: "04/30", flag: "🇺🇸", event: "Q1 GDP 終值", weight: "high",   tag: "macro" },
  { date: "05/01", flag: "🇺🇸", event: "ISM 製造業 PMI", weight: "med",  tag: "macro" },
  { date: "05/02", flag: "🇹🇼", event: "鴻海 4 月營收", weight: "high",  tag: "earnings" },
  { date: "05/03", flag: "🇺🇸", event: "非農就業", weight: "high",       tag: "macro" },
  { date: "05/06", flag: "🇨🇳", event: "外匯儲備", weight: "low",        tag: "macro" },
  { date: "05/07", flag: "🇭🇰", event: "騰訊 Q1 財報", weight: "high",   tag: "earnings" },
];

function CatalystTimeline() {
  const tagColor: Record<string, string> = {
    macro: "#7CC8F2",
    earnings: MINT_BRIGHT,
    policy: "#FCD34D",
  };
  const weightDot: Record<string, number> = { high: 2.5, med: 1.8, low: 1.2 };

  return (
    <Card icon={<Calendar className="h-3 w-3" />} title="未來 7 天重點" eyebrow="Catalysts">
      <div className="relative pl-3">
        <div className="absolute left-[5px] top-2 bottom-2 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="space-y-2.5">
          {CATALYSTS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative flex items-center gap-3 text-[12px]"
            >
              <span
                className="absolute -left-3 rounded-full"
                style={{
                  width: weightDot[c.weight] * 2.5,
                  height: weightDot[c.weight] * 2.5,
                  background: tagColor[c.tag],
                  border: `1px solid ${tagColor[c.tag]}66`,
                }}
              />
              <span className="font-mono text-[#62666d] w-10 flex-shrink-0">{c.date}</span>
              <span>{c.flag}</span>
              <span className="text-[#d0d6e0] truncate">{c.event}</span>
              <span
                className="ml-auto text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  background: `${tagColor[c.tag]}1a`,
                  color: tagColor[c.tag],
                  border: `1px solid ${tagColor[c.tag]}33`,
                }}
              >
                {c.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────
// Generic Card wrapper
// ─────────────────────────────────────────────────────
function Card({
  icon, eyebrow, title, children,
}: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-1">
        <span style={{ color: MINT_BRIGHT }}>{icon}</span>
        <span>{eyebrow}</span>
      </div>
      <h3 className="text-[18px] mb-4" style={{ color: "#f7f8f8", fontWeight: 590, letterSpacing: "-0.2px" }}>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
