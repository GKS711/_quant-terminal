# DESIGN.md · 每日股市儀表板 v2.2

> **風格**：Cinematic Dark（NVIDIA × RunwayML 混搭）
> 來源：[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) + 9 aesthetic families framework from [rohitg00/awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)

## 1. 視覺氛圍

「**電影預告片黑底打開的瞬間**」— 全黑底、超大字、電影級對比、無 shadow 干擾。讓資料像電影海報，每張卡都是一幀。

- 全黑背景（`#000000` / `#0A0A0A` / `#1A1A1A` 三層深淺）
- 超大字 + 緊密 line-height（1.0–1.1）+ 負字距（-1px ~ -1.5px）
- 單一 sans-serif（Inter/Geist 替代 abcNormal/NVIDIA-EMEA），同字型完成所有 hierarchy
- **零 shadow / 邊框幾乎隱形**（`#27272A` 1px，dim）
- 一個 saturated accent — Cinematic Amber `#FF6B00`（電影火光，不是 mint 不是螢光）
- 紅綠用 **muted 深色版**（不是螢光）

## 2. Color Palette

### Surface（黑深淺三層）
- **True Black** `#000000` — 主背景，最大對比
- **Deep Black** `#0A0A0A` — 次層卡片
- **Surface Dark** `#1A1A1A` — 第三層 elevated card
- **Border Dim** `#27272A` — 唯一邊框色，1-2px sharp（不要圓角太多）

### Text
- **Pure White** `#FFFFFF` — 主標題 / hero
- **Cool Silver** `#C9CCD1` — 副文字 / lead paragraph
- **Cool Slate** `#767D88` — caption / metadata（cool blue-gray，不是純灰）
- **Muted Gray** `#5E5E5E` — disabled / placeholder

### Accent — One Saturated Color Only
- **Cinematic Amber** `#FF6B00` — CTA / hover / active / link 唯一 accent
- **Amber Hover** `#FF8533` — hover 較亮
- **Amber Soft** `#1F1006` — accent 卡片底（amber 4% mix on black）

### Status — Muted, Not Neon
- **Bull Dark** `#3F8500` — 漲（深苔蘚綠，**不是 mint，不是螢光**）
- **Bear Crimson** `#E5484D` — 跌（深紅，cinematic）
- **Warn Orange** `#DF6500` — 警示（橙）

## 3. Typography（電影感大字）

### 字型
- **Display + Body**: Geist Sans（已有）— 替代 abcNormal/NVIDIA-EMEA
- **Numerals**: Geist Mono（`tabular-nums` 必開，`-0.02em` letter-spacing）

### Hierarchy（**緊 line-height 1.0** + 負字距）

| Role | Size | Weight | Line | Letter |
|---|---|---|---|---|
| Display / Hero | 80–96px | 500 | **1.00** (tight) | **-1.2px** to -1.5px |
| Section Heading | 48–64px | 500 | 1.0 | -1.0px |
| Sub-heading | 32–40px | 400 | 1.05 | -0.6px |
| Card Title | 20–24px | 600 | 1.05 | normal |
| Body Lead | 18px | 400 | 1.5 | -0.2px |
| Body | 15–16px | 400 | 1.4 | -0.16px |
| **Label uppercase** | 11–12px | 500 | 1.3 | **0.35px** uppercase |
| Numeric | mono `tnum` | 500 | 1.0 | -0.02em |

**核心**：display 字級**緊**到像 film title，**沒有**呼吸空間。

## 4. Spacing & Shape

- spacing scale：8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192
- **Border radius 小**：cards 4–6px（**不是 16px**），buttons 4px or 0px sharp
- **Zero shadow**（RunwayML 風）— 或最多 `0 0 0 1px #27272A` outline
- **大量留白**（cinematic letterboxing） + full-bleed 大區塊

## 5. Component Patterns

### Card
- bg: `#0A0A0A` or `#1A1A1A`
- border: `1px solid #27272A`
- radius: `4-6px` sharp
- padding: `24-32px`
- **沒有 shadow**

### Button
- **Primary**: bg `#FF6B00` text white sharp 4px radius
- **Secondary**: outline `1px solid #27272A`，text white
- **Ghost**: 純文字 + amber underline on hover

### Section Eyebrow
```
LABEL UPPERCASE 0.35px tracking · color: #767D88
─────────────
DISPLAY HEADLINE 80-96px white -1.2px tracking
Sub-heading 32px Cool Silver
```

### Stock card
- 黑底，1px dim border
- price 用 mono tnum + 大字
- 漲跌用 muted 紅綠 + arrow icon
- 沒有 sparkle / glow

## 6. 動畫 / 互動

- 慢、film-frame 般 — `cubic-bezier(0.16, 1, 0.3, 1)` 0.4-0.6s
- hover: amber underline 出現 + 微改變透明度（不是抬升不是 glow）
- focus: 2px solid amber outline
- ❌ 沒有 ping pulse / 沒有 LIVE 紅點
- ✅ 大區塊 fade-up（cinematic）

## 7. 七條準則

1. **背景全黑** — `#000000` / `#0A0A0A` / `#1A1A1A`
2. **字大、字緊** — display 80-96px line-height 1.0 -1.2px tracking
3. **單一字型完成全部 hierarchy** — 用 size/weight/case 區別不換字
4. **零 shadow / 邊框 dim 1px** — 介面隱形
5. **一個 accent 色** — Cinematic Amber `#FF6B00`，**沒有別的 saturated color**
6. **紅綠 muted 深色** — `#3F8500` 漲（深苔蘚）、`#E5484D` 跌
7. **大量留白 + full-bleed** — cinematic letterboxing

## 8. 禁止（避免回到之前風格）

- ❌ 編輯雜誌 serif headline（v2.1 Notion 風）
- ❌ 暖白 warm white 背景（v2.1）
- ❌ 深藍 navy + 金 + 桃紅（v2.0）
- ❌ Mint AI 綠 #4EAA85（v1）
- ❌ Glow shadow / pulse / sparkle / gradient overlay
- ❌ 多 accent 色 — 只有 amber 一個
- ❌ Border radius > 8px（cinematic 偏 sharp）
- ❌ Light mode default

## 9. 對標

- **NVIDIA**：industrial typography，high-contrast，sharp engineering corners
- **RunwayML**：cinematic full-bleed，editorial magazine layout，zero shadow，single typeface
- **混搭**：NVIDIA 的 dense 對比 + RunwayML 的 full-bleed 留白 + 一個 amber accent 取代 NVIDIA 螢光綠

---

**版本**：v2.2 Cinematic Dark
**作者**：GKS
**rohitg00 美學家族**：Cinematic Dark（家族 #5）
**換掉的**：v2.1 Notion editorial（跟 InsightX 衝）、v2.0 Webull 大膽當代、v1 mint AI 綠
