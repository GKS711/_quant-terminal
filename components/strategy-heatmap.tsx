"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

import { PORTFOLIO, MARKETS, type Stock } from "@/lib/portfolio";
import { STRATEGIES, getStrategySignal, type StrategyId } from "@/lib/strategies";

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

/**
 * Strategy × Stock heatmap
 *
 * 11 列（策略） × 8 欄（股票）的格子矩陣
 * 每格顏色代表訊號：buy=綠、hold=灰、sell=紅
 * 顏色深淺代表 score 強度（透明度）
 * Hover 任一格 → tooltip 顯示策略 × 股票 + signal + score + 簡述
 */
export function StrategyHeatmap() {
  const [hover, setHover] = useState<{
    stock: Stock;
    strategyId: StrategyId;
    x: number;
    y: number;
  } | null>(null);

  return (
    <section
      className="relative py-20 border-b border-white/[0.06]"
      style={{ background: "#08090a" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Sparkles className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>Strategy Engine</span>
        </div>

        <h2
          className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.04em] text-white max-w-[680px]"
          style={{ fontWeight: 510 }}
        >
          11 策略 × 12 個股，<span style={{ color: MINT_BRIGHT }} className="italic font-normal">同時推論。</span>
        </h2>
        <p className="mt-3 text-[14px]" style={{ color: "#a8a8b3" }}>
          技術 7 種 · 基本 3 種 · 共識 1 種 — 加權投票得最終訊號
        </p>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#8a8f98]">
          <LegendCell color={BULL}  label="BUY" />
          <LegendCell color="#7a7a7a" label="HOLD" />
          <LegendCell color={BEAR}  label="SELL" />
          <span className="text-[10px] text-[#62666d] flex items-center gap-1.5">
            <Info className="h-3 w-3" /> 顏色深淺 = 訊號強度（信心分數）
          </span>
        </div>

        {/* Heatmap — desktop table（≥sm）*/}
        <div className="mt-8 overflow-x-auto hidden sm:block">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "3px" }}>
            <thead>
              <tr>
                <th className="text-left text-[11px] font-mono uppercase tracking-wider text-[#62666d] pr-3 pb-3">策略</th>
                {PORTFOLIO.map((s) => (
                  <th
                    key={s.symbol}
                    className="text-center text-[11px] font-mono pb-3 px-1"
                    style={{ minWidth: 64 }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[12px] leading-none">{MARKETS[s.market].flag}</span>
                      <span className="text-[#f7f8f8]" style={{ fontWeight: 590 }}>{s.shortCode}</span>
                    </div>
                    <div className="text-[9px] text-[#62666d] mt-0.5 truncate">{s.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRATEGIES.map((strategy) => {
                const Icon = strategy.icon;
                return (
                  <tr key={strategy.id}>
                    <td className="pr-3 py-1">
                      <div className="flex items-center gap-2 text-[12px]">
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: strategy.technical ? MINT_BRIGHT : "#a8a8b3" }} />
                        <div>
                          <div className="text-[#d0d6e0]" style={{ fontWeight: 510 }}>{strategy.nameZh}</div>
                          <div className="text-[10px] text-[#62666d] font-mono">{strategy.nameEn}</div>
                        </div>
                      </div>
                    </td>
                    {PORTFOLIO.map((stock) => {
                      const sig = getStrategySignal(stock, strategy.id);
                      return (
                        <td key={stock.symbol} className="text-center">
                          <HeatCell
                            stock={stock}
                            strategyId={strategy.id}
                            signal={sig.signal}
                            score={sig.score}
                            onHover={(rect) => setHover({
                              stock,
                              strategyId: strategy.id,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            })}
                            onLeave={() => setHover(null)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile fallback：< sm 顯示 11 條策略 + per-strategy 平均訊號（不展開 12 欄）*/}
        <div className="mt-8 sm:hidden space-y-1.5">
          {STRATEGIES.map((strategy) => {
            const Icon = strategy.icon;
            // 11 策略對 12 股的平均
            const sigs = PORTFOLIO.map((s) => getStrategySignal(s, strategy.id));
            const avgScore = Math.round(sigs.reduce((a, b) => a + b.score, 0) / sigs.length);
            const buyCount = sigs.filter((s) => s.signal === "buy").length;
            const sellCount = sigs.filter((s) => s.signal === "sell").length;
            const dominantSignal = buyCount >= sellCount + 2 ? "buy" : sellCount >= buyCount + 2 ? "sell" : "hold";
            const color =
              dominantSignal === "buy" ? BULL :
              dominantSignal === "sell" ? BEAR : "#a8a8a8";
            return (
              <div
                key={strategy.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{
                  background: `${color}10`,
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] truncate" style={{ color: "#f7f8f8", fontWeight: 510 }}>
                    {strategy.nameZh}
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#62666d]">
                    {strategy.nameEn}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span style={{ color: BULL }}>↑{buyCount}</span>
                  <span style={{ color: BEAR }}>↓{sellCount}</span>
                </div>
                <div
                  className="text-[14px] tabular-nums w-8 text-right"
                  style={{ color, fontWeight: 590 }}
                >
                  {avgScore}
                </div>
              </div>
            );
          })}
          <p className="text-[11px] text-[#62666d] mt-3 leading-relaxed">
            行動裝置只顯示 11 策略 × 12 股的平均強度。完整 88 cells heatmap 請用桌機觀看。
          </p>
        </div>

        {/* Hover tooltip (portal-style fixed positioning) */}
        <AnimatePresence>
          {hover && <HeatmapTooltip data={hover} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Cell ──────────────────────────────────────────────

function HeatCell({
  stock, strategyId, signal, score, onHover, onLeave,
}: {
  stock: Stock;
  strategyId: StrategyId;
  signal: "buy" | "hold" | "sell";
  score: number;
  onHover: (rect: DOMRect) => void;
  onLeave: () => void;
}) {
  const baseColor = signal === "buy" ? BULL : signal === "sell" ? BEAR : "#7a7a7a";
  const alpha = 0.18 + (score / 100) * 0.67;
  const bg = hexAlpha(baseColor, alpha);
  const strategyMeta = STRATEGIES.find((s) => s.id === strategyId);

  // a11y label：「2330 台積電 · MA Trend · buy · 82」
  const ariaLabel = `${stock.shortCode} ${stock.name}, ${strategyMeta?.nameZh ?? strategyId}, ${signal}, ${score}`;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onMouseEnter={(e) => onHover(e.currentTarget.getBoundingClientRect())}
      onMouseLeave={onLeave}
      onFocus={(e) => onHover(e.currentTarget.getBoundingClientRect())}
      onBlur={onLeave}
      className="relative w-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6FC298]"
      style={{
        height: 32,
        background: bg,
        borderRadius: 4,
        border: `1px solid ${hexAlpha(baseColor, 0.4)}`,
      }}
    >
      <span className="text-[10px] font-mono tabular-nums" style={{ color: "#f7f8f8", fontWeight: 590 }}>
        {score}
      </span>
    </button>
  );
}

function LegendCell({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-3 w-3 rounded-sm"
        style={{ background: hexAlpha(color, 0.6), border: `1px solid ${hexAlpha(color, 0.5)}` }}
      />
      {label}
    </span>
  );
}

// ─── Tooltip ───────────────────────────────────────────

function HeatmapTooltip({
  data,
}: {
  data: { stock: Stock; strategyId: StrategyId; x: number; y: number };
}) {
  const strategy = STRATEGIES.find((s) => s.id === data.strategyId);
  const sig = getStrategySignal(data.stock, data.strategyId);
  if (!strategy) return null;
  const sigColor = sig.signal === "buy" ? BULL : sig.signal === "sell" ? BEAR : "#a8a8a8";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: data.x,
        top: data.y - 12,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div
        className="rounded-lg p-3 backdrop-blur-xl"
        style={{
          background: "rgba(8,9,10,0.92)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          minWidth: 240,
          maxWidth: 280,
        }}
      >
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[14px] font-mono text-[#f7f8f8]" style={{ fontWeight: 590 }}>
            {data.stock.shortCode}
          </span>
          <span className="text-[11px] text-[#8a8f98]">{data.stock.name}</span>
          <span
            className="ml-auto text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: hexAlpha(sigColor, 0.15), color: sigColor, border: `1px solid ${hexAlpha(sigColor, 0.4)}` }}
          >
            {sig.signal} {sig.score}
          </span>
        </div>
        <div className="text-[11px] text-[#a8a8b3] font-mono uppercase tracking-wider mb-1">{strategy.nameZh}</div>
        <p className="text-[11.5px] leading-[1.5] text-[#c8d0dc]">{strategy.simpleDesc}</p>
        <p className="text-[10px] leading-[1.4] text-[#62666d] mt-1.5 italic">{strategy.description}</p>
      </div>
    </motion.div>
  );
}

// ─── utils ─────────────────────────────────────────────

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
