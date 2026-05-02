#!/usr/bin/env node
/**
 * 補拍 v5 PPT 缺的精準特寫截圖
 *   - AI chat panel 特寫（trigger 真實串流再截）
 *   - NVDA 詳情頁 hero 特寫（價格 + sparkline + AI rationale）
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

(async () => {
  console.log("🎬 Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // ─── 1. AI Demo 特寫 — trigger 真實串流再截 ─────
  {
    console.log("  📸 Re-capturing AI demo with active streaming...");
    const page = await browser.newPage();
    // 大 viewport 一定要塞得下整個 chat panel
    await page.setViewport({ width: 1440, height: 1600, deviceScaleFactor: 2 });
    // 用 hash 直接讓瀏覽器跳到 advisor section
    await page.goto(BASE + "/#advisor", { waitUntil: "networkidle0", timeout: 30000 });

    // 確保 scroll 到底部位置
    await page.evaluate(() => {
      const el = document.querySelector("#advisor");
      el?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Debug: check scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log("    [debug] scrollY after scroll:", scrollY);

    // Click first suggestion to trigger streaming
    await page.evaluate(() => {
      const advisor = document.querySelector("#advisor");
      const sugs = advisor?.querySelectorAll("button:not([type='submit'])");
      // Skip nav buttons; first chat suggestion is in chat panel
      for (const b of sugs ?? []) {
        if (b.textContent?.includes("2330") || b.textContent?.includes("AI 伺服器") || b.textContent?.includes("MACD")) {
          b.click(); return;
        }
      }
    });

    // Wait for streaming output (Gemma 4 thinking model 需要時間)
    // Poll until chat panel has assistant text content (>120 chars beyond greeting)
    const maxWaitMs = 60000;
    const pollStart = Date.now();
    let lastLen = 0;
    while (Date.now() - pollStart < maxWaitMs) {
      const len = await page.evaluate(() => {
        const panel = document.querySelector(".thin-scroll");
        if (!panel) return 0;
        // Heuristic: any text node beyond the initial greeting "_quant-terminal" line
        return panel.innerText.length;
      });
      if (len > 220 && len === lastLen) break; // text stopped growing → stream done
      lastLen = len;
      await new Promise((r) => setTimeout(r, 2500));
    }
    console.log("    [debug] final panel text length:", lastLen);

    // Find chat panel — has thin-scroll class
    const panelBounds = await page.evaluate(() => {
      const panel = document.querySelector(".thin-scroll");
      if (!panel) return null;
      // Get the chat panel container (parent up to rounded-2xl)
      let container = panel;
      while (container && !container.className?.includes("rounded-2xl")) {
        container = container.parentElement;
      }
      if (!container) return null;
      // Scroll the chat container so latest content visible
      panel.scrollTop = panel.scrollHeight;
      const r = container.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    await new Promise((r) => setTimeout(r, 800));

    console.log("    [debug] panelBounds:", JSON.stringify(panelBounds));
    // ElementHandle.screenshot() 能精準抓單一元素，不需要 clip 計算
    const panelHandle = await page.evaluateHandle(() => {
      const panel = document.querySelector(".thin-scroll");
      if (!panel) return null;
      let container = panel;
      while (container && !container.className?.includes?.("rounded-2xl")) {
        container = container.parentElement;
      }
      return container;
    });
    if (panelHandle) {
      const elem = panelHandle.asElement();
      if (elem) {
        await elem.screenshot({
          path: join(OUT, "08b-ai-demo-streaming.png"),
        });
        console.log("    ✅ 08b-ai-demo-streaming.png (ElementHandle 精準抓 chat panel)");
      } else {
        console.log("    ❌ panelHandle not an element");
      }
    }
    await page.close();
  }

  // ─── 2. NVDA hero crop — 只要 price + sparkline + AI rationale ─────
  {
    console.log("  📸 NVDA detail hero crop...");
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(BASE + "/us/nvda", { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Crop to top portion of stock detail (header + price + sparkline)
    await page.screenshot({
      path: join(OUT, "10b-nvda-hero.png"),
      clip: { x: 0, y: 80, width: 1440, height: 600 },
    });
    console.log("    ✅ 10b-nvda-hero.png");
    await page.close();
  }

  await browser.close();
  console.log("✅ Done");
})().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
