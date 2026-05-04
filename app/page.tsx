import { Nav } from "@/components/nav";
import { MarketPulse } from "@/components/market-pulse";
import { Footer } from "@/components/footer";

/**
 * v2.0 — 從 0 重做
 *
 * 設計取向：大膽當代（深藍 + 金 + 桃紅）/ Webull / Toss / 韓系證券 app 風
 * 願景：retail 投資人不用看盤，打開就知道今天該不該動
 *
 * 本檔目前只有 Hero (Market Pulse)，下一階段會加：
 *   - sector-scanner (100 檔 grid)
 *   - watchlist (localStorage)
 *   - news-pulse (20-50 條)
 *   - ai-advisor (Gemma 4 streaming)
 *   - data-provenance footer
 */
export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: "#0B1426" }}>
      <Nav />
      <main>
        <MarketPulse />

        {/* Coming Soon stub — 之後 phases 會填 */}
        <section
          className="py-16"
          style={{
            background: "#070D1A",
            borderTop: "1px solid rgba(245,166,35,0.08)",
            borderBottom: "1px solid rgba(245,166,35,0.08)",
          }}
        >
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
            <div
              className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3"
              style={{ color: "#F5A623" }}
            >
              v2 building in progress
            </div>
            <h2
              className="text-[28px] sm:text-[36px] tracking-[-0.03em]"
              style={{ color: "#F4F6FA", fontWeight: 510 }}
            >
              下一階段：100 檔 Sector Scanner · Watchlist · News Pulse · AI 顧問
            </h2>
            <p className="mt-3 text-[14px]" style={{ color: "#A9B3C4" }}>
              已完成（v2 第 1 階段）：Market Pulse Hero · 大膽當代配色 · 多源資料抽象
              <br />
              開發中：100 檔即時 grid · 個人 watchlist (localStorage) · 20-50 條多源新聞 · Gemma 4 31B 顧問 chat
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
