"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useScroll } from "framer-motion";
import { ArrowDown, Sparkles, TrendingUp, TrendingDown, Cpu } from "lucide-react";

import { PORTFOLIO, PORTFOLIO_IS_LIVE, MARKETS, type Stock } from "@/lib/portfolio";
import { Sparkline } from "@/components/sparkline";

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

/**
 * Hero Pitch — Apple 風 minimal landing
 *
 * 視覺策略：
 *   - 100vh 留白，置中
 *   - 一句話大標
 *   - **單一動態卡片**：在 6 檔股票之間每 4 秒輪播
 *     -> 卡片裡面：價格 count-up、sparkline 描繪動畫、"AI 分析中..." 打字機效果、score 0→N 動畫
 *   - 一顆 CTA + 向下箭頭引導 scroll
 *   - 背景：mint 點點 grid + radial 漸層
 *
 * 邏輯：使用者 scroll 後才會看到完整的 12 卡 Decision Terminal
 */

const FEATURED: Stock[] = (() => {
  // 從 portfolio 挑 6 檔 spotlight，覆蓋 4 個市場
  const order = ["NVDA", "2330.TW", "0700.HK", "AAPL", "600519.SS", "TSLA"];
  return order
    .map((sym) => PORTFOLIO.find((s) => s.symbol === sym))
    .filter((s): s is Stock => Boolean(s));
})();

const ROTATE_MS = 4500;

