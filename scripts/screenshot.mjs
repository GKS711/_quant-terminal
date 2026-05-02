#!/usr/bin/env node
/**
 * 自動截圖整站關鍵頁面 → docs/screenshots/
 *
 * 用法：
 *   1. dev server 在跑 (http://localhost:3000)
 *   2. node scripts/screenshot.mjs
 */

import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "docs", "screenshots");
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";

const SHOTS = [
  // (filename, url, scrollY, viewport, height-clip-px, comment)
  { f: "01-hero.png",            url: "/", scroll: 0,    height: 900,  desc: "首頁 Hero — Apple 風 spotlight" },
  { f: "02-decision-terminal.png", url: "/", scroll: 1000, height: 1200, desc: "12 卡多市場矩陣" },
  { f: "03-visual-report.png",   url: "/", scroll: 3100, height: 900,  desc: "Visual Report 4 卡片" },
  { f: "04-news-feed.png",       url: "/", scroll: 4100, height: 800,  desc: "新聞 + 情緒分數" },
  { f: "05-strategy-heatmap.png", url: "/", scroll: 5100, height: 900,  desc: "11 策略 × 12 股 heatmap" },
  { f: "06-backtest.png",        url: "/", scroll: 6100, height: 900,  desc: "12 個月回測" },
  { f: "07-how-it-works.png",    url: "/", scroll: 7100, height: 800,  desc: "How It Works 5 階段" },
  { f: "08-ai-demo.png",         url: "/", scroll: 7900, height: 900,  desc: "AI 顧問 chat" },
  { f: "09-tech-stack.png",      url: "/", scroll: 8900, height: 800,  desc: "技術棧 6 卡" },
  { f: "10-stock-detail-nvda.png", url: "/us/nvda", scroll: 0, height: 1400, desc: "NVDA 個股詳情頁" },
  { f: "11-stock-detail-2330.png", url: "/tw/2330", scroll: 0, height: 1400, desc: "2330 台積電詳情頁" },
  { f: "12-markets-page.png",    url: "/markets", scroll: 0, height: 1200, desc: "標的池 50 檔擴充" },
];

(async () => {
  console.log("🎬 Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: shot.height, deviceScaleFactor: 2 });
    console.log(`  📸 ${shot.f} (${shot.url}, scroll ${shot.scroll}, ${shot.desc})`);
    await page.goto(BASE + shot.url, { waitUntil: "networkidle0", timeout: 30000 });
    if (shot.scroll > 0) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), shot.scroll);
      await new Promise((r) => setTimeout(r, 1500)); // wait animations
    } else {
      await new Promise((r) => setTimeout(r, 1500)); // wait sparkline draw etc.
    }
    await page.screenshot({
      path: join(OUT, shot.f),
      fullPage: false,
    });
    await page.close();
  }

  await browser.close();
  console.log(`✅ Done — ${SHOTS.length} screenshots saved to ${OUT}`);
})().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
