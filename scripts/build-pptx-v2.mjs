#!/usr/bin/env node
/**
 * Build 每日股市儀表板 簡報 v2 .pptx — incorporates agency critique:
 *
 *   Visual Storyteller: 1-主-3-輔金字塔、less spec sheet vibe、敘事節奏
 *   Brand Guardian:    mint 預算、紅色只用在跌、視覺層次
 *
 * 主要 Fix（vs v1）：
 *   - Slide 1: 中央放 hero 截圖當主角（不只是文字+小 logo）
 *   - Slide 2: 「8 小時」單一巨大數字，4-11-234 縮為小字補充
 *   - Slide 3: before/after split (「8h 手動」灰 vs 「30s 看完」mint)
 *   - 全簡報 mint 預算：每張只 1 個 mint 元素
 *   - 痛點數字 #E5484D → #F59E0B（警示橘，避免跟 bear 紅衝突）
 *   - Closing 3 chips 換成具體成果
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
  mint:      "4EAA85",
  mintLite:  "6FC298",
  mintDeep:  "3F8E6E",
  bull:      "10B981",
  bear:      "E5484D",
  warn:      "F59E0B",   // 警示橘，痛點用（不跟 bear 衝突）
  border:    "2A2A2A",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "GKS";
pres.title = "每日股市儀表板";

function addFooter(slide, pageNum, total = 10) {
  slide.addText("每日股市儀表板 / GKS", {
    x: 0.4, y: 5.25, w: 3, h: 0.3,
    fontSize: 9, color: C.textDim, fontFace: "Helvetica Neue", margin: 0,
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: 8.5, y: 5.25, w: 1.1, h: 0.3,
    fontSize: 9, color: C.textDim, fontFace: "Helvetica Neue",
    align: "right", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 1 — Cover (Fix 1: hero image as main character)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // 上方 narrow status bar
  s.addText("LIVE  ·  GEMMA-4-31B-IT  ·  12 STOCKS  ·  4 MARKETS", {
    x: 0.5, y: 0.35, w: 9, h: 0.3,
    fontSize: 10, color: C.mintDeep, fontFace: "Menlo",
    align: "center", charSpacing: 4, margin: 0,
  });

  // Fix #1 (Codex 評分回饋)：Cover 主角必須是真實產品截圖，不是 AI 生成 mockup
  // Codex 的概念圖太「泛金融」會削弱「這是我真的做出來的產品」的可信度
  const heroPath = join(SHOTS, "01-hero.png");
  if (existsSync(heroPath)) {
    s.addImage({
      path: heroPath,
      x: 0.7, y: 0.85, w: 8.6, h: 3.0,
      sizing: { type: "contain", w: 8.6, h: 3.0 },
    });
  }

  // 主標題壓在卡片下方
  s.addText("每日股市儀表板", {
    x: 0.5, y: 4.0, w: 9, h: 0.7,
    fontSize: 48, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0,
    charSpacing: -1.5,
  });

  // 副標
  s.addText("全球多市場量化分析儀表板  ·  🇹🇼 🇺🇸 🇭🇰 🇨🇳", {
    x: 0.5, y: 4.7, w: 9, h: 0.35,
    fontSize: 16, color: C.textDim,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  // mint accent dot
  s.addShape(pres.shapes.OVAL, {
    x: 4.92, y: 5.18, w: 0.16, h: 0.16,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  // 結語
  s.addText("by GKS · 2026 · 100% 自架", {
    x: 0.5, y: 5.35, w: 9, h: 0.3,
    fontSize: 10, color: C.textMore,
    align: "center", fontFace: "Menlo", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 2 — Problem (Fix 2: 1 主 3 輔金字塔)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // eyebrow（mint dim — 不要 lite）
  s.addText("THE PROBLEM", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("投資不是看技術線就能搞定的事", {
    x: 0.5, y: 0.85, w: 9, h: 0.85,
    fontSize: 32, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -1,
  });

  // 左半：Codex 生成的時鐘 chaos 圖
  const problemImg = join(ASSETS, "slide2-problem.png");
  if (existsSync(problemImg)) {
    s.addImage({
      path: problemImg,
      x: 0.4, y: 1.85, w: 4.6, h: 2.6,
      sizing: { type: "cover", w: 4.6, h: 2.6 },
    });
  }

  // 右半：8 小時 + 副痛點
  s.addText("8", {
    x: 5.3, y: 1.7, w: 1.5, h: 1.5,
    fontSize: 140, bold: true, color: C.warn,
    fontFace: "Helvetica Neue", margin: 0, valign: "top", align: "left",
  });
  s.addText("小時", {
    x: 6.85, y: 2.0, w: 1.5, h: 0.7,
    fontSize: 28, bold: true, color: C.warn,
    fontFace: "PingFang TC", margin: 0, valign: "middle",
  });

  s.addText("手動做完一份多市場分析報告", {
    x: 5.3, y: 3.05, w: 4.3, h: 0.4,
    fontSize: 15, color: C.text,
    fontFace: "PingFang TC", margin: 0,
  });

  // 3 副痛點 stacked
  const subPains = [
    "4 個市場開盤時間不同",
    "11 種策略各有立場",
    "234 篇新聞讀不完",
  ];
  subPains.forEach((p, i) => {
    s.addText(p, {
      x: 5.3, y: 3.55 + i * 0.32, w: 4.3, h: 0.3,
      fontSize: 12, color: C.textDim,
      fontFace: "PingFang TC", margin: 0,
    });
  });

  // 結論箭頭，mint（整頁唯一 mint）
  s.addText("→  30 秒看完", {
    x: 0.5, y: 4.85, w: 9, h: 0.4,
    fontSize: 18, italic: true, color: C.mintLite, bold: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 2);
}

// ═══════════════════════════════════════════════════════
// Slide 3 — Solution (Fix 3: before/after split)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("THE SOLUTION", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("用 AI 把 8 小時壓成 30 秒", {
    x: 0.5, y: 0.85, w: 9, h: 0.85,
    fontSize: 32, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -1,
  });

  // BEFORE 區（灰）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.95, w: 4.3, h: 1.55,
    fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
  });
  s.addText("BEFORE", {
    x: 0.7, y: 2.05, w: 3.9, h: 0.3,
    fontSize: 10, color: C.textMore, bold: true, fontFace: "Menlo", charSpacing: 3, margin: 0,
  });
  s.addText("8 小時", {
    x: 0.7, y: 2.35, w: 3.9, h: 0.65,
    fontSize: 36, bold: true, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText("人工逐市場逐策略分析", {
    x: 0.7, y: 3.0, w: 3.9, h: 0.4,
    fontSize: 12, color: C.textDim, fontFace: "PingFang TC", margin: 0,
  });

  // → 中間箭頭
  s.addText("→", {
    x: 4.85, y: 2.4, w: 0.3, h: 0.7,
    fontSize: 36, color: C.mint, bold: true,
    align: "center", valign: "middle", fontFace: "Helvetica Neue", margin: 0,
  });

  // AFTER 區（mint）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.95, w: 4.3, h: 1.55,
    fill: { color: "0d2418" }, line: { color: C.mint, width: 1 },
  });
  s.addText("AFTER", {
    x: 5.4, y: 2.05, w: 3.9, h: 0.3,
    fontSize: 10, color: C.mintLite, bold: true, fontFace: "Menlo", charSpacing: 3, margin: 0,
  });
  s.addText("30 秒", {
    x: 5.4, y: 2.35, w: 3.9, h: 0.65,
    fontSize: 36, bold: true, color: C.mintLite,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText("12 卡 × 4 國 × Gemma 4 31B 即時", {
    x: 5.4, y: 3.0, w: 3.9, h: 0.4,
    fontSize: 12, color: C.text, fontFace: "PingFang TC", margin: 0,
  });

  // hero 截圖 — 縮小放底部
  const heroPath = join(SHOTS, "01-hero.png");
  if (existsSync(heroPath)) {
    s.addImage({
      path: heroPath,
      x: 1.5, y: 3.7, w: 7, h: 1.35,
      sizing: { type: "contain", w: 7, h: 1.35 },
    });
  }

  addFooter(s, 3);
}

// ═══════════════════════════════════════════════════════
// Slide 4 — Decision Terminal (mint 預算：只 1 個 mint)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("MULTI-MARKET TERMINAL", {
    x: 0.5, y: 0.4, w: 6, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("12 卡片 · 4 國 · 一目了然", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 4 國 chip — 改用 outlined style，不全 mint
  const markets = [
    { flag: "🇹🇼", name: "台股", count: "4" },
    { flag: "🇺🇸", name: "美股", count: "4" },
    { flag: "🇭🇰", name: "港股", count: "2" },
    { flag: "🇨🇳", name: "A 股",  count: "2" },
  ];
  markets.forEach((m, i) => {
    const x = 0.7 + i * 2.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.7, w: 2.0, h: 0.6,
      fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
    });
    s.addText(`${m.flag}  ${m.name}  ${m.count}`, {
      x, y: 1.7, w: 2.0, h: 0.6,
      fontSize: 13, color: C.text,
      align: "center", valign: "middle", fontFace: "PingFang TC", margin: 0,
    });
  });

  // 截圖
  const dtPath = join(SHOTS, "02-decision-terminal.png");
  if (existsSync(dtPath)) {
    s.addImage({
      path: dtPath,
      x: 0.5, y: 2.5, w: 9, h: 2.5,
      sizing: { type: "contain", w: 9, h: 2.5 },
    });
  }

  s.addText("國旗 · 真實價格 · 30d sparkline · AI 共識訊號", {
    x: 0.5, y: 5.05, w: 9, h: 0.25,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 4);
}

// ═══════════════════════════════════════════════════════
// Slide 5 — Strategies (less spec, more visual)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("STRATEGY ENGINE", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("11 種策略 · 真實計算 · 132 cells", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 兩欄：技術 7 / 基本面 4 — 改用 chip badge 風
  const techStrats = ["均線", "RSI", "MACD", "艾略特", "籌碼", "布林", "VWAP"];
  const fundStrats = ["新聞情緒", "類股輪動", "風險疊加", "多策略共識"];

  s.addText("技術面 · 7 種", {
    x: 0.5, y: 1.7, w: 4.3, h: 0.35,
    fontSize: 12, bold: true, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });
  techStrats.forEach((t, i) => {
    const x = 0.5 + (i % 4) * 1.0;
    const y = 2.1 + Math.floor(i / 4) * 0.45;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.92, h: 0.35,
      fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
    });
    s.addText(t, {
      x, y, w: 0.92, h: 0.35,
      fontSize: 11, color: C.text,
      align: "center", valign: "middle", fontFace: "PingFang TC", margin: 0,
    });
  });

  s.addText("基本面 / 風險 · 4 種", {
    x: 5.2, y: 1.7, w: 4.3, h: 0.35,
    fontSize: 12, bold: true, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });
  fundStrats.forEach((t, i) => {
    const x = 5.2 + (i % 4) * 1.05;
    const y = 2.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.97, h: 0.35,
      fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
    });
    s.addText(t, {
      x, y, w: 0.97, h: 0.35,
      fontSize: 11, color: C.text,
      align: "center", valign: "middle", fontFace: "PingFang TC", margin: 0,
    });
  });

  const hmPath = join(SHOTS, "05-strategy-heatmap.png");
  if (existsSync(hmPath)) {
    s.addImage({
      path: hmPath,
      x: 1.0, y: 3.0, w: 8, h: 2.0,
      sizing: { type: "contain", w: 8, h: 2.0 },
    });
  }

  s.addText("純函式從真實 OHLC 計算 · MA / RSI / MACD / 布林 / VWAP", {
    x: 0.5, y: 5.05, w: 9, h: 0.25,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 5);
}

// ═══════════════════════════════════════════════════════
// Slide 6 — AI Advisor (quote 是這頁唯一 mint，符合預算)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("AI ADVISOR · LIVE STREAMING", {
    x: 0.5, y: 0.4, w: 6, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("Gemma 4 31B 真打 · 引用真實數據", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // Quote box — 整頁唯一 mint
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 9, h: 0.95,
    fill: { color: "0d2418" }, line: { color: C.mint, width: 1 },
  });
  s.addText("「目前 NVDA 收 $208.26 · 30 天累漲 15.55% · AI 共識 hold 24/100」", {
    x: 0.7, y: 1.85, w: 8.6, h: 0.4,
    fontSize: 14, color: C.text, italic: true,
    fontFace: "Menlo", margin: 0,
  });
  s.addText("← Gemma 4 直接從 system prompt 注入的真實 snapshot 抓數字回答", {
    x: 0.7, y: 2.25, w: 8.6, h: 0.3,
    fontSize: 11, color: C.textDim,
    fontFace: "PingFang TC", margin: 0,
  });

  const aiPath = join(SHOTS, "08-ai-demo.png");
  if (existsSync(aiPath)) {
    s.addImage({
      path: aiPath,
      x: 1.5, y: 2.85, w: 7, h: 2.15,
      sizing: { type: "contain", w: 7, h: 2.15 },
    });
  }

  s.addText("token-by-token 串流 · 過濾 thought 推理 · 自動附免責", {
    x: 0.5, y: 5.05, w: 9, h: 0.25,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 6);
}

// ═══════════════════════════════════════════════════════
// Slide 7 — Per-Stock (route chip 只 1 個 mint)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Codex v3 建議：把「功能列表」改成「使用者旅程流程圖」
  // 一條路由 /us/nvda 怎麼從 SEO → K 線 → 策略 → AI action 串起來

  s.addText("PER-STOCK USER JOURNEY", {
    x: 0.5, y: 0.4, w: 6, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("一條 / us / nvda · 完整決策旅程", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // ─── 4 階段 horizontal flow（連接箭頭）───
  const journey = [
    { num: "1", emoji: "🔍", title: "SEO 入口",   sub: "Google 搜「NVDA AI 分析」找到此頁",     hint: "/us/nvda · OG image" },
    { num: "2", emoji: "📈", title: "K 線視覺",   sub: "OHLC + MA5 + MA20 疊加 · SSG 秒開",     hint: "lightweight-charts" },
    { num: "3", emoji: "🧠", title: "11 策略",    sub: "技術 7 + 基本面 4 · 個別訊號 grid",      hint: "MA / RSI / MACD..." },
    { num: "4", emoji: "✓",  title: "AI 行動",    sub: "風險檢核 + 行動清單 + 相似標的",         hint: "Gemma 4 真打" },
  ];
  const stepW = 2.05, stepGap = 0.13;
  const stepStartX = (10 - (stepW * 4 + stepGap * 3)) / 2;

  journey.forEach((step, i) => {
    const x = stepStartX + i * (stepW + stepGap);

    // step card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.85, w: stepW, h: 1.85,
      fill: { color: C.bgCard },
      line: { color: i === 3 ? C.mint : C.border, width: 1 }, // 最後一步用 mint 收尾
    });

    // 編號（右上角小字）
    s.addText(step.num, {
      x: x + stepW - 0.4, y: 1.95, w: 0.3, h: 0.25,
      fontSize: 10, color: C.textMore, bold: true,
      align: "right", fontFace: "Menlo", margin: 0,
    });

    // 大 emoji icon 置中
    s.addText(step.emoji, {
      x: x, y: 2.0, w: stepW, h: 0.6,
      fontSize: 32, align: "center", valign: "middle", margin: 0,
    });

    // 標題
    s.addText(step.title, {
      x: x + 0.15, y: 2.65, w: stepW - 0.3, h: 0.35,
      fontSize: 14, color: C.text, bold: true,
      align: "center", fontFace: "PingFang TC", margin: 0,
    });

    // 副標
    s.addText(step.sub, {
      x: x + 0.15, y: 3.0, w: stepW - 0.3, h: 0.45,
      fontSize: 10, color: C.textDim,
      align: "center", fontFace: "PingFang TC", margin: 0,
    });

    // 技術 hint（小字 monospace）
    s.addText(step.hint, {
      x: x + 0.15, y: 3.45, w: stepW - 0.3, h: 0.2,
      fontSize: 8, color: C.textMore, italic: true,
      align: "center", fontFace: "Menlo", margin: 0,
    });

    // 連接箭頭（最後一個不畫）
    if (i < 3) {
      s.addText("→", {
        x: x + stepW - 0.05, y: 2.65, w: 0.25, h: 0.4,
        fontSize: 18, color: C.mintLite, bold: true,
        align: "center", valign: "middle", fontFace: "Helvetica Neue", margin: 0,
      });
    }
  });

  // 底部 screenshot — NVDA 詳情頁實證
  const detailPath = join(SHOTS, "10-stock-detail-nvda.png");
  if (existsSync(detailPath)) {
    s.addImage({
      path: detailPath,
      x: 2.2, y: 3.85, w: 5.6, h: 1.2,
      sizing: { type: "contain", w: 5.6, h: 1.2 },
    });
  }

  // 結語
  s.addText("12 條 SSG 路由 · build-time prerender · 各自獨立 OG image", {
    x: 0.5, y: 5.05, w: 9, h: 0.25,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 7);
}

// ═══════════════════════════════════════════════════════
// Slide 8 — Tech Stack (前端 mint 邊框，後端灰邊框)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("TECH STACK", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("完整工程鏈 · 100% 自架", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 前端 — mint 邊框（這份是前端作品集，前端是主秀）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.75, w: 4.3, h: 3.0,
    fill: { color: C.bgCard }, line: { color: C.mint, width: 1 },
  });
  s.addText("FRONTEND  ·  主秀", {
    x: 0.7, y: 1.95, w: 3.9, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true, fontFace: "Menlo", charSpacing: 3, margin: 0,
  });
  s.addText("Next.js / TS / Tailwind", {
    x: 0.7, y: 2.4, w: 3.9, h: 0.5,
    fontSize: 22, bold: true, color: C.text, fontFace: "PingFang TC", margin: 0,
  });
  // Fix #2 (Codex 評分回饋)：砍 30-40% 文字，每邊只留 3 個最 hireable 訊號
  const frontendItems = [
    "Gemma 4 31B 即時串流（zod-validated JSON）",
    "Recharts + lightweight-charts 雙圖庫",
    "next/og 動態 OG image · framer-motion 動效",
  ];
  frontendItems.forEach((it, i) => {
    s.addText(`›  ${it}`, {
      x: 0.7, y: 3.1 + i * 0.55, w: 3.9, h: 0.5,
      fontSize: 12, color: C.textDim, fontFace: "PingFang TC", margin: 0, valign: "top",
    });
  });

  // 後端 — 灰邊框（次強調）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.75, w: 4.3, h: 3.0,
    fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
  });
  s.addText("BACKEND  ·  daily_stock_analysis", {
    x: 5.4, y: 1.95, w: 3.9, h: 0.3,
    fontSize: 11, color: C.textDim, bold: true, fontFace: "Menlo", charSpacing: 3, margin: 0,
  });
  s.addText("Python / FastAPI / Litellm", {
    x: 5.4, y: 2.4, w: 3.9, h: 0.5,
    fontSize: 22, bold: true, color: C.text, fontFace: "PingFang TC", margin: 0,
  });
  const backendItems = [
    "8+ 資料源 · efinance / AkShare / YFinance",
    "11 策略分析器 + walk-forward 回測模組",
    "GitHub Actions 每日 09:00 自動執行 · $0 cost",
  ];
  backendItems.forEach((it, i) => {
    s.addText(`›  ${it}`, {
      x: 5.4, y: 3.1 + i * 0.55, w: 3.9, h: 0.5,
      fontSize: 12, color: C.textDim, fontFace: "PingFang TC", margin: 0, valign: "top",
    });
  });

  s.addText("github.com/GKS711/daily_stock_analysis · MIT 開源", {
    x: 0.5, y: 5.0, w: 9, h: 0.25,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  addFooter(s, 8);
}

// ═══════════════════════════════════════════════════════
// Slide 9 — Real vs Demo (透明度章節)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("TRANSPARENCY", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintDeep, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("即時 vs Demo · 誠實標記", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 即時（綠 - 這是這頁唯一 mint，符合預算）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.75, w: 4.5, h: 3.2,
    fill: { color: "0d2620" }, line: { color: C.bull, width: 1 },
  });
  s.addText("✅ 即時 · 真實", {
    x: 0.7, y: 1.9, w: 4.1, h: 0.4,
    fontSize: 16, color: C.bull, bold: true,
    fontFace: "PingFang TC", margin: 0,
  });
  // Fix #3 (Codex 評分回饋)：簡化成 3 個大結論，不要 6 條 checklist
  const realItems = [
    { big: "Real-time prices",   sub: "Yahoo v8 · 12 stocks × 4 markets" },
    { big: "Real strategy compute", sub: "11 indicators · 132 cells · pure functions" },
    { big: "Real Gemma 4 reasoning", sub: "rationale / risks / advisor chat" },
  ];
  realItems.forEach((it, i) => {
    s.addText(it.big, {
      x: 0.7, y: 2.45 + i * 0.85, w: 4.1, h: 0.35,
      fontSize: 14, color: C.text, bold: true, fontFace: "PingFang TC", margin: 0,
    });
    s.addText(it.sub, {
      x: 0.7, y: 2.85 + i * 0.85, w: 4.1, h: 0.3,
      fontSize: 10, color: C.textDim, fontFace: "Menlo", margin: 0,
    });
  });

  // Demo（橘 - warn 色）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.75, w: 4.5, h: 3.2,
    fill: { color: "2d2110" }, line: { color: C.warn, width: 1 },
  });
  s.addText("⚠ DEMO · 示範", {
    x: 5.4, y: 1.9, w: 4.1, h: 0.4,
    fontSize: 16, color: C.warn, bold: true,
    fontFace: "PingFang TC", margin: 0,
  });
  const demoItems = [
    { big: "12 個月回測",       sub: "mock 走勢 · backend 有真實版" },
    { big: "Sample 日報",       sub: "示範 markdown 結構" },
    { big: "新聞情緒打分",      sub: "簡單詞袋，可換 LLM 升級" },
  ];
  demoItems.forEach((it, i) => {
    s.addText(it.big, {
      x: 5.4, y: 2.45 + i * 0.85, w: 4.1, h: 0.35,
      fontSize: 14, color: C.text, bold: true, fontFace: "PingFang TC", margin: 0,
    });
    s.addText(it.sub, {
      x: 5.4, y: 2.85 + i * 0.85, w: 4.1, h: 0.3,
      fontSize: 10, color: C.textDim, fontFace: "PingFang TC", margin: 0,
    });
  });

  addFooter(s, 9);
}

// ═══════════════════════════════════════════════════════
// Slide 10 — Closing (3 chips 改具體成果，視覺層次)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("從 0 到 1 · 100% 自架", {
    x: 0.5, y: 0.85, w: 9, h: 0.85,
    fontSize: 40, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0, charSpacing: -1,
  });

  s.addText("從設計、 前端、 後端、 到 AI 整合", {
    x: 0.5, y: 1.8, w: 9, h: 0.45,
    fontSize: 16, color: C.textDim, align: "center",
    fontFace: "PingFang TC", margin: 0,
  });

  // 3 chips 改成具體成果（視覺層次：mint full / mint outline / dim）
  const chips = [
    { text: "12 SSG 路由",     style: "primary" },
    { text: "Gemma 4 真打",    style: "secondary" },
    { text: "MIT 開源",        style: "tertiary" },
  ];
  const chipW = 2.2, gap = 0.3;
  const totalW = chipW * 3 + gap * 2;
  const startX = (10 - totalW) / 2;
  chips.forEach((c, i) => {
    const x = startX + i * (chipW + gap);
    const fill = c.style === "primary" ? C.mint : c.style === "secondary" ? "0d2418" : C.bgCard;
    const border = c.style === "primary" ? C.mint : c.style === "secondary" ? C.mint : C.border;
    const color = c.style === "primary" ? C.bg : c.style === "secondary" ? C.mintLite : C.textDim;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.55, w: chipW, h: 0.55,
      fill: { color: fill }, line: { color: border, width: 1 },
    });
    s.addText(c.text, {
      x, y: 2.55, w: chipW, h: 0.55,
      fontSize: 13, color, bold: true,
      align: "center", valign: "middle",
      fontFace: "PingFang TC", margin: 0,
    });
  });

  // closing 圖（用 codex 的）
  const closeAsset = join(ASSETS, "slide10-closing.png");
  if (existsSync(closeAsset)) {
    s.addImage({
      path: closeAsset,
      x: 2.5, y: 3.3, w: 5, h: 1.5,
      sizing: { type: "cover", w: 5, h: 1.5 },
    });
  }

  // GitHub URL
  s.addText("github.com/GKS711/daily_stock_analysis", {
    x: 0.5, y: 4.85, w: 9, h: 0.35,
    fontSize: 14, color: C.mintLite, bold: true,
    align: "center", fontFace: "Menlo", margin: 0,
  });

  s.addText("Built by GKS · 2026", {
    x: 0.5, y: 5.25, w: 9, h: 0.3,
    fontSize: 10, color: C.textMore,
    align: "center", fontFace: "Menlo", charSpacing: 2, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Save
// ═══════════════════════════════════════════════════════
await pres.writeFile({ fileName: OUT_PPTX });
console.log("✅ Saved v2:", OUT_PPTX);
