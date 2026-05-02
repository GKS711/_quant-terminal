"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { MARKETS, type Stock } from "@/lib/portfolio";
import { Sparkline } from "./sparkline";
import { buildStockUrl } from "@/lib/stock-routes";

const BULL = "#10b981";
const BEAR = "#E5484D";

const SIG_LABEL = { buy: "BUY", hold: "HOLD", sell: "SELL" } as const;
const sigColor = (s: "buy" | "hold" | "sell") =>
  s === "buy" ? BULL : s === "sell" ? BEAR : "#a8a8a8";

/**
 * Related Stocks — 該檔股票的關聯候選清單
 */
export function RelatedStocks({ stocks }: { stocks: Stock[] }) {
  if (stocks.length === 0) {
    return <div className="text-[12px] text-[#62666d]">沒有相關標的。</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stocks.map((stock, i) => {
        const market = MARKETS[stock.market];
        const Icon =
          stock.decision.signal === "buy"  ? TrendingUp :
          stock.decision.signal === "sell" ? TrendingDown : Minus;
        const positive = stock.spark30d
          ? stock.spark30d[stock.spark30d.length - 1] >= stock.spark30d[0]
          : stock.decision.signal === "buy";

        return (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <Link
              href={buildStockUrl(stock)}
              className="group block rounded-xl p-4 transition-transform hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 16px 40px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px]">{market.flag}</span>
                  <span className="text-[14px] font-mono" style={{ color: "#f7f8f8", fontWeight: 590 }}>
                    {stock.shortCode}
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-mono uppercase"
                  style={{
                    background: `${sigColor(stock.decision.signal)}1a`,
                    color: sigColor(stock.decision.signal),
                    border: `1px solid ${sigColor(stock.decision.signal)}40`,
                    fontWeight: 590,
                  }}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {SIG_LABEL[stock.decision.signal]}
                </span>
              </div>
              <div className="text-[10px] text-[#8a8f98] mt-0.5 truncate">{stock.name}</div>
              <div className="mt-2 -mx-1">
                <Sparkline
                  data={stock.spark30d ?? [1, 1]}
                  width={180}
                  height={28}
                  delay={0.2}
                  showLastDot={false}
                  color={positive ? BULL : BEAR}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#62666d]">{stock.sector}</span>
                <span
                  className="inline-flex items-center gap-0.5 group-hover:gap-1 transition-all"
                  style={{ color: "#a8a8b3" }}
                >
                  詳情 <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
