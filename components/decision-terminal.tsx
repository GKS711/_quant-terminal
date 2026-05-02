"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, Sparkles, Github,
  RefreshCw, Cpu, Cpu as ChipIcon, Layers, Car, Cloud,
  Smartphone, Globe, Wine, Wallet, Building2,
} from "lucide-react";

import Link from "next/link";

import {
  PORTFOLIO,
  MARKETS,
  marketAggregates,
  portfolioHealth,
  type Stock,
  type Market,
  type Signal,
} from "@/lib/portfolio";
import { buildStockUrl } from "@/lib/stock-routes";
import { Sparkline } from "@/components/sparkline";
import { useSound } from "@/lib/use-sound";

// ─── Tokens ───
const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

// ─── Sector → icon ───
const SECTOR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "半導體": ChipIcon,
  "ETF": Layers,
  "電子代工": Building2,
  "電子零組件": Layers,
  "光電": Sparkles,
  "食品": Wine,
  "金融": Wallet,
  "電動車": Car,
  "雲端運算": Cloud,
  "消費電子": Smartphone,
  "網際網路": Globe,
  "白酒": Wine,
  "支付": Wallet,
  "電信": Globe,
};

// ─── Signal styles ───
const SIGNAL_COLORS: Record<Signal, { fg: string; bg: string; bd: string; label: string; tooltip: string }> = {
  buy:  { fg: BULL,      bg: "rgba(16,185,129,0.12)", bd: "rgba(16,185,129,0.32)", label: "BUY",  tooltip: "AI 共識偏多 — 多個策略傾向加碼" },
  hold: { fg: "#a8a8a8", bg: "rgba(168,168,168,0.10)", bd: "rgba(168,168,168,0.24)", label: "HOLD", tooltip: "AI 觀望 — 多空分歧或訊號偏弱（不是「已持股」的意思，是建議「不操作」）" },
  sell: { fg: BEAR,      bg: "rgba(229,72,77,0.12)",  bd: "rgba(229,72,77,0.32)",  label: "SELL", tooltip: "AI 共識偏空 — 多個策略傾向減碼" },
};

const SignalIcon = ({ s, className }: { s: Signal; className?: string }) =>
  s === "buy" ? <TrendingUp className={className} /> :
  s === "sell" ? <TrendingDown className={className} /> :
  <Minus className={className} />;

interface LiveQuote { ticker: string; price: number; changePercent: number; currency?: string }

