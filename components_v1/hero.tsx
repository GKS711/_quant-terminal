import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PortfolioCard } from "./portfolio-card";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="absolute inset-0 bg-fine-grid pointer-events-none" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[1100px] rounded-full bg-mint-400/[0.10] blur-[140px] pointer-events-none"
        aria-hidden
      />

      <div className="container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <Badge>
              <span className="h-1.5 w-1.5 rounded-full bg-mint-400 animate-pulse-soft" />
              全新 · AI 顧問 2.0 ｜ 原生支援台股
            </Badge>

            <h1 className="mt-6 font-display text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-tightest text-ink-50 font-light">
              用清晰的眼光<span className="italic font-normal text-mint-300">投資台股。</span>
              <br />
              用從容的步調<span className="relative inline-block">
                <span className="relative z-10">致富。</span>
                <span
                  className="absolute -bottom-1 left-0 h-2.5 w-full bg-mint-400/30 -skew-y-1 rounded-sm"
                  aria-hidden
                />
              </span>
            </h1>

            <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-ink-300">
              每日股市儀表板 把你的台股組合、即時報價，與一位 AI 投資副駕，整合到同一個沉穩、高質感的儀表板——專為長線存股族與被動收入規劃者而設計。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg">
                免費開始 <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                看實機 Demo
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                證期局合規架構
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                銀行級加密
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                8,200+ 早期用戶
              </span>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <PortfolioCard />
          </div>
        </div>
      </div>
    </section>
  );
}
