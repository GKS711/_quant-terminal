"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Sparkles, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const GOLD = "#F5A623";
const GOLD_LITE = "#F8C04D";
const PINK = "#FF4D6D";
const BULL = "#26C281";
const BEAR = "#FF3B5C";
const NAVY_500 = "#1F3A6B";

// Mock market data — 之後會從 snapshot.json 抓真實資料
const MARKETS = [
  { flag: "🇹🇼", name: "台股", change: 1.42 },
  { flag: "🇺🇸", name: "美股", change: 0.83 },
  { flag: "🇭🇰", name: "港股", change: -0.51 },
  { flag: "🇨🇳", name: "A 股", change: 0.27 },
  { flag: "🇯🇵", name: "日股", change: 0.96 },
];

const TOP_OPPORTUNITIES = [
  { code: "NVDA", name: "NVIDIA", change: 7.99, signal: "AI 訊號 BUY · 30d +15.55%" },
  { code: "2330", name: "台積電", change: 3.42, signal: "MA 多頭排列 · 法人連 5 日買超" },
  { code: "TSLA", name: "Tesla", change: 5.18, signal: "MACD 黃金交叉 · 機構評等上修" },
];

const TOP_RISKS = [
  { code: "INTC", name: "Intel", change: -4.21, signal: "RSI 過熱 · 短線過漲過快" },
  { code: "0700", name: "騰訊", change: -2.85, signal: "成交量放大 · 籌碼鬆動" },
  { code: "BABA", name: "阿里", change: -3.12, signal: "跌破 MA20 · 動能轉弱" },
];