export function HeroPitch() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-linked: hero 內容 scroll 時往上飄 + fade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]); // parallax

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % FEATURED.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = FEATURED[index];

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-b border-white/[0.06]"
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse 70% 60% at 50% 35%, ${MINT}14 0%, transparent 60%), #08090a`,
      }}
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} aria-hidden className="absolute inset-0 pointer-events-none">
        <BgDots />
      </motion.div>

      {/* Status bar */}
      <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono text-[#a8a8b3] flex-wrap justify-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: MINT_BRIGHT }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: MINT_BRIGHT }} />
          </span>
          <span className="uppercase tracking-wider">LIVE</span>
          <span className="text-[#62666d]">·</span>
          <Cpu className="h-3 w-3" />
          <span>gemma-4-31b-it</span>
          <span className="text-[#62666d]">·</span>
          <span>分析 12 檔 / 4 市場</span>
          <span className="text-[#62666d]">·</span>
          {PORTFOLIO_IS_LIVE ? (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
              style={{
                background: "rgba(16,185,129,0.10)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.30)",
                fontWeight: 590,
              }}
              title="本次 build 抓到真實 Yahoo Finance 報價 + Gemma 4 AI 決策"
            >
              LIVE
            </span>
          ) : (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
              style={{
                background: "rgba(252,211,77,0.10)",
                color: "#FCD34D",
                border: "1px solid rgba(252,211,77,0.30)",
                fontWeight: 590,
              }}
            >
              DEMO
            </span>
          )}
        </motion.div>
      </div>

      {/* Center column */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-20"
      >
        {/* Big headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="text-center text-[36px] sm:text-[58px] lg:text-[88px] leading-[1.0] tracking-[-0.045em] sm:tracking-[-0.05em] text-white max-w-[1100px] px-2"
          style={{ fontWeight: 510, fontFeatureSettings: '"cv01","ss03","tnum"' }}
        >
          AI 在{" "}
          <span style={{ color: MINT_BRIGHT }} className="italic font-normal">看懂</span>{" "}
          全球股票
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-center text-[15px] sm:text-[18px] max-w-[560px]"
          style={{ color: "#a8a8b3", letterSpacing: "-0.165px" }}
        >
          台股 · 美股 · 港股 · A 股，AI 替你整理每日市場觀察與決策參考。
        </motion.p>

        {/* Featured demo card — auto-cycling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-14 w-full max-w-[640px] mx-auto relative"
        >
          {/* halo glow behind card */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 blur-[120px] opacity-50"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${MINT_BRIGHT}55 0%, transparent 65%)`,
            }}
          />

          <AnimatePresence mode="wait" custom={dir}>
            <FeaturedCard
              key={current.symbol}
              stock={current}
              direction={dir}
            />
          </AnimatePresence>

          {/* progress dots */}
          <div className="mt-5 flex justify-center gap-1.5">
            {FEATURED.map((s, i) => (
              <button
                key={s.symbol}
                onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                className="h-1 rounded-full transition-all duration-500 focus:outline-none"
                style={{
                  width: i === index ? 28 : 8,
                  background: i === index ? MINT_BRIGHT : "rgba(255,255,255,0.18)",
                }}
                aria-label={`切換到 ${s.shortCode}`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-12 flex items-center gap-3"
        >
          <a
            href="#decision"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] transition-transform hover:-translate-y-[2px]"
            style={{
              background: MINT,
              color: "#08090a",
              fontWeight: 590,
              boxShadow: `0 0 0 1px ${MINT}66, 0 14px 40px -10px ${MINT}66`,
            }}
          >
            看完整分析 →
          </a>
          <a
            href="#advisor"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] text-[#a8a8b3] hover:text-[#f7f8f8] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            問 AI 顧問
          </a>
          <a
            href="/markets"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] text-[#a8a8b3] hover:text-[#f7f8f8] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            全部標的池
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#62666d]">scroll</span>
          <ArrowDown className="h-4 w-4 text-[#62666d]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// Featured Card — auto-cycling spotlight with rich animations
// ════════════════════════════════════════════════════════
function FeaturedCard({ stock, direction }: { stock: Stock; direction: number }) {
  const market = MARKETS[stock.market];
  const positive = stock.spark30d
    ? stock.spark30d[stock.spark30d.length - 1] >= stock.spark30d[0]
    : stock.decision.signal === "buy";
  const sigColor =
    stock.decision.signal === "buy"  ? BULL :
    stock.decision.signal === "sell" ? BEAR : "#a8a8a8";

  // 優先使用真實 quote（從 portfolio.ts 的 snapshot merge），fallback 到 sparkline 推算
  const currencySymbol =
    market.currency === "USD" ? "$" :
    market.currency === "TWD" ? "NT$" :
    market.currency === "HKD" ? "HK$" : "¥";
  const realPrice = stock.quote?.price ?? stock.spark30d?.at(-1) ?? 100;
  const realPct = stock.quote?.changePct ?? (
    stock.spark30d
      ? ((stock.spark30d.at(-1)! - stock.spark30d.at(-2)!) / stock.spark30d.at(-2)!) * 100
      : 0
  );
  const fp = { price: realPrice, pct: realPct, symbol: currencySymbol };

  return (
    <motion.div
      custom={direction}
      initial={{ opacity: 0, x: direction * 24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -direction * 24, scale: 0.97 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-7 sm:p-8 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow:
          "0 30px 80px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* signal accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${sigColor}, transparent)` }}
      />

      {/* header: flag + code + signal pill */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[36px] leading-none">{market.flag}</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-mono" style={{ color: "#f7f8f8", fontWeight: 590, letterSpacing: "-0.5px" }}>
                {stock.shortCode}
              </span>
              <span className="text-[14px] text-[#a8a8b3]">{stock.name}</span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mt-0.5">
              {market.exchange} · {stock.sector}
            </div>
          </div>
        </div>

        {/* AI thinking → result */}
        <ThinkingToSignal signal={stock.decision.signal} score={stock.decision.score} />
      </div>

      {/* Big price */}
      <div className="mt-7 flex items-baseline gap-2">
        <AnimatedPrice
          symbol={fp.symbol}
          to={fp.price}
        />
        <span
          className="text-[14px] tabular-nums font-mono"
          style={{ color: positive ? BULL : BEAR }}
        >
          {positive ? <TrendingUp className="inline h-3.5 w-3.5 mr-0.5" /> : <TrendingDown className="inline h-3.5 w-3.5 mr-0.5" />}
          {positive ? "+" : ""}{fp.pct.toFixed(2)}%
        </span>
      </div>

      {/* Big sparkline */}
      <div className="mt-5 -mx-1">
        <Sparkline
          data={stock.spark30d ?? [1, 1]}
          width={560}
          height={88}
          strokeWidth={2.2}
          color={positive ? BULL : BEAR}
        />
      </div>

      {/* Typing rationale */}
      <div className="mt-6 flex items-start gap-3">
        <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: MINT_BRIGHT }} />
        <Typewriter text={stock.decision.rationale} key={stock.symbol} />
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────
// AnimatedPrice — count-up effect
// ────────────────────────────────────────────────────────
function AnimatedPrice({ symbol, to }: { symbol: string; to: number }) {
  const value = useMotionValue(0);
  const display = useTransform(value, (v) =>
    `${symbol}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  );

  useEffect(() => {
    const controls = animate(value, to, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [to, value]);

  return (
    <motion.span
      className="text-[44px] sm:text-[52px] tabular-nums leading-none"
      style={{
        fontWeight: 510,
        color: "#f7f8f8",
        letterSpacing: "-1.2px",
        fontFeatureSettings: '"tnum"',
      }}
    >
      {display}
    </motion.span>
  );
}

// ────────────────────────────────────────────────────────
// ThinkingToSignal — "分析中..." → BUY 88
// ────────────────────────────────────────────────────────
function ThinkingToSignal({ signal, score }: { signal: "buy" | "hold" | "sell"; score: number }) {
  const [phase, setPhase] = useState<"thinking" | "done">("thinking");
  const sigColor = signal === "buy" ? BULL : signal === "sell" ? BEAR : "#a8a8a8";

  useEffect(() => {
    setPhase("thinking");
    const t = setTimeout(() => setPhase("done"), 1100);
    return () => clearTimeout(t);
  }, [signal, score]);

  const animValue = useMotionValue(0);
  const animDisplay = useTransform(animValue, (v) => Math.round(v).toString());

  useEffect(() => {
    if (phase === "done") {
      animValue.set(0);
      const c = animate(animValue, score, { duration: 0.9, ease: "easeOut" });
      return () => c.stop();
    }
  }, [phase, score, animValue]);

  return (
    <div className="flex flex-col items-end gap-1.5">
      <AnimatePresence mode="wait">
        {phase === "thinking" ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#a8a8b3",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <ThinkingDots />
            分析中
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-mono uppercase tracking-wider"
            style={{
              background: `${sigColor}1f`,
              color: sigColor,
              border: `1px solid ${sigColor}55`,
              fontWeight: 590,
            }}
          >
            {signal}
            <span style={{ color: sigColor }} className="tabular-nums">
              <motion.span>{animDisplay}</motion.span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.0, delay: i * 0.18, repeat: Infinity }}
          className="inline-block h-0.5 w-0.5 rounded-full"
          style={{ background: "#a8a8b3" }}
        />
      ))}
    </span>
  );
}

// ────────────────────────────────────────────────────────
// Typewriter — token-by-token reveal
// ────────────────────────────────────────────────────────
function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text]);

  return (
    <p
      className="text-[13.5px] sm:text-[14.5px] leading-[1.6] text-[#d0d6e0] min-h-[44px]"
      style={{ letterSpacing: "-0.1px" }}
    >
      {shown}
      <motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.0, repeat: Infinity }}
        className="inline-block ml-0.5 align-text-bottom"
        style={{ width: 1.5, height: 14, background: MINT_BRIGHT }}
      />
    </p>
  );
}

// ────────────────────────────────────────────────────────
// Background dot grid + radial gradient ambient
// ────────────────────────────────────────────────────────
function BgDots() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(111,194,152,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      {/* slow drifting glow */}
      <motion.div
        aria-hidden
        animate={{ x: [-40, 40, -40], y: [-20, 20, -20] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none rounded-full blur-[180px] opacity-30"
        style={{ background: `radial-gradient(circle, ${MINT}88 0%, transparent 70%)` }}
      />
    </>
  );
}
