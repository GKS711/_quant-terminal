import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter 入門",
    price: "免費",
    sub: "感受 每日股市儀表板，永久免費。",
    features: [
      "1 個資產組合，最多 25 檔台股 / ETF",
      "AI 顧問每月 20 則訊息",
      "每日台股報價更新",
      "週一電子郵件總結",
    ],
    cta: "免費開始",
    highlight: false,
  },
  {
    name: "Plus 進階",
    price: "NT$249",
    suffix: "／月",
    sub: "為認真的個人投資人而生。",
    features: [
      "無限資產組合與持倉",
      "AI 顧問無限對話",
      "台股 / 美股即時報價，多幣別",
      "除權息與買回庫藏股提醒",
      "iOS / Android / Web 全平台",
    ],
    cta: "免費試用 14 天",
    highlight: true,
  },
  {
    name: "Family 家庭",
    price: "NT$499",
    suffix: "／月",
    sub: "全家一起規劃，看得清楚。",
    features: [
      "包含 Plus 全部功能",
      "最多 5 位成員，共同目標",
      "家庭淨資產儀表板",
      "優先真人客服",
    ],
    cta: "選擇 Family",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-y border-t border-white/[0.06]">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto">
          <Badge tone="neutral">定價方案</Badge>
          <h2 className="mt-4 font-display text-[36px] md:text-[48px] leading-[1.05] tracking-tightest text-ink-50 font-light">
            誠實定價。<span className="italic text-mint-300">沒有但書。</span>
          </h2>
          <p className="mt-4 text-ink-300 text-[17px]">
            隨時可取消。年繳省 20%。我們對你的承諾很簡單：絕不販售你的資料。
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={cn(
                "relative rounded-2xl p-7 border transition-colors",
                t.highlight
                  ? "border-mint-400/40 bg-gradient-to-b from-mint-400/[0.06] to-transparent shadow-card-hover"
                  : "border-white/[0.06] bg-ink-800/40 hover:border-white/[0.12]",
              )}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-mint-400 text-ink-900 text-[11px] font-medium px-2.5 py-1">
                  最受歡迎
                </span>
              )}
              <h3 className="text-[15px] text-ink-50">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-[44px] tracking-tighter text-ink-50 font-light">{t.price}</span>
                {t.suffix && <span className="text-ink-400 text-sm">{t.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-ink-300">{t.sub}</p>

              <Button
                variant={t.highlight ? "primary" : "outline"}
                size="md"
                className="mt-6 w-full"
              >
                {t.cta}
              </Button>

              <ul className="mt-7 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[14px] text-ink-200">
                    <Check className="h-4 w-4 mt-0.5 text-mint-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
