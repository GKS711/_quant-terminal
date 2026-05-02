#!/usr/bin/env node
/**
 * Build 每日股市儀表板 簡報 v5 .pptx — 三方合議定案
 *
 *   Visual Storyteller: typography first, slide 4 wow climax (01-hero full bleed)
 *   Brand Guardian:    mint 預算 1/slide max, tech table 不 manifesto
 *   Codex (recruiter): hybrid 6+3+1 (3 product proof, 6 typo, 1 closing)
 *
 * 策略：
 *   - 全暗（品牌一致），文字 hero 大量留白
 *   - 1, 2, 3, 6, 8, 9 = 純 typography / diagram
 *   - 4, 5, 7 = product proof（不過 7 主要還是 diagram + small UI overlay）
 *   - 10 = closing
 *   - mint 預算：每 slide 最多 1 處
 */

import pptxgen from "pptxgenjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHOTS = join(ROOT, "docs", "screenshots");
const ASSETS = join(ROOT, "docs", "pptx-assets");
const OUT_PPTX = join(ROOT, "docs", "每日股市儀表板_簡報.pptx");

const C = {
  bg:        "0A0A0A",
  bgPanel:   "141414",
  bgCard:    "1C1C1C",
  text:      "F6F6F6",
  textDim:   "9A9A9A",
  textMore:  "62666D",
  textGhost: "2A2A2A",
  mint:      "4EAA85",
  mintLite:  "6FC298",
  mintDeep:  "3F8E6E",
  bull:      "10B981",
  bear:      "E5484D",
  warn:      "F59E0B",
  border:    "2A2A2A",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 × 5.625 inch
pres.author = "GKS";
pres.title = "每日股市儀表板";

// 字級節律（Brand Guardian 要求）
const FZ = { hero: 200, h1: 72, h2: 44, h3: 28, body: 18, small: 12, caption: 10, mono: 11 };

function addFooter(slide, pageNum, total = 10) {
  slide.addText("每日股市儀表板", {
    x: 0.4, y: 5.3, w: 3, h: 0.25,
    fontSize: 9, color: C.textMore, fontFace: "Helvetica Neue",
    charSpacing: 1, margin: 0,
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: 8.5, y: 5.3, w: 1.1, h: 0.25,
    fontSize: 9, color: C.textMore, fontFace: "Menlo",
    align: "right", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 1 — Cover (typography only, 大量留白)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // 中央 mint dot（minimal logo mark）
  s.addShape(pres.shapes.OVAL, {
    x: 4.92, y: 1.25, w: 0.16, h: 0.16,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  // 主標題（巨大）
  s.addText("每日股市儀表板", {
    x: 0.5, y: 2.1, w: 9, h: 1.2,
    fontSize: 84, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0,
    charSpacing: -3,
  });

  // italic 副標 — mint dim
  s.addText("全球多市場量化分析儀表板", {
    x: 0.5, y: 3.4, w: 9, h: 0.4,
    fontSize: 22, color: C.mintDeep, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  // 國旗一行
  s.addText("🇹🇼     🇺🇸     🇭🇰     🇨🇳", {
    x: 0.5, y: 4.0, w: 9, h: 0.5,
    fontSize: 22, align: "center", margin: 0,
  });

  // 結語（mono）
  s.addText("by GKS · 2026", {
    x: 0.5, y: 5.1, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore,
    align: "center", fontFace: "Menlo", charSpacing: 2, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 2 — Problem (hero number 8 + ghost clock bg)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // ghost clock 5% opacity 背景紋理（Visual Storyteller 建議）
  const clockBg = join(ASSETS, "slide2-problem.png");
  if (existsSync(clockBg)) {
    s.addImage({
      path: clockBg,
      x: 2.0, y: 1.0, w: 6, h: 3.6,
      sizing: { type: "cover", w: 6, h: 3.6 },
      transparency: 90, // 10% visible
    });
  }

  // eyebrow
  s.addText("THE PROBLEM", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  // hero 「8」 — warn 橘色
  s.addText("8", {
    x: 0, y: 1.3, w: 10, h: 3.0,
    fontSize: 280, bold: true, color: C.warn,
    align: "center", valign: "middle",
    fontFace: "Helvetica Neue", margin: 0,
  });

  // 「小時」小字
  s.addText("小時", {
    x: 0, y: 4.05, w: 10, h: 0.5,
    fontSize: 32, bold: true, color: C.warn,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  // 副標
  s.addText("手動讀完一份多市場分析報告", {
    x: 0.5, y: 4.55, w: 9, h: 0.35,
    fontSize: 16, color: C.textDim,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  // 3 個 mini stats
  s.addText("4 個市場  ·  11 種策略  ·  234 篇新聞", {
    x: 0.5, y: 4.95, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", charSpacing: 1, margin: 0,
  });

  addFooter(s, 2);
}

// ═══════════════════════════════════════════════════════
// Slide 3 — Solution (8h → 30s, 30s 5x bigger)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("THE SOLUTION", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  // 左：「8h」灰色小字
  s.addText("8h", {
    x: 0.5, y: 1.7, w: 2.5, h: 1.5,
    fontSize: 80, bold: true, color: C.textMore,
    align: "right", valign: "middle",
    fontFace: "Helvetica Neue", margin: 0,
  });
  s.addText("manual analysis", {
    x: 0.5, y: 3.1, w: 2.5, h: 0.3,
    fontSize: 10, color: C.textMore, italic: true,
    align: "right", fontFace: "Menlo", margin: 0,
  });

  // mint arrow（這頁唯一 mint）
  s.addText("→", {
    x: 3.2, y: 1.7, w: 0.6, h: 1.5,
    fontSize: 56, bold: true, color: C.mint,
    align: "center", valign: "middle",
    fontFace: "Helvetica Neue", margin: 0,
  });

  // 右：「30s」mint hero — 5x bigger
  s.addText("30s", {
    x: 4.0, y: 0.95, w: 5.5, h: 3.0,
    fontSize: 280, bold: true, color: C.text,
    align: "left", valign: "middle",
    fontFace: "Helvetica Neue", margin: 0, charSpacing: -8,
  });

  // 副標
  s.addText("real-time AI multi-market analysis", {
    x: 0.5, y: 4.4, w: 9, h: 0.35,
    fontSize: 16, color: C.textDim, italic: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  s.addText("12 stocks · 4 markets · Gemma 4 31B 即時推論", {
    x: 0.5, y: 4.85, w: 9, h: 0.35,
    fontSize: 13, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 3);
}

// ═══════════════════════════════════════════════════════
// Slide 4 — LIVE PRODUCT (01-hero.png FULL BLEED, wow climax)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // 截圖 full bleed（占 ~85% 螢幕）
  const heroPath = join(SHOTS, "01-hero.png");
  if (existsSync(heroPath)) {
    s.addImage({
      path: heroPath,
      x: 0, y: 0, w: 10, h: 5.625,
      sizing: { type: "cover", w: 10, h: 5.625 },
    });
  }

  // 半透明黑色 gradient overlay 在底部（讓文字浮上去）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.625, w: 10, h: 1.0,
    fill: { color: C.bg, transparency: 30 },
    line: { color: C.bg, width: 0 },
  });

  // 底部文字 overlay
  s.addText("LIVE", {
    x: 0.5, y: 4.85, w: 1.5, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("12 檔 · 4 市場 · Gemma 4 31B", {
    x: 0.5, y: 5.15, w: 9, h: 0.3,
    fontSize: 13, color: C.text, bold: true,
    fontFace: "PingFang TC", margin: 0,
  });

  // 右下角小字
  s.addText("4 / 10", {
    x: 8.5, y: 5.3, w: 1.1, h: 0.25,
    fontSize: 9, color: C.textDim, fontFace: "Menlo",
    align: "right", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 5 — Product Detail (AI advisor crop + real quote)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("AI ADVISOR · LIVE STREAMING", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  // 左：AI demo 特寫（精準裁好的 chat panel · ~1.03:1）
  const aiPath = join(SHOTS, "08b-ai-demo-streaming.png");
  const aiPathFallback = join(SHOTS, "08-ai-demo.png");
  const aiUsed = existsSync(aiPath) ? aiPath : aiPathFallback;
  if (existsSync(aiUsed)) {
    s.addImage({
      path: aiUsed,
      x: 0.4, y: 0.95, w: 4.2, h: 4.05,
      sizing: { type: "contain", w: 4.2, h: 4.05 },
    });
  }

  // 右：真實 quote（更寬版面，字級放大）
  s.addText("GEMMA 4 31B · 真打", {
    x: 5.0, y: 1.05, w: 4.7, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 3, margin: 0,
  });

  s.addText("「2330 收 NT$2,295", {
    x: 5.0, y: 1.55, w: 4.7, h: 0.5,
    fontSize: 22, color: C.text, bold: true,
    fontFace: "Menlo", margin: 0,
  });
  s.addText("30 天累漲 23.06%", {
    x: 5.0, y: 2.10, w: 4.7, h: 0.5,
    fontSize: 22, color: C.text, bold: true,
    fontFace: "Menlo", margin: 0,
  });
  s.addText("AI 共識 hold 25/100」", {
    x: 5.0, y: 2.65, w: 4.7, h: 0.5,
    fontSize: 22, color: C.text, bold: true,
    fontFace: "Menlo", margin: 0,
  });

  // separator line（mint）
  s.addShape(pres.shapes.LINE, {
    x: 5.0, y: 3.40, w: 1.5, h: 0,
    line: { color: C.mint, width: 1.5 },
  });

  s.addText("引用真實 Yahoo 報價", {
    x: 5.0, y: 3.6, w: 4.7, h: 0.32,
    fontSize: 13, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText("引用真實 30 天 OHLC", {
    x: 5.0, y: 3.95, w: 4.7, h: 0.32,
    fontSize: 13, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText("引用真實 11 策略訊號", {
    x: 5.0, y: 4.30, w: 4.7, h: 0.32,
    fontSize: 13, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText("token-by-token 串流", {
    x: 5.0, y: 4.65, w: 4.7, h: 0.32,
    fontSize: 13, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 5);
}

// ═══════════════════════════════════════════════════════
// Slide 6 — Strategies (中央「11」 + radial 鐘面 diagram)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("STRATEGY ENGINE", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  // 中央巨大「11」（mint，這頁唯一 mint 元素）
  const cx = 5.0, cy = 2.85;
  s.addText("11", {
    x: cx - 1.0, y: cy - 0.85, w: 2.0, h: 1.7,
    fontSize: 180, bold: true, color: C.mint,
    align: "center", valign: "middle",
    fontFace: "Helvetica Neue", margin: 0,
  });

  // 11 個策略圍繞圓周排列（鐘面風）
  const strategies = [
    "均線多頭", "RSI 動能", "MACD 黃金交叉",
    "艾略特波浪", "籌碼分布", "布林通道",
    "VWAP 回歸", "新聞情緒", "類股輪動",
    "風險疊加", "多策略共識",
  ];
  const radius = 2.4;
  strategies.forEach((str, i) => {
    const angle = (i / strategies.length) * 2 * Math.PI - Math.PI / 2; // 從 12 點開始
    const x = cx + radius * Math.cos(angle) - 0.7;
    const y = cy + radius * Math.sin(angle) * 0.55 - 0.13;  // *0.55 壓扁成橢圓避免出框
    s.addText(str, {
      x, y, w: 1.4, h: 0.26,
      fontSize: 10, color: C.textDim,
      align: "center", valign: "middle", fontFace: "PingFang TC", margin: 0,
    });
  });

  // 副標
  s.addText("strategies, all from real OHLC", {
    x: 0.5, y: 4.85, w: 9, h: 0.3,
    fontSize: 14, color: C.textDim, italic: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  s.addText("純函式 · 132 cells · 真實計算", {
    x: 0.5, y: 5.18, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 6);
}

// ═══════════════════════════════════════════════════════
// Slide 7 — Per-Stock Journey (4-step flow + 1 large UI overlay)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("PER-STOCK USER JOURNEY", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  s.addText("/us/nvda · 完整決策旅程", {
    x: 0.5, y: 0.85, w: 9, h: 0.55,
    fontSize: 30, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 主視覺：NVDA hero crop 真比例放大（2880×1200 → 9×3.75 inch · 2.4:1 完全保留）
  const detailPath = join(SHOTS, "10b-nvda-hero.png");
  const detailFallback = join(SHOTS, "10-stock-detail-nvda.png");
  const detailUsed = existsSync(detailPath) ? detailPath : detailFallback;
  if (existsSync(detailUsed)) {
    s.addImage({
      path: detailUsed,
      x: 0.5, y: 1.55, w: 9, h: 3.75,
      sizing: { type: "contain", w: 9, h: 3.75 },
    });
  }

  // 底部：4 步 journey 壓成單行 caption（hero 已是主角，這行只做註腳）
  s.addText(
    [
      { text: "01", options: { color: C.mint, bold: true, fontFace: "Menlo" } },
      { text: " SEO 入口   →   ", options: { color: C.textDim, fontFace: "PingFang TC" } },
      { text: "02", options: { color: C.mint, bold: true, fontFace: "Menlo" } },
      { text: " K 線視覺   →   ", options: { color: C.textDim, fontFace: "PingFang TC" } },
      { text: "03", options: { color: C.mint, bold: true, fontFace: "Menlo" } },
      { text: " 11 策略   →   ", options: { color: C.textDim, fontFace: "PingFang TC" } },
      { text: "04", options: { color: C.mint, bold: true, fontFace: "Menlo" } },
      { text: " AI 行動", options: { color: C.text, fontFace: "PingFang TC", bold: true } },
    ],
    {
      x: 0.5, y: 5.32, w: 9, h: 0.26,
      fontSize: 11, align: "center", margin: 0, charSpacing: 1,
    }
  );

  addFooter(s, 7);
}

// ═══════════════════════════════════════════════════════
// Slide 8 — Engineering Decisions (Codex's must - 5 concrete tech choices)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("ENGINEERING DECISIONS", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  s.addText("5 個關鍵工程取捨", {
    x: 0.5, y: 0.85, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 5 個 concrete decisions（Codex 的版本）
  const decisions = [
    {
      title: "Yahoo v8 chart via curl shell-out",
      reason: "Node fetch 被 ban → child_process curl 通",
    },
    {
      title: "snapshot.json daily refresh + commit",
      reason: "WebSocket 太重，build-time 抓 + ISR 已足夠",
    },
    {
      title: "11 strategies as pure functions",
      reason: "可單元測試 / 無 DB 依賴 / 可遷移到 backend",
    },
    {
      title: "Gemma 4 + zod + brace-counter",
      reason: "三層保護救 LLM 偶發 trailing prose",
    },
    {
      title: "12 SSG per-stock routes + per-page OG",
      reason: "SEO 友善 / 加載秒開 / 每頁可分享",
    },
  ];

  decisions.forEach((d, i) => {
    const y = 1.7 + i * 0.65;

    // 左側 mono bullet
    s.addText("›", {
      x: 0.7, y: y, w: 0.3, h: 0.4,
      fontSize: 16, color: C.textMore,
      fontFace: "Menlo", margin: 0, valign: "top",
    });

    // 主決策（mono code style）
    s.addText(d.title, {
      x: 1.05, y: y, w: 5.2, h: 0.4,
      fontSize: 14, color: C.text, bold: true,
      fontFace: "Menlo", margin: 0,
    });

    // 為什麼 — italic
    s.addText(d.reason, {
      x: 1.05, y: y + 0.32, w: 8.5, h: 0.32,
      fontSize: 11, color: C.textDim, italic: true,
      fontFace: "PingFang TC", margin: 0,
    });
  });

  addFooter(s, 8);
}

// ═══════════════════════════════════════════════════════
// Slide 9 — Real / Demo (兩欄 + GitHub badge proof)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("TRANSPARENCY", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, align: "center", margin: 0,
  });

  s.addText("即時 vs Demo · 誠實標記", {
    x: 0.5, y: 0.85, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 左：REAL
  s.addText("REAL", {
    x: 0.5, y: 1.85, w: 4.3, h: 0.4,
    fontSize: 14, color: C.bull, bold: true,
    fontFace: "Menlo", charSpacing: 3, margin: 0,
  });

  const realItems = [
    "Yahoo v8 chart  ·  12 stocks × 4 markets",
    "30 天 OHLC sparkline  ·  真實日線",
    "11 策略 132 cells  ·  純函式計算",
    "Gemma 4 31B rationale / risks / chat",
  ];
  realItems.forEach((it, i) => {
    s.addText(it, {
      x: 0.5, y: 2.4 + i * 0.55, w: 4.3, h: 0.4,
      fontSize: 13, color: C.text, fontFace: "PingFang TC", margin: 0,
    });
  });

  // 中央 vertical separator
  s.addShape(pres.shapes.LINE, {
    x: 5.0, y: 1.85, w: 0, h: 3.0,
    line: { color: C.border, width: 1 },
  });

  // 右：DEMO
  s.addText("DEMO", {
    x: 5.2, y: 1.85, w: 4.3, h: 0.4,
    fontSize: 14, color: C.warn, bold: true,
    fontFace: "Menlo", charSpacing: 3, margin: 0,
  });

  const demoItems = [
    "12 個月回測  ·  mock 走勢",
    "Sample 每日報告  ·  示範 markdown",
    "新聞情緒打分  ·  簡單詞袋",
  ];
  demoItems.forEach((it, i) => {
    s.addText(it, {
      x: 5.2, y: 2.4 + i * 0.55, w: 4.3, h: 0.4,
      fontSize: 13, color: C.text, fontFace: "PingFang TC", margin: 0,
    });
  });

  s.addText("頁面有黃色 chip 標示 · backend 有真實版", {
    x: 5.2, y: 4.15, w: 4.3, h: 0.3,
    fontSize: 11, color: C.textMore, italic: true,
    fontFace: "PingFang TC", margin: 0,
  });

  // 底部 GitHub proof badge
  s.addText("→ github.com/GKS711/_quant-terminal", {
    x: 0.5, y: 5.05, w: 9, h: 0.25,
    fontSize: 11, color: C.mintLite, italic: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  addFooter(s, 9);
}

// ═══════════════════════════════════════════════════════
// Slide 10 — Closing (URL 巨大 + name)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // 中央 mint dot
  s.addShape(pres.shapes.OVAL, {
    x: 4.92, y: 1.4, w: 0.16, h: 0.16,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  // 主訊息
  s.addText("100% 自架", {
    x: 0.5, y: 2.05, w: 9, h: 0.85,
    fontSize: 56, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0, charSpacing: -1.5,
  });

  // italic 副標
  s.addText("design · engineering · AI integration", {
    x: 0.5, y: 3.0, w: 9, h: 0.4,
    fontSize: 16, color: C.mintDeep, italic: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  // URL 巨大（mint underline 風格）
  s.addText("github.com/GKS711/_quant-terminal", {
    x: 0.5, y: 4.0, w: 9, h: 0.5,
    fontSize: 22, color: C.mintLite, bold: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  // mint 底線
  s.addShape(pres.shapes.LINE, {
    x: 1.5, y: 4.5, w: 7.0, h: 0,
    line: { color: C.mint, width: 1.5 },
  });

  // 結語
  s.addText("Built by GKS · 2026 · MIT License", {
    x: 0.5, y: 5.05, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore,
    align: "center", fontFace: "Menlo", charSpacing: 2, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Save
// ═══════════════════════════════════════════════════════
await pres.writeFile({ fileName: OUT_PPTX });
console.log("✅ Saved v5:", OUT_PPTX);
