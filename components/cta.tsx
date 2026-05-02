import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Cta() {
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-mint-600/30 via-ink-800 to-ink-900 px-8 md:px-14 py-14 md:py-20">
          <div
            className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-mint-400/20 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] tracking-tightest text-ink-50 font-light">
              你財務生活中，<span className="italic text-mint-300">最從容的五分鐘。</span>
            </h2>
            <p className="mt-5 text-[17px] text-ink-200/90 max-w-xl">
              加入 8,200+ 用 每日股市儀表板 把台股這件事想清楚的投資人。免費開始。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">
                建立我的帳號 <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                聯繫業務團隊
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
