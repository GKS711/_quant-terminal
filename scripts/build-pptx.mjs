#!/usr/bin/env node
/**
 * Build 每日股市儀表板 簡報 .pptx (10 slides, dark theme)
 *
 * Output: docs/每日股市儀表板_簡報.pptx
 */

import pptxgen from "pptxgenjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHOTS = join(ROOT, "docs", "screenshots");
const OUT_PPTX = join(ROOT, "docs", "每日股市儀表板_簡報.pptx");

// ─── 品牌顏色 (no # prefix) ───
const C = {
  bg:        "0A0A0A",
  bgPanel:   "141414",
  bgCard:    "1C1C1C",
  text:      "F6F6F6",
  textDim:   "9A9A9A",
  textMore:  "62666D",
  mint:      "4EAA85",
  mintLite:  "6FC298",
  bull:      "10B981",
  bear:      "E5484D",
  border:    "2A2A2A",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 × 5.625 inch
pres.author = "GKS";
pres.title = "每日股市儀表板";

// ─── 共用：頁尾 ───
function addFooter(slide, pageNum, total = 10) {
  // bottom-left brand
  slide.addText("每日股市儀表板 / GKS", {
    x: 0.4, y: 5.25, w: 3, h: 0.3,
    fontSize: 9, color: C.textMore, fontFace: "Helvetica Neue", margin: 0,
  });
  // bottom-right page number
  slide.addText(`${pageNum} / ${total}`, {
    x: 8.5, y: 5.25, w: 1.1, h: 0.3,
    fontSize: 9, color: C.textMore, fontFace: "Helvetica Neue",
    align: "right", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 1 — Cover
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // 中央放大 logo（mint 圓形 + 折線圖示）
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.4, y: 1.0, w: 1.2, h: 1.2,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
    rectRadius: 0.16,
  });
  // 折線（簡化的 trending up icon）
  s.addText("↗", {
    x: 4.4, y: 1.0, w: 1.2, h: 1.2,
    fontSize: 60, color: C.bg, bold: true, align: "center", valign: "middle", margin: 0,
  });

  // 主標題
  s.addText("每日股市儀表板", {
    x: 0.5, y: 2.5, w: 9, h: 1.0,
    fontSize: 60, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0,
    charSpacing: -2,
  });

  // 副標題
  s.addText("全球多市場量化分析儀表板", {
    x: 0.5, y: 3.55, w: 9, h: 0.5,
    fontSize: 22, color: C.textDim,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  // mint accent line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.4, y: 4.15, w: 1.2, h: 0.04,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  // 4 國旗 mini
  s.addText("🇹🇼  🇺🇸  🇭🇰  🇨🇳", {
    x: 0.5, y: 4.3, w: 9, h: 0.45,
    fontSize: 20, align: "center", margin: 0,
  });

  // 結語
  s.addText("by GKS · 2026 · 100% 自架", {
    x: 0.5, y: 4.85, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore,
    align: "center", fontFace: "Menlo", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Slide 2 — The Problem
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // eyebrow
  s.addText("THE PROBLEM", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  // title
  s.addText("投資不是看技術線就能搞定的事", {
    x: 0.5, y: 0.85, w: 9, h: 0.85,
    fontSize: 32, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -1,
  });

  // 4 個痛點 grid
  const pains = [
    { num: "4", label: "個市場開盤時間不同", detail: "TW/US/HK/CN 時差掌握不來" },
    { num: "11", label: "種策略各有立場", detail: "技術面 + 基本面 + 風險" },
    { num: "234", label: "篇新聞每天讀不完", detail: "TWSE / Reuters / Bloomberg ..." },
    { num: "8", label: "小時整理一份報告", detail: "手動做完 → 行情已變" },
  ];

  pains.forEach((p, i) => {
    const x = 0.5 + (i % 2) * 4.6;
    const y = 2.05 + Math.floor(i / 2) * 1.45;

    // card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.3, h: 1.25,
      fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
    });

    // big number
    s.addText(p.num, {
      x: x + 0.25, y: y + 0.2, w: 1.2, h: 0.85,
      fontSize: 48, bold: true, color: C.bear,
      fontFace: "Menlo", margin: 0, valign: "top",
    });

    // label
    s.addText(p.label, {
      x: x + 1.6, y: y + 0.25, w: 2.5, h: 0.45,
      fontSize: 14, bold: true, color: C.text,
      fontFace: "PingFang TC", margin: 0,
    });

    // detail
    s.addText(p.detail, {
      x: x + 1.6, y: y + 0.7, w: 2.5, h: 0.45,
      fontSize: 11, color: C.textDim,
      fontFace: "PingFang TC", margin: 0,
    });
  });

  // bottom note
  s.addText("→ 需要一個自動化、 多市場、 AI 整合的解決方案", {
    x: 0.5, y: 4.6, w: 9, h: 0.4,
    fontSize: 14, italic: true, color: C.mintLite,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 2);
}

// ═══════════════════════════════════════════════════════
// Slide 3 — The Solution
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("THE SOLUTION", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText([
    { text: "12 ",  options: { color: C.mintLite, bold: true } },
    { text: "檔精選 × ", options: { color: C.text } },
    { text: "4 ",   options: { color: C.mintLite, bold: true } },
    { text: "市場 × ", options: { color: C.text } },
    { text: "11 ",  options: { color: C.mintLite, bold: true } },
    { text: "策略 × ", options: { color: C.text } },
    { text: "Gemma 4 31B", options: { color: C.mintLite, bold: true } },
    { text: " 即時推論", options: { color: C.text } },
  ], {
    x: 0.5, y: 0.85, w: 9, h: 0.85,
    fontSize: 28, bold: true,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // hero screenshot
  const heroPath = join(SHOTS, "01-hero.png");
  if (existsSync(heroPath)) {
    s.addImage({
      path: heroPath,
      x: 1.3, y: 1.95, w: 7.4, h: 2.9,
      sizing: { type: "contain", w: 7.4, h: 2.9 },
    });
  }

  s.addText("首頁 Hero · Apple 風 spotlight 自動輪播 · 引用真實 Yahoo Finance + Gemma 4 31B", {
    x: 0.5, y: 4.95, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 3);
}

// ═══════════════════════════════════════════════════════
// Slide 4 — Multi-market Decision Terminal
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("MULTI-MARKET DECISION TERMINAL", {
    x: 0.5, y: 0.4, w: 7, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("12 卡片矩陣 · 4 國一目了然", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 4 國 chip
  const markets = [
    { flag: "🇹🇼", name: "台股 TW", count: "4" },
    { flag: "🇺🇸", name: "美股 US", count: "4" },
    { flag: "🇭🇰", name: "港股 HK", count: "2" },
    { flag: "🇨🇳", name: "A 股 CN",  count: "2" },
  ];
  markets.forEach((m, i) => {
    const x = 0.5 + i * 2.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.7, w: 2.1, h: 0.6,
      fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
    });
    s.addText(`${m.flag}  ${m.name}  ${m.count}`, {
      x, y: 1.7, w: 2.1, h: 0.6,
      fontSize: 13, color: C.text, bold: true,
      align: "center", valign: "middle", fontFace: "PingFang TC", margin: 0,
    });
  });

  // screenshot
  const dtPath = join(SHOTS, "02-decision-terminal.png");
  if (existsSync(dtPath)) {
    s.addImage({
      path: dtPath,
      x: 0.5, y: 2.45, w: 9, h: 2.5,
      sizing: { type: "contain", w: 9, h: 2.5 },
    });
  }

  s.addText("每張卡：國旗 · 真實價格 · 30d sparkline · AI 共識訊號 · 一鍵 filter", {
    x: 0.5, y: 5.0, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 4);
}

// ═══════════════════════════════════════════════════════
// Slide 5 — 11 Strategies
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("STRATEGY ENGINE", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("11 種策略 · 132 cells · 真實計算", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 兩欄：技術 7 / 基本面 4
  s.addText("技術面 7 種", {
    x: 0.5, y: 1.7, w: 4, h: 0.35,
    fontSize: 14, bold: true, color: C.mintLite,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText([
    { text: "均線多頭 ·  RSI 動能 ·  MACD 黃金交叉", options: { color: C.text, breakLine: true } },
    { text: "艾略特波浪 ·  籌碼分布", options: { color: C.text, breakLine: true } },
    { text: "布林通道 ·  VWAP 回歸", options: { color: C.text } },
  ], {
    x: 0.5, y: 2.05, w: 4, h: 1.0,
    fontSize: 12, fontFace: "PingFang TC", margin: 0, paraSpaceAfter: 4,
  });

  s.addText("基本面 / 風險 4 種", {
    x: 5.2, y: 1.7, w: 4.3, h: 0.35,
    fontSize: 14, bold: true, color: C.mintLite,
    fontFace: "PingFang TC", margin: 0,
  });
  s.addText([
    { text: "新聞情緒 ·  類股輪動", options: { color: C.text, breakLine: true } },
    { text: "風險疊加", options: { color: C.text, breakLine: true } },
    { text: "多策略共識（加權投票）", options: { color: C.text } },
  ], {
    x: 5.2, y: 2.05, w: 4.3, h: 1.0,
    fontSize: 12, fontFace: "PingFang TC", margin: 0, paraSpaceAfter: 4,
  });

  // screenshot
  const hmPath = join(SHOTS, "05-strategy-heatmap.png");
  if (existsSync(hmPath)) {
    s.addImage({
      path: hmPath,
      x: 1.3, y: 3.15, w: 7.4, h: 1.85,
      sizing: { type: "contain", w: 7.4, h: 1.85 },
    });
  }

  s.addText("從真實 OHLC 數據計算 · MA / RSI / MACD / 布林 / VWAP 等純函式", {
    x: 0.5, y: 5.05, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 5);
}

// ═══════════════════════════════════════════════════════
// Slide 6 — AI Advisor Live
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("AI ADVISOR · LIVE STREAMING", {
    x: 0.5, y: 0.4, w: 6, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("Gemma 4 31B 真打 · 引用真實數據", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 範例引文 quote
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 9, h: 0.95,
    fill: { color: C.bgCard }, line: { color: C.mint, width: 1 },
  });
  s.addText("「 目前 NVDA 收 $208.26 · 30 天累漲 15.55% · AI 共識 hold 24/100 」", {
    x: 0.7, y: 1.85, w: 8.6, h: 0.4,
    fontSize: 14, color: C.text, italic: true,
    fontFace: "Menlo", margin: 0,
  });
  s.addText("← Gemma 4 31B 直接從 system prompt 注入的真實 snapshot 抓數字回答", {
    x: 0.7, y: 2.25, w: 8.6, h: 0.3,
    fontSize: 11, color: C.textMore,
    fontFace: "PingFang TC", margin: 0,
  });

  // screenshot
  const aiPath = join(SHOTS, "08-ai-demo.png");
  if (existsSync(aiPath)) {
    s.addImage({
      path: aiPath,
      x: 1.5, y: 2.85, w: 7, h: 2.15,
      sizing: { type: "contain", w: 7, h: 2.15 },
    });
  }

  s.addText("token-by-token 串流 · 已過濾 thought 推理 · 每次結尾自動附免責", {
    x: 0.5, y: 5.05, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore, italic: true,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 6);
}

// ═══════════════════════════════════════════════════════
// Slide 7 — Per-Stock Deep Dive
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("PER-STOCK DEEP DIVE", {
    x: 0.5, y: 0.4, w: 6, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("12 條獨立路由 · SEO 友善", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // route 範例 chip
  s.addText([
    { text: "/tw/2330", options: { color: C.mintLite, bold: true } },
    { text: "  ·  ", options: { color: C.textMore } },
    { text: "/us/nvda", options: { color: C.mintLite, bold: true } },
    { text: "  ·  ", options: { color: C.textMore } },
    { text: "/hk/0700", options: { color: C.mintLite, bold: true } },
    { text: "  ·  ", options: { color: C.textMore } },
    { text: "/cn/600519", options: { color: C.mintLite, bold: true } },
  ], {
    x: 0.5, y: 1.6, w: 9, h: 0.35,
    fontSize: 14, fontFace: "Menlo", align: "left", margin: 0,
  });

  // 兩欄：左圖右 bullets
  const detailPath = join(SHOTS, "10-stock-detail-nvda.png");
  if (existsSync(detailPath)) {
    s.addImage({
      path: detailPath,
      x: 0.5, y: 2.05, w: 4.8, h: 2.95,
      sizing: { type: "contain", w: 4.8, h: 2.95 },
    });
  }

  // bullets right
  const bullets = [
    "完整 K 線（OHLC + MA5 + MA20）",
    "11 策略個別訊號 grid",
    "AI 風險檢核 + 行動清單",
    "相似 / 相關標的推薦",
    "每頁獨立 OG image (SEO)",
    "build-time SSG · 加載秒開",
  ];
  bullets.forEach((b, i) => {
    s.addShape(pres.shapes.OVAL, {
      x: 5.6, y: 2.18 + i * 0.45, w: 0.16, h: 0.16,
      fill: { color: C.mint }, line: { color: C.mint, width: 0 },
    });
    s.addText(b, {
      x: 5.85, y: 2.1 + i * 0.45, w: 4.0, h: 0.35,
      fontSize: 13, color: C.text, fontFace: "PingFang TC", margin: 0,
    });
  });

  addFooter(s, 7);
}

// ═══════════════════════════════════════════════════════
// Slide 8 — Tech Stack
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("TECH STACK", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("完整工程鏈 · 100% 自架", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 兩欄
  // 前端
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.75, w: 4.3, h: 3.0,
    fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
  });
  s.addText("FRONTEND", {
    x: 0.7, y: 1.9, w: 3.9, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true, fontFace: "Menlo", charSpacing: 3, margin: 0,
  });
  s.addText("Next.js · TypeScript · Tailwind", {
    x: 0.7, y: 2.25, w: 3.9, h: 0.4,
    fontSize: 16, bold: true, color: C.text, fontFace: "PingFang TC", margin: 0,
  });
  const frontendItems = [
    "Recharts 3 · lightweight-charts 5",
    "framer-motion 11（scroll + parallax）",
    "lucide-react · Geist 字體",
    "next/og 動態 OG image",
    "@google/generative-ai · zod 驗證",
    "原生 Web Audio API 音效",
  ];
  frontendItems.forEach((it, i) => {
    s.addText(`›  ${it}`, {
      x: 0.7, y: 2.7 + i * 0.32, w: 3.9, h: 0.3,
      fontSize: 11, color: C.textDim, fontFace: "PingFang TC", margin: 0,
    });
  });

  // 後端
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.75, w: 4.3, h: 3.0,
    fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
  });
  s.addText("BACKEND  · _quant-terminal", {
    x: 5.4, y: 1.9, w: 3.9, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true, fontFace: "Menlo", charSpacing: 3, margin: 0,
  });
  s.addText("Python · FastAPI · Litellm", {
    x: 5.4, y: 2.25, w: 3.9, h: 0.4,
    fontSize: 16, bold: true, color: C.text, fontFace: "PingFang TC", margin: 0,
  });
  const backendItems = [
    "40+ LLM 抽象（Gemini / Claude / Ollama）",
    "8+ 資料源（efinance / AkShare / Tushare）",
    "11 策略分析器 + 回測模組",
    "6 推送通道（WeChat / Telegram / Email）",
    "GitHub Actions 每天 09:00 自動執行",
    "$0 cost · 完全免費",
  ];
  backendItems.forEach((it, i) => {
    s.addText(`›  ${it}`, {
      x: 5.4, y: 2.7 + i * 0.32, w: 3.9, h: 0.3,
      fontSize: 11, color: C.textDim, fontFace: "PingFang TC", margin: 0,
    });
  });

  s.addText("→ github.com/GKS711/_quant-terminal  ·  MIT 開源", {
    x: 0.5, y: 5.0, w: 9, h: 0.3,
    fontSize: 11, color: C.mintLite, italic: true, align: "center", fontFace: "Menlo", margin: 0,
  });

  addFooter(s, 8);
}

// ═══════════════════════════════════════════════════════
// Slide 9 — Real vs Demo (Transparency)
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addText("TRANSPARENCY", {
    x: 0.5, y: 0.4, w: 5, h: 0.3,
    fontSize: 11, color: C.mintLite, bold: true,
    fontFace: "Menlo", charSpacing: 4, margin: 0,
  });

  s.addText("即時 vs Demo · 誠實標記", {
    x: 0.5, y: 0.85, w: 9, h: 0.7,
    fontSize: 28, bold: true, color: C.text,
    fontFace: "PingFang TC", margin: 0, charSpacing: -0.5,
  });

  // 兩欄
  // 即時
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.75, w: 4.5, h: 3.2,
    fill: { color: "0d2620" }, line: { color: C.bull, width: 1 },
  });
  s.addText("✅ 即時 · 真實", {
    x: 0.7, y: 1.9, w: 4.1, h: 0.4,
    fontSize: 16, color: C.bull, bold: true,
    fontFace: "PingFang TC", margin: 0,
  });
  const realItems = [
    "12 股票 Yahoo v8 chart 真實價格",
    "30 日 OHLC sparkline · 真實日線",
    "11 策略 132 cells · 真實計算",
    "AI rationale / risks / catalysts",
    "Yahoo Finance search 真實新聞",
    "AI 顧問 chat · Gemma 4 串流",
  ];
  realItems.forEach((it, i) => {
    s.addText(`✓  ${it}`, {
      x: 0.7, y: 2.4 + i * 0.4, w: 4.1, h: 0.35,
      fontSize: 12, color: C.text, fontFace: "PingFang TC", margin: 0,
    });
  });

  // Demo
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.75, w: 4.5, h: 3.2,
    fill: { color: "2d2110" }, line: { color: "FCD34D", width: 1 },
  });
  s.addText("⚠ DEMO · 示範", {
    x: 5.4, y: 1.9, w: 4.1, h: 0.4,
    fontSize: 16, color: "FCD34D", bold: true,
    fontFace: "PingFang TC", margin: 0,
  });
  const demoItems = [
    "12 個月回測數據（mock 走勢）",
    "Sample 每日報告 markdown",
    "新聞情緒分數（簡單詞袋）",
  ];
  demoItems.forEach((it, i) => {
    s.addText(`›  ${it}`, {
      x: 5.4, y: 2.4 + i * 0.4, w: 4.1, h: 0.35,
      fontSize: 12, color: C.text, fontFace: "PingFang TC", margin: 0,
    });
  });
  s.addText("以上 DEMO 區塊頁面有黃色 chip 標示 ·\n後端 _quant-terminal 有真實版", {
    x: 5.4, y: 4.0, w: 4.1, h: 0.8,
    fontSize: 11, color: C.textDim, italic: true,
    fontFace: "PingFang TC", margin: 0,
  });

  addFooter(s, 9);
}

// ═══════════════════════════════════════════════════════
// Slide 10 — Closing
// ═══════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // 中央大標
  s.addText("從 0 到 1 ·  100% 自架", {
    x: 0.5, y: 1.0, w: 9, h: 0.85,
    fontSize: 40, bold: true, color: C.text,
    align: "center", fontFace: "PingFang TC", margin: 0, charSpacing: -1,
  });

  // tagline
  s.addText("從設計、 前端、 後端、 到 AI 整合", {
    x: 0.5, y: 1.95, w: 9, h: 0.45,
    fontSize: 18, color: C.textDim, align: "center",
    fontFace: "PingFang TC", margin: 0,
  });

  // mint accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.4, y: 2.55, w: 1.2, h: 0.04,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  // 3 chips
  const chips = ["DESIGN", "ENGINEERING", "AI INTEGRATION"];
  const chipW = 2.0, gap = 0.3;
  const totalW = chipW * 3 + gap * 2;
  const startX = (10 - totalW) / 2;
  chips.forEach((c, i) => {
    const x = startX + i * (chipW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.85, w: chipW, h: 0.5,
      fill: { color: "0d2418" }, line: { color: C.mint, width: 1 },
    });
    s.addText(c, {
      x, y: 2.85, w: chipW, h: 0.5,
      fontSize: 12, color: C.mintLite, bold: true,
      align: "center", valign: "middle",
      fontFace: "Menlo", charSpacing: 3, margin: 0,
    });
  });

  // GitHub block
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.5, y: 3.7, w: 7, h: 1.05,
    fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
  });
  s.addText("🐙  github.com/GKS711/_quant-terminal", {
    x: 1.5, y: 3.8, w: 7, h: 0.45,
    fontSize: 18, color: C.mintLite, bold: true,
    align: "center", valign: "middle", fontFace: "Menlo", margin: 0,
  });
  s.addText("MIT License · 歡迎 fork & 自架", {
    x: 1.5, y: 4.25, w: 7, h: 0.4,
    fontSize: 13, color: C.textDim,
    align: "center", fontFace: "PingFang TC", margin: 0,
  });

  // 結語
  s.addText("Built by GKS · 2026", {
    x: 0.5, y: 5.05, w: 9, h: 0.3,
    fontSize: 11, color: C.textMore,
    align: "center", fontFace: "Menlo", charSpacing: 2, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════
// Save
// ═══════════════════════════════════════════════════════
await pres.writeFile({ fileName: OUT_PPTX });
console.log("✅ Saved:", OUT_PPTX);
