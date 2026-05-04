import { Nav } from "@/components/nav";
import { HeroFullBleed } from "@/components/hero-fullbleed";
import { TileGrid } from "@/components/tile-grid";
import { Footer } from "@/components/footer";

/**
 * v3.0 — Apple-style image-first redesign
 *
 * 設計原則：圖片 > 文字
 *   - 第一屏：full-bleed AI 生成大圖 + 1 句標題 + 2 個 pill button
 *   - 往下滑：6-tile 2x3 grid（每 tile 大圖 + 1 行 tagline + 1 button）
 *   - 詳細資訊只在 tile 點擊後才出現（drill-down）
 *
 * 配色：撞色彩繪 — 白底 + 飽和色塊（橘 #FF6E40 / 藍 #0066FF / 桃紅 #E91E63 / 黃 #FFC700 / 綠 #00C896 / 紫 #9B59B6）
 */
export default function Page() {
  return (
    <div style={{ background: "#FFFFFF" }}>
      <Nav />
      <main>
        <HeroFullBleed />
        <TileGrid />
      </main>
      <Footer />
    </div>
  );
}
