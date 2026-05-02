import { Nav } from "@/components/nav";
import { HeroPitch } from "@/components/hero-pitch";
import { DecisionTerminal } from "@/components/decision-terminal";
import { LivePulse } from "@/components/live-pulse";
import { VisualReport } from "@/components/visual-report";
import { StrategyHeatmap } from "@/components/strategy-heatmap";
import { BacktestChart } from "@/components/backtest-chart";
import { AiDemo } from "@/components/ai-demo";
import { TechStack } from "@/components/tech-stack";
import { HowItWorks } from "@/components/how-it-works";
import { NewsFeed } from "@/components/news-feed";
import { GithubCta } from "@/components/github-cta";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        {/* 1. HERO — Apple 風 minimal landing：單一 spotlight 卡片 + 動畫 + scroll 引導 */}
        <HeroPitch />

        {/* ── Scroll 後才顯露 ── */}

        {/* 2. Decision Terminal — 12 卡完整資料層 */}
        <section id="decision"><DecisionTerminal /></section>

        {/* 3. 即時報價跑馬燈 */}
        <LivePulse />

        {/* 4. 視覺化每日報告 4 卡 */}
        <VisualReport />

        {/* 5. 即時新聞 feed */}
        <NewsFeed />

        {/* 6. 策略 × 股票 heatmap */}
        <section id="strategy"><StrategyHeatmap /></section>

        {/* 7. 12 個月回測 */}
        <section id="backtest"><BacktestChart /></section>

        {/* 8. How It Works 系統流程 */}
        <HowItWorks />

        {/* 9. AI Demo */}
        <AiDemo />

        {/* 10. 技術棧 */}
        <section id="tech"><TechStack /></section>

        {/* 11. GitHub CTA */}
        <GithubCta />

        {/* 12. FAQ */}
        <Faq />
      </main>
      <Footer />
    </>
  );
}