export function MarketPulse() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#0B1426",
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(31,58,107,0.6) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 80% 20%, rgba(245,166,35,0.10) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-12">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] mb-3"
          style={{ color: "#7A869A" }}
        >
          <Sparkles className="h-3 w-3" style={{ color: GOLD }} />
          <span>Market Pulse · 今日全局</span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
            style={{
              background: `rgba(245,166,35,0.12)`,
              color: GOLD,
              border: `1px solid ${GOLD}33`,
              fontWeight: 590,
            }}
          >
            LIVE
          </span>
        </motion.div>

        {/* Hero: AI Morning Brief */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[40px] sm:text-[56px] lg:text-[68px] leading-[1.05] tracking-[-0.04em] max-w-[940px]"
          style={{ color: "#F4F6FA", fontWeight: 510 }}
        >
          打開就知道{" "}
          <span style={{ color: GOLD }} className="italic font-normal">
            今天該不該動
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-4 text-[16px] sm:text-[18px] max-w-[680px] leading-relaxed"
          style={{ color: "#A9B3C4" }}
        >
          AI 替你掃完全球 5 國 100 檔 + 50 條當日新聞 + 11 種策略訊號，
          <span style={{ color: GOLD_LITE }}>30 秒給你今日決策參考</span>。
        </motion.p>

        {/* AI Morning Brief Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="mt-8 rounded-2xl p-5 sm:p-7 max-w-[920px] relative"
          style={{
            background: `linear-gradient(135deg, rgba(31,58,107,0.5) 0%, rgba(11,20,38,0.7) 100%)`,
            border: `1px solid rgba(245,166,35,0.18)`,
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245,166,35,0.10)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="grid h-6 w-6 place-items-center rounded-md"
              style={{ background: GOLD, color: "#0B1426" }}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: GOLD }}>
              AI Morning Brief · Gemma 4 31B
            </span>
          </div>
          <p
            className="text-[18px] sm:text-[22px] leading-[1.5]"
            style={{ color: "#F4F6FA", fontWeight: 510 }}
          >
            「美股昨夜創高，AI 半導體領漲；台股早盤可關注台積電與 NVIDIA 連動。
            港股恆生跌破 5 日均線，等反彈訊號再進場。日股維持高檔震盪。」
          </p>
          <div className="mt-3 text-[11px] font-mono" style={{ color: "#7A869A" }}>
            根據 Yahoo + Stooq + 5 國指數 + 11 策略 + 24h 新聞情緒分析
          </div>
        </motion.div>

        {/* Markets row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {MARKETS.map((m) => {
            const isUp = m.change >= 0;
            return (
              <div
                key={m.name}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{
                  background: "rgba(244,246,250,0.025)",
                  border: "1px solid rgba(244,246,250,0.08)",
                }}
              >
                <span className="text-[18px]">{m.flag}</span>
                <span className="text-[13px]" style={{ color: "#F4F6FA", fontWeight: 590 }}>
                  {m.name}
                </span>
                <span
                  className="text-[12px] font-mono tabular-nums inline-flex items-center"
                  style={{ color: isUp ? BULL : BEAR }}
                >
                  {isUp ? "+" : ""}
                  {m.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Top Opportunities + Top Risks */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, rgba(38,194,129,0.06) 0%, rgba(11,20,38,0.5) 100%)`,
              border: "1px solid rgba(38,194,129,0.20)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight className="h-4 w-4" style={{ color: BULL }} />
              <span
                className="text-[11px] font-mono uppercase tracking-widest"
                style={{ color: BULL, fontWeight: 590 }}
              >
                Top Opportunities · 今日機會
              </span>
            </div>
            <div className="space-y-2.5">
              {TOP_OPPORTUNITIES.map((s) => (
                <div key={s.code} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-[15px] font-mono tabular-nums"
                        style={{ color: "#F4F6FA", fontWeight: 590 }}
                      >
                        {s.code}
                      </span>
                      <span className="text-[12px]" style={{ color: "#A9B3C4" }}>
                        {s.name}
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "#7A869A" }}>
                      {s.signal}
                    </div>
                  </div>
                  <span
                    className="text-[14px] font-mono tabular-nums flex-shrink-0"
                    style={{ color: BULL, fontWeight: 590 }}
                  >
                    +{s.change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risks */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, rgba(255,77,109,0.08) 0%, rgba(11,20,38,0.5) 100%)`,
              border: `1px solid rgba(255,77,109,0.25)`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4" style={{ color: PINK }} />
              <span
                className="text-[11px] font-mono uppercase tracking-widest"
                style={{ color: PINK, fontWeight: 590 }}
              >
                Top Risks · 今日警示
              </span>
            </div>
            <div className="space-y-2.5">
              {TOP_RISKS.map((s) => (
                <div key={s.code} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-[15px] font-mono tabular-nums"
                        style={{ color: "#F4F6FA", fontWeight: 590 }}
                      >
                        {s.code}
                      </span>
                      <span className="text-[12px]" style={{ color: "#A9B3C4" }}>
                        {s.name}
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "#7A869A" }}>
                      {s.signal}
                    </div>
                  </div>
                  <span
                    className="text-[14px] font-mono tabular-nums flex-shrink-0"
                    style={{ color: BEAR, fontWeight: 590 }}
                  >
                    {s.change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] transition-all"
            style={{
              background: GOLD,
              color: "#0B1426",
              fontWeight: 590,
              boxShadow: `0 8px 24px -8px ${GOLD}88`,
            }}
          >
            打開完整儀表板 →
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] transition-all"
            style={{
              background: "rgba(244,246,250,0.04)",
              color: "#D6DCE6",
              border: "1px solid rgba(244,246,250,0.12)",
            }}
          >
            問 AI 顧問
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] transition-all"
            style={{
              background: "rgba(244,246,250,0.04)",
              color: "#D6DCE6",
              border: "1px solid rgba(244,246,250,0.12)",
            }}
          >
            設個人 watchlist
          </button>
          <span
            className="ml-auto text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "#566175" }}
          >
            v2.0 · WIP · 2026-05-03
          </span>
        </motion.div>
      </div>
    </section>
  );
}
