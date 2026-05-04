/**
 * Data Provenance — 資料源透明面板
 *
 * 解決 user 批評：「數據哪裡來的？」
 * 設計原則：誠實標註技術展示，把每個數字的來源、計算方式、最後更新時間攤在陽光下
 */

"use client";

import { Database, Cpu, GitBranch, Clock } from "lucide-react";
import { SNAPSHOT } from "@/lib/cached";
import { EXTENDED_TOTAL } from "@/lib/extended-universe";

const MINT_BRIGHT = "#6FC298";

export function DataProvenance() {
  const refreshedAt = SNAPSHOT.refreshedAt
    ? new Date(SNAPSHOT.refreshedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    : "未知";

  const sources = [
    {
      icon: Database,
      label: "報價 / OHLC / 30 天日線",
      value: "Yahoo Finance v8 chart API",
      detail: "https://query2.finance.yahoo.com/v8/finance/chart/ · curl shell-out + UA spoof",
      ok: true,
    },
    {
      icon: Cpu,
      label: "AI 決策（rationale / risks / catalysts）",
      value: "Google Gemma 4 31B-it",
      detail: "free tier · zod schema 嚴格驗證 · brace-counter 救 broken JSON",
      ok: true,
    },
    {
      icon: GitBranch,
      label: "11 種策略訊號計算",
      value: "lib/indicators.ts 純函式（MA/RSI/MACD/Bollinger/VWAP...）",
      detail: "從 OHLC 真實計算 · Author: GKS · 公開 ruleset，可單元測試",
      ok: true,
    },
    {
      icon: Clock,
      label: "snapshot.json 最後更新",
      value: refreshedAt,
      detail: `${SNAPSHOT.stocks ? Object.keys(SNAPSHOT.stocks).length : 0} 檔精選 + ${EXTENDED_TOTAL - 12} 檔擴充宇宙`,
      ok: true,
    },
  ];

  return (
    <section
      id="provenance"
      className="border-t border-white/[0.06] py-12"
      style={{ background: "#08090a" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
          <Database className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
          <span>Data Provenance · 資料源透明</span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] tracking-widest"
            style={{
              background: "rgba(78,170,133,0.10)",
              color: MINT_BRIGHT,
              border: "1px solid rgba(78,170,133,0.30)",
              fontWeight: 590,
            }}
          >
            ALL OPEN SOURCE
          </span>
        </div>
        <h2
          className="text-[24px] sm:text-[32px] tracking-[-0.03em] text-white mb-2"
          style={{ fontWeight: 510 }}
        >
          每個數字{" "}
          <span style={{ color: MINT_BRIGHT }} className="italic font-normal">
            從哪來
          </span>
        </h2>
        <p className="text-[13px] text-[#a8a8b3] mb-8 max-w-[680px]">
          這個儀表板展示一套量化分析方法論。所有資料源、計算公式、AI 模型都公開，沒有黑盒。
          <br />
          <span className="text-[11px] text-[#62666d]">
            ⚠ 本作品為 portfolio 技術展示，非投資建議。投資決策請自行判斷。
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" style={{ color: MINT_BRIGHT }} />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#a8a8b3]">
                    {s.label}
                  </span>
                </div>
                <div className="text-[14px] text-[#f7f8f8] font-mono mb-1" style={{ fontWeight: 590 }}>
                  {s.value}
                </div>
                <div className="text-[11px] text-[#62666d] leading-relaxed">{s.detail}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-[11px] text-[#62666d] font-mono">
          想看完整資料 pipeline？{" "}
          <a
            href="https://github.com/GKS711/_quant-terminal/blob/main/scripts/refresh-data.mjs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: MINT_BRIGHT }}
            className="hover:underline"
          >
            scripts/refresh-data.mjs
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/GKS711/_quant-terminal/blob/main/lib/indicators.ts"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: MINT_BRIGHT }}
            className="hover:underline"
          >
            lib/indicators.ts
          </a>
        </div>
      </div>
    </section>
  );
}
