"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid,
} from "recharts";
import { TrendingUp, Target, Activity, Calendar } from "lucide-react";

import { BACKTEST_DATA, BACKTEST_STATS, MONTHLY_WIN_RATE } from "@/lib/backtest-data";

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
const BENCHMARK_COLOR = "#8a8f98";
const BULL = "#10b981";

/**
 * Backtest Results — 12 個月策略 vs 大盤的累積報酬，含統計卡片
 *
 * 視覺：
 *   - 主圖：area chart，策略 mint 色填充，大盤虛線
 *   - 4 個統計卡：總報酬 / 超額 alpha / Sharpe / 最大回撤
 *   - 月勝率：12 個小方塊（綠/紅）
 */
export function BacktestChart() {
  return (
    <section
      className="relative py-20 border-b border-white/[0.06]"
      style={{ background: "#0a0c10" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Activity className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>Backtest · 12 Months</span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
            style={{
              background: "rgba(252,211,77,0.10)",
              color: "#FCD34D",
              border: "1px solid rgba(252,211,77,0.30)",
              fontWeight: 590,
            }}
            title="回測數值為合理範圍內的示範資料；底層 daily_stock_analysis 有完整 walk-forward 模組"
          >
            DEMO
          </span>
        </div>

        <h2
          className="text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.04em] text-white max-w-[680px]"
          style={{ fontWeight: 510 }}
        >
          策略 vs 大盤，<span style={{ color: MINT_BRIGHT }} className="italic font-normal">12 個月。</span>
        </h2>
        <p className="mt-3 text-[14px]" style={{ color: "#a8a8b3" }}>
          Walk-forward · 月 rebalance · 扣除手續費後 alpha +6.2%
        </p>

        {/* Stats grid */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="總報酬"
            value={`+${BACKTEST_STATS.totalReturn}%`}
            sub={`大盤 +${BACKTEST_STATS.benchmarkReturn}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            tone="bull"
          />
          <StatCard
            label="超額報酬 α"
            value={`+${BACKTEST_STATS.excessReturn}%`}
            sub="vs 加權指數"
            icon={<Target className="h-4 w-4" />}
            tone="mint"
          />
          <StatCard
            label="Sharpe Ratio"
            value={BACKTEST_STATS.sharpeRatio.toFixed(2)}
            sub="高於門檻 1.5"
            icon={<Activity className="h-4 w-4" />}
            tone="bright"
          />
          <StatCard
            label="最大回撤"
            value={`${BACKTEST_STATS.maxDrawdown}%`}
            sub={`勝率 ${BACKTEST_STATS.winRate}%`}
            icon={<Calendar className="h-4 w-4" />}
            tone="dim"
          />
        </div>

        {/* Chart */}
        <div
          className="mt-10 rounded-xl p-5 sm:p-7"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <ChartArea />
        </div>

        {/* Monthly win/loss strip */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#62666d]">月勝率</span>
          <div className="flex gap-1.5 flex-1">
            {MONTHLY_WIN_RATE.map((m) => (
              <div
                key={m.month}
                title={`${m.month} — ${m.win ? "勝" : "敗"}`}
                className="flex-1 h-3 rounded-sm transition-transform hover:scale-110"
                style={{
                  background: m.win ? `${BULL}66` : "rgba(229,72,77,0.25)",
                  border: `1px solid ${m.win ? `${BULL}aa` : "rgba(229,72,77,0.5)"}`,
                }}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono tabular-nums text-[#a8a8b3]">
            {MONTHLY_WIN_RATE.filter((m) => m.win).length} / {MONTHLY_WIN_RATE.length}
          </span>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label, value, sub, icon, tone,
}: {
  label: string; value: string; sub: string; icon: React.ReactNode;
  tone: "bull" | "mint" | "bright" | "dim";
}) {
  const colors: Record<string, string> = {
    bull: BULL, mint: MINT_BRIGHT, bright: "#f7f8f8", dim: "#8a8f98",
  };
  const color = colors[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="rounded-lg p-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#62666d]">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-[28px] tabular-nums" style={{ color, fontWeight: 590, letterSpacing: "-0.5px" }}>
        {value}
      </div>
      <div className="text-[11px] text-[#62666d] mt-1">{sub}</div>
    </motion.div>
  );
}

function ChartArea() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (inView) setAnimKey((k) => k + 1);
  }, [inView]);

  return (
    <div ref={ref} style={{ width: "100%", height: 320 }}>
      {inView && (
        <ResponsiveContainer key={animKey} width="100%" height="100%">
          <AreaChart data={BACKTEST_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="strategyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={MINT_BRIGHT} stopOpacity={0.4} />
                <stop offset="100%" stopColor={MINT_BRIGHT} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BENCHMARK_COLOR} stopOpacity={0.18} />
                <stop offset="100%" stopColor={BENCHMARK_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#62666d"
              tick={{ fill: "#62666d", fontSize: 11, fontFamily: "Geist Mono, monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#62666d"
              tick={{ fill: "#62666d", fontSize: 11, fontFamily: "Geist Mono, monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v >= 0 ? "+" : ""}${v}%`}
              domain={["auto", "auto"]}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const strategy = payload.find((p) => p.dataKey === "strategy")?.value as number;
                const bench = payload.find((p) => p.dataKey === "benchmark")?.value as number;
                return (
                  <div
                    className="rounded-lg p-3 text-[11px] font-mono"
                    style={{
                      background: "rgba(8,9,10,0.92)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7)",
                    }}
                  >
                    <div className="text-[#a8a8b3] mb-1">{label}</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: MINT_BRIGHT }} />
                      <span className="text-[#f7f8f8]">策略</span>
                      <span className="ml-auto tabular-nums" style={{ color: MINT_BRIGHT }}>
                        {strategy >= 0 ? "+" : ""}{strategy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: BENCHMARK_COLOR }} />
                      <span className="text-[#a8a8b3]">大盤</span>
                      <span className="ml-auto tabular-nums" style={{ color: BENCHMARK_COLOR }}>
                        {bench >= 0 ? "+" : ""}{bench.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke={BENCHMARK_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="url(#benchFill)"
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="strategy"
              stroke={MINT_BRIGHT}
              strokeWidth={2.4}
              fill="url(#strategyFill)"
              isAnimationActive
              animationDuration={1800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
