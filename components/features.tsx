import {
  Sparkles, ShieldCheck, LineChart, Bell, Wallet, Globe2,
} from "lucide-react";
import { Badge } from "./ui/badge";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI 洞察，講人話",
    body: "副駕用直白的繁體中文摘要持倉、提醒類股集中度風險、回答你對台股組合的任何疑問——零術語、零行話。",
  },
  {
    icon: LineChart,
    title: "所有帳戶，一覽無遺",
    body: "證券、定期定額、ETF、加密、現金，每日股市儀表板 全部統合成單一資產組合，並計算配置漂移與任意區間的績效。",
  },
  {
    icon: Bell,
    title: "只通知，真正重要的事",
    body: "再平衡門檻達到、配息入帳、手續費異常才會推播。沒有每日刷屏的雜訊。",
  },
  {
    icon: ShieldCheck,
    title: "唯讀連線、端到端加密",
    body: "透過受信任的資料聚合器以唯讀方式連線券商，密碼從不經過我們的伺服器，匯出資料一鍵搞定。",
  },
  {
    icon: Wallet,
    title: "稅務感知的資產規劃",
    body: "視覺化呈現股利所得稅、二代健保補充保費門檻、可實現損益機會，並自動跨帳戶對帳。",
  },
  {
    icon: Globe2,
    title: "多市場、多幣別",
    body: "台股、美股、加密貨幣、海外 ETF 通通能追，台幣、美元、日圓即時換算。為跨市場的投資人而生。",
  },
];

export function Features() {
  return (
    <section id="features" className="section-y">
      <div className="container-x">
        <div className="max-w-2xl">
          <Badge tone="neutral">產品功能</Badge>
          <h2 className="mt-4 font-display text-[36px] md:text-[48px] leading-[1.05] tracking-tightest text-ink-50 font-light">
            一個<span className="italic text-mint-300">尊重你時間</span>的財富平台。
          </h2>
          <p className="mt-4 text-ink-300 text-[17px] leading-relaxed">
            六個支柱，把每天投資從「看 PTT、滑 Dcard、開三個券商 App」的雜事，變成「五分鐘搞定的清晨儀式」。
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="group bg-ink-900 p-7 hover:bg-ink-800/60 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint-400/10 text-mint-300 ring-1 ring-mint-400/20 group-hover:bg-mint-400/15 transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-[18px] font-medium tracking-tight text-ink-50">
                {title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-300">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