// ═══════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════
export function DecisionTerminal() {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const [source, setSource] = useState<"yahoo" | "mock" | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [openStock, setOpenStock] = useState<Stock | null>(null);
  const [marketFilter, setMarketFilter] = useState<Market | "ALL">("ALL");
  const [flashing, setFlashing] = useState<Set<string>>(new Set());

  const health = useMemo(() => portfolioHealth(), []);
  const aggregates = useMemo(() => marketAggregates(), []);
  const playSound = useSound();

  const visibleStocks = useMemo(() => {
    return marketFilter === "ALL"
      ? PORTFOLIO
      : PORTFOLIO.filter((s) => s.market === marketFilter);
  }, [marketFilter]);

  useEffect(() => {
    let mounted = true;
    async function fetchQuotes() {
      try {
        const symbols = PORTFOLIO.map((s) => s.symbol).join(",");
        const r = await fetch(`/api/quotes?symbols=${symbols}`, { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        // 比對舊報價，差異 > 0.01% 算「變動」→ 觸發 flash
        setQuotes((prev) => {
          const next: Record<string, LiveQuote> = {};
          const flashed: string[] = [];
          for (const q of j.quotes ?? []) {
            next[q.ticker] = q;
            const old = prev[q.ticker];
            if (old && Math.abs(q.price - old.price) / old.price > 0.0001) {
              flashed.push(q.ticker);
            }
          }
          if (flashed.length > 0) {
            setFlashing(new Set(flashed));
            setTimeout(() => setFlashing(new Set()), 1100);
          }
          return next;
        });
        setSource(j.source?.startsWith("yahoo") ? "yahoo" : "mock");
        setUpdatedAt(new Date());
      } catch { /* ignore */ }
      finally { if (mounted) setLoading(false); }
    }
    fetchQuotes();
    // Live-feel：20s 輪詢（從 60s 縮短）
    const id = setInterval(fetchQuotes, 20_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden border-b border-white/[0.06]"
      style={{ background: `radial-gradient(ellipse 90% 50% at 50% 0%, ${MINT}11 0%, transparent 55%), #0a0c10` }}
    >
      <BgGrid />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-28 pb-16">
        <TerminalHeader source={source} updatedAt={updatedAt} loading={loading} />

        {/* Title — minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-[920px]"
        >
          <h1
            className="text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.0] tracking-[-0.045em] text-white"
            style={{ fontWeight: 510, fontFeatureSettings: '"cv01","ss03","tnum"' }}
          >
            全球市場{" "}
            <span style={{ color: MINT_BRIGHT }} className="italic font-normal">AI 觀察</span>
          </h1>
          <p
            className="mt-4 text-[15px] sm:text-[16px] max-w-[560px]"
            style={{ color: "#a8a8b3", letterSpacing: "-0.165px" }}
          >
            12 檔 · 4 市場 · Gemma 4 31B 整理多空訊號供你參考
          </p>
        </motion.div>

        {/* 4 Market summary chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2"
        >
          {aggregates.map((agg) => (
            <MarketChip key={agg.market.code} agg={agg} />
          ))}
        </motion.div>

        {/* Market filter row */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
          <FilterChip active={marketFilter === "ALL"} onClick={() => setMarketFilter("ALL")}>
            全部 · {PORTFOLIO.length}
          </FilterChip>
          {(Object.keys(MARKETS) as Market[]).map((m) => {
            const count = PORTFOLIO.filter((s) => s.market === m).length;
            return (
              <FilterChip key={m} active={marketFilter === m} onClick={() => setMarketFilter(m)}>
                {MARKETS[m].flag} {MARKETS[m].nameZh} · {count}
              </FilterChip>
            );
          })}
        </div>

        {/* Stock card grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {visibleStocks.map((stock, i) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                quote={quotes[stock.symbol]}
                delay={Math.min(i * 0.04, 0.4)}
                flashing={flashing.has(stock.symbol)}
                onClick={() => { playSound("click"); setOpenStock(stock); }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Health bar (compact) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-7 flex items-center gap-3 text-[11px] font-mono text-[#62666d]"
        >
          <span>投組健康分</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden max-w-[280px]" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${health.avgScore}%` }}
              transition={{ duration: 1.4, delay: 0.8 }}
              className="h-full" style={{ background: MINT_BRIGHT }}
            />
          </div>
          <span style={{ color: "#f7f8f8", fontWeight: 510 }}>{health.avgScore}/100</span>
          <span className="text-[#62666d]">·</span>
          <span style={{ color: BULL }}>多 {health.bullPct}%</span>
          <span style={{ color: BEAR }}>空 {health.bearPct}%</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {openStock && (
          <StockDetailDialog
            stock={openStock}
            quote={quotes[openStock.symbol]}
            onClose={() => setOpenStock(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// Terminal Header
// ═══════════════════════════════════════════════════════
function TerminalHeader({
  source, updatedAt, loading,
}: { source: "yahoo" | "mock" | null; updatedAt: Date | null; loading: boolean }) {
  const time = updatedAt?.toLocaleTimeString("zh-TW", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }) ?? "--:--:--";
  return (
    <div className="flex items-center gap-2 text-[11px] font-mono text-[#62666d] flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: MINT_BRIGHT }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: MINT_BRIGHT }} />
        </span>
        <span className="uppercase tracking-wider text-[#8a8f98]">{loading ? "CONNECTING" : "LIVE"}</span>
      </div>
      <span>·</span>
      <span className="inline-flex items-center gap-1"><Cpu className="h-3 w-3" /> gemma-4-31b-it</span>
      <span>·</span>
      <span>{source ?? "—"}</span>
      <span>·</span>
      <span>{time}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Market Chip (top summary)
// ═══════════════════════════════════════════════════════
function MarketChip({ agg }: { agg: ReturnType<typeof marketAggregates>[number] }) {
  return (
    <div
      className="rounded-xl px-3.5 py-2.5 flex items-center gap-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-[24px] leading-none">{agg.market.flag}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-[#f7f8f8]" style={{ fontWeight: 590 }}>{agg.market.nameZh}</span>
          <span className="text-[10px] font-mono text-[#62666d]">{agg.market.exchange}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] font-mono">
          <span className="text-[#a8a8b3]">avg</span>
          <span className="tabular-nums" style={{ color: agg.avgScore >= 60 ? BULL : agg.avgScore >= 50 ? "#a8a8a8" : BEAR, fontWeight: 590 }}>
            {agg.avgScore}
          </span>
          <span className="text-[#62666d]">·</span>
          <span style={{ color: BULL }}>↑{agg.bullPct}%</span>
          <span style={{ color: BEAR }}>↓{agg.bearPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Filter Chip
// ═══════════════════════════════════════════════════════
function FilterChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-mono transition-colors"
      style={{
        background: active ? "rgba(78,170,133,0.15)" : "rgba(255,255,255,0.02)",
        color: active ? MINT_BRIGHT : "#a8a8b3",
        border: `1px solid ${active ? "rgba(78,170,133,0.4)" : "rgba(255,255,255,0.08)"}`,
        fontWeight: active ? 590 : 510,
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// Single Stock Card — visual-first, sparkline-anchored
// ═══════════════════════════════════════════════════════
function StockCard({
  stock, quote, delay, onClick, flashing,
}: { stock: Stock; quote: LiveQuote | undefined; delay: number; onClick: () => void; flashing?: boolean }) {
  const sigStyle = SIGNAL_COLORS[stock.decision.signal];
  const positive = (quote?.changePercent ?? 0) >= 0;
  const market = MARKETS[stock.market];
  const SectorIcon = SECTOR_ICONS[stock.sector] ?? Globe;
  const currencySymbol = market.currency === "USD" ? "$" : market.currency === "TWD" ? "NT$" : market.currency === "HKD" ? "HK$" : "¥";

  return (
    <motion.button
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative text-left rounded-xl p-3.5 backdrop-blur-sm overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      aria-label={`${stock.shortCode} ${stock.name}, ${stock.decision.signal}, ${stock.decision.score}`}
    >
      {/* signal accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${sigStyle.fg}, transparent)` }} />

      {/* Flash overlay when price changes */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${sigStyle.fg}26 0%, transparent 60%)`,
              boxShadow: `inset 0 0 0 1px ${sigStyle.fg}88`,
            }}
          />
        )}
      </AnimatePresence>

      {/* header: flag + code + sector icon + signal */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[16px] leading-none flex-shrink-0">{market.flag}</span>
          <span className="text-[16px] font-mono truncate" style={{ color: "#f7f8f8", fontWeight: 590, letterSpacing: "-0.2px" }}>
            {stock.shortCode}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="grid h-5 w-5 place-items-center rounded"
            style={{ background: "rgba(255,255,255,0.04)" }}
            aria-hidden
          >
            <SectorIcon className="h-3 w-3" />
          </span>
          <SignalPill signal={stock.decision.signal} />
        </div>
      </div>

      {/* name */}
      <div className="text-[11px] text-[#8a8f98] mt-1 truncate">{stock.name}</div>

      {/* price + change */}
      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className="text-[18px] tabular-nums"
          style={{ fontWeight: 510, color: "#f7f8f8", letterSpacing: "-0.4px", fontFeatureSettings: '"tnum"' }}
        >
          {currencySymbol}{quote ? quote.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
        </span>
        <span className="text-[11px] tabular-nums inline-flex items-center font-mono" style={{ color: positive ? BULL : BEAR }}>
          {quote ? <>{positive ? "+" : ""}{quote.changePercent.toFixed(2)}%</> : "—"}
        </span>
      </div>

      {/* SPARKLINE — bottom 35% visual anchor */}
      <div className="mt-2.5 -mx-1.5">
        <Sparkline
          data={stock.spark30d ?? [1, 1]}
          width={200}
          height={42}
          delay={delay + 0.3}
          color={positive ? BULL : BEAR}
        />
      </div>

      {/* score progress (very thin) */}
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stock.decision.score}%` }}
            transition={{ duration: 1.0, delay: delay + 0.4, ease: "easeOut" }}
            className="h-full"
            style={{ background: sigStyle.fg }}
          />
        </div>
        <span className="text-[10px] font-mono tabular-nums" style={{ color: sigStyle.fg, fontWeight: 590 }}>
          {stock.decision.score}
        </span>
      </div>
    </motion.button>
  );
}

function SignalPill({ signal }: { signal: Signal }) {
  const s = SIGNAL_COLORS[signal];
  return (
    <span
      title={s.tooltip}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider cursor-help"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.bd}`, fontWeight: 590 }}
    >
      <SignalIcon s={signal} className="h-2 w-2" />
      {s.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// Detail Dialog
// ═══════════════════════════════════════════════════════
function StockDetailDialog({
  stock, quote, onClose,
}: { stock: Stock; quote: LiveQuote | undefined; onClose: () => void }) {
  const sigStyle = SIGNAL_COLORS[stock.decision.signal];
  const positive = (quote?.changePercent ?? 0) >= 0;
  const market = MARKETS[stock.market];
  const SectorIcon = SECTOR_ICONS[stock.sector] ?? Globe;
  const [aiResult, setAiResult] = useState<{
    signal: Signal; score: number; rationale: string; risks: string[]; checklist: string[]; source: string;
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `stock-dialog-title-${stock.shortCode}`;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); previousFocus?.focus(); };
  }, [onClose]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: stock.symbol, strategy: "consensus", lookbackDays: 30 }),
      });
      const j = await r.json();
      if (j.ok) setAiResult({ ...j.result, source: j.source });
    } finally { setAnalyzing(false); }
  }

  const display = aiResult ?? {
    signal: stock.decision.signal,
    score: stock.decision.score,
    rationale: stock.decision.rationale,
    risks: stock.decision.risks,
    checklist: stock.decision.catalysts,
    source: "static",
  };

  const currencySymbol = market.currency === "USD" ? "$" : market.currency === "TWD" ? "NT$" : market.currency === "HKD" ? "HK$" : "¥";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 360 }}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #0f1213 0%, #08090a 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          color: "#f7f8f8",
        }}
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-[#6FC298]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          aria-label="關閉詳情"
        >
          ×
        </button>

        {/* Hero: flag + code + sector + sparkline */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[24px]">{market.flag}</span>
            <span id={titleId} className="text-[24px] font-mono" style={{ fontWeight: 590, letterSpacing: "-0.5px" }}>
              {stock.shortCode}
            </span>
            <span className="text-[14px] text-[#a8a8b3]">{stock.name}</span>
            <SignalPill signal={display.signal} />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
            <SectorIcon className="h-3 w-3" />
            <span>{stock.sector}</span>
            <span>·</span>
            <span>{market.exchange}</span>
            <span>·</span>
            <span>{market.tradingHoursLocal}</span>
          </div>
          <div className="mt-3">
            <Sparkline
              data={stock.spark30d ?? [1, 1]}
              width={420} height={70}
              strokeWidth={2}
              color={positive ? BULL : BEAR}
            />
          </div>
        </div>

        {/* Price */}
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-1.5">即時報價</div>
          <div className="flex items-baseline gap-3">
            <span className="text-[32px] tabular-nums" style={{ fontWeight: 510, letterSpacing: "-0.7px" }}>
              {currencySymbol}{quote ? quote.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
            </span>
            {quote && (
              <span className="inline-flex items-center gap-1 text-[14px] tabular-nums font-mono" style={{ color: positive ? BULL : BEAR }}>
                {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {positive ? "+" : ""}{quote.changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        {/* AI Decision */}
        <div className="px-6 py-5 border-t border-white/[0.06]" style={{ background: sigStyle.bg }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: sigStyle.fg }}>
              AI 共識決策
            </div>
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider disabled:opacity-50"
              style={{ color: MINT_BRIGHT }}
            >
              <RefreshCw className={`h-3 w-3 ${analyzing ? "animate-spin" : ""}`} />
              {analyzing ? "推論中" : "重新分析"}
            </button>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[28px] font-mono" style={{ color: sigStyle.fg, fontWeight: 590 }}>
              {SIGNAL_COLORS[display.signal].label}
            </span>
            <span className="text-[18px] tabular-nums" style={{ fontWeight: 510 }}>
              {display.score}<span className="text-[12px] text-[#62666d]">/100</span>
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-[1.55] text-[#d0d6e0]">{display.rationale}</p>
          <div className="mt-2 text-[10px] font-mono text-[#62666d]">來源：{display.source}</div>
        </div>

        {/* Risks */}
        <div className="px-6 py-5 border-t border-white/[0.06]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-2">⚠️ 風險檢核</div>
          <ul className="space-y-1.5">
            {display.risks.map((r, i) => (
              <li key={i} className="text-[13px] text-[#d0d6e0] flex gap-2">
                <span style={{ color: BEAR }}>·</span><span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Checklist */}
        <div className="px-6 py-5 border-t border-white/[0.06]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-2">✓ 行動清單</div>
          <ul className="space-y-1.5">
            {display.checklist.map((c, i) => (
              <li key={i} className="text-[13px] text-[#d0d6e0] flex gap-2">
                <span style={{ color: MINT_BRIGHT }}>→</span><span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* footer */}
        <div className="px-6 py-5 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <Link
              href={buildStockUrl(stock)}
              onClick={onClose}
              className="flex-1 text-center inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-[12px]"
              style={{ background: `${MINT}1a`, color: MINT_BRIGHT, border: `1px solid ${MINT}40` }}
            >
              查看完整頁面 →
            </Link>
            <a
              href="https://github.com/GKS711/_quant-terminal"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-[12px]"
              style={{ background: "rgba(255,255,255,0.03)", color: "#a8a8b3", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <Github className="h-3.5 w-3.5" /> source
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// Background grid
// ═══════════════════════════════════════════════════════
function BgGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px)," +
          "linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 90% 70% at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 70% at center, black 30%, transparent 80%)",
      }}
    />
  );
}
