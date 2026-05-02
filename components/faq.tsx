"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    q: "本站哪些是即時、哪些是 demo？",
    a: "**即時**：股價（Yahoo Finance v2，30s cache，限流時切 mock）、AI 顧問 chat（真打 Gemma 4 31B 串流）、AI 決策 API（真打 Gemma 4 回 strict JSON）。**Demo**：12 檔的 AI 決策卡內容（rationale / risks / catalysts）、回測 12 月數據、6 條新聞、11 策略 × 12 股 heatmap 訊號、sample 日報——這些都標 DEMO chip。底層 _quant-terminal Python 系統用的是真實多源資料 + 每日自動執行。",
  },
  {
    q: "12 檔股票是怎麼選的？",
    a: "TW × 4（2330、2454、2317、0050）+ US × 4（AAPL、NVDA、TSLA、MSFT）+ HK × 2（騰訊、阿里）+ CN × 2（茅台、五糧液），覆蓋四大市場。",
  },
  {
    q: "11 種策略是哪 11 種？",
    a: "技術 7 種：均線、RSI、MACD、艾略特波浪、籌碼分布、布林通道、VWAP 回歸；基本/風險 4 種：新聞情緒、類股輪動、風險疊加、多策略共識。",
  },
  {
    q: "報價是真的嗎？",
    a: "/api/quotes 用 yahoo-finance2 即時抓 4 市場 12 檔，每 60 秒更新。Yahoo 限流時自動切 mock fallback（前端 status bar 顯示 mock）。",
  },
  {
    q: "/api/analyze 怎麼穩定回 JSON？",
    a: "三層保護：responseMimeType=application/json + 嚴格 system prompt + zod schema 驗證；失敗時 brace-counter 從文字抓第一個完整 JSON。",
  },
  {
    q: "後端是什麼？",
    a: "github.com/GKS711/_quant-terminal — Python / FastAPI / Litellm / 8+ 資料源 / GitHub Actions 每日 09:00 自動執行。",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section-y border-t border-white/[0.06]">
      <div className="container-x grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <div>
          <h2 className="font-display text-[32px] md:text-[40px] leading-[1.05] tracking-tightest text-ink-50 font-light">
            常見<span className="italic text-mint-300">問答。</span>
          </h2>
          <p className="mt-3 text-ink-300 text-[14px]">
            5 個關鍵問題 · 工程細節
          </p>
        </div>

        <ul className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full py-5 flex items-center justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] text-ink-50">{it.q}</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-ink-300 shrink-0">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-[15px] leading-relaxed text-ink-300 max-w-2xl">{it.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
