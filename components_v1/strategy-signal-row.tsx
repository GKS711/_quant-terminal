"use client";

import { motion } from "framer-motion";
import { type Stock } from "@/lib/portfolio";
import { STRATEGIES, getStrategySignal } from "@/lib/strategies";

const BULL = "#10b981";
const BEAR = "#E5484D";
const MINT_BRIGHT = "#6FC298";

/**
 * Per-stock 11 strategy signal grid — 一檔股票的所有 11 策略訊號
 */
export function StrategySignalRow({ stock }: { stock: Stock }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {STRATEGIES.map((strat, i) => {
        const sig = getStrategySignal(stock, strat.id);
        const Icon = strat.icon;
        const color = sig.signal === "buy" ? BULL : sig.signal === "sell" ? BEAR : "#a8a8a8";
        const alpha = 0.18 + (sig.score / 100) * 0.5;

        return (
          <motion.div
            key={strat.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.04, duration: 0.45 }}
            title={`${strat.nameZh}：${strat.simpleDesc}`}
            className="rounded-lg px-3 py-2.5 flex items-center gap-2.5 cursor-help"
            style={{
              background: `rgba(${hexToRgb(color)},${alpha * 0.4})`,
              border: `1px solid ${color}33`,
            }}
          >
            <div
              className="grid h-7 w-7 place-items-center rounded flex-shrink-0"
              style={{ background: `${color}20` }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] truncate" style={{ color: "#f7f8f8", fontWeight: 510 }}>
                {strat.nameZh}
              </div>
              <div className="text-[9px] font-mono text-[#62666d] uppercase tracking-wider truncate">
                {strat.nameEn}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color, fontWeight: 590 }}>
                {sig.signal}
              </div>
              <div className="text-[12px] tabular-nums" style={{ color, fontWeight: 590 }}>
                {sig.score}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
