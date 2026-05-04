import { Nav } from "@/components/nav";
import { MarketPulse } from "@/components/market-pulse";
import { Watchlist } from "@/components/watchlist";
import { SectorScanner } from "@/components/sector-scanner";
import { NewsPulse } from "@/components/news-pulse";
import { Footer } from "@/components/footer";

/**
 * v2.0 — 從 0 重做
 *
 * 設計取向：大膽當代（深藍 + 金 + 桃紅）/ Webull / Toss / 韓系證券 app 風
 * 願景：retail 投資人不用看盤，打開就知道今天該不該動
 *
 * 5 個 sections：
 *   1. Market Pulse Hero — AI Morning Brief + 5 國 + Top Opps/Risks
 *   2. Watchlist — localStorage 個人清單，可即時刷新
 *   3. Sector Scanner — 100 檔全市場雷達（5 國 / sector / search / 排序）
 *   4. News Pulse — Yahoo 24h 新聞流 + 情緒分數
 *   5. Footer — Source / Stack
 */
export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: "#0B1426" }}>
      <Nav />
      <main>
        <MarketPulse />
        <Watchlist />
        <SectorScanner />
        <NewsPulse />
      </main>
      <Footer />
    </div>
  );
}
