# DESIGN.md · 每日股市儀表板 v2.1

> **風格混搭**：主 **Notion**（warm neutrals + 閱讀友善 + ultra-thin borders）/ 輔 **Pinterest**（magazine layout + 暖沙色階）
> 來源：[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

## 1. 視覺氛圍

「**金融日報攤在窗邊咖啡桌**」— 不是 Bloomberg Terminal、不是 trading app、不是科技公司 dashboard，是**溫柔閱讀**的雜誌感。

- 純白底（warm white #FAF9F6）讓眼睛舒服
- 文字用 warm near-black（`rgba(33,25,34,0.95)` 帶一點 plum 色，**不用純黑**）
- ultra-thin borders（`1px solid rgba(0,0,0,0.08)`）— 結構在但幾乎看不到
- Photography / sparkline 大留白，magazine-style 排版
- 紅綠用 muted 色（不要熒光色），偏 editorial 印刷風

## 2. Color Palette

### Surface
- **Warm White** `#FAF9F6` — 主背景（帶微暖意，比純白舒服）
- **Cream** `#F5F4EF` — 次層卡片（warm sand 微差）
- **Warm Border** `rgba(33,25,34,0.08)` — 通用邊框，whisper-weight

### Text
- **Plum Near-Black** `rgba(33,25,34,0.95)` — 主文字（warm dark，不是純黑）
- **Olive Gray 600** `#62625B` — 副文字（暖灰）
- **Olive Gray 400** `#91918C` — 提示 / 圖說
- **Olive Gray 300** `#A39E98` — disabled / 占位

### Brand Accent（**節制**，每段最多 1 處）
- **Editorial Ink** `#211922` — primary，深 plum 黑當主 accent
- **Editorial Red** `#A23E3E` — 跌（暖磚紅，不是螢光紅）
- **Editorial Green** `#3E7A52` — 漲（深苔蘚綠，不是 mint 不是螢光綠）
- **Highlight Yellow** `#F2E8C9` — 重點背景（雜誌標籤紙感）
- **Indigo Pop** `#3B4F8C` — 連結 / interactive accent（莫蘭迪藍）

### Status (Muted)
- **Bull Soft** `#3E7A52` (深綠 muted)
- **Bear Soft** `#A23E3E` (磚紅 muted)
- **Warn Sand** `#C18A3D` (赭色，不是橘)

## 3. Typography（雜誌排版）

### 字型
- **Headline**: 系統 serif (`"Iowan Old Style", "Palatino", "Georgia", serif`) — **重點：標題用 serif**，這是雜誌風的關鍵
- **Body**: Geist Sans 已有的，body 跟導覽用 sans
- **Numerals**: Geist Mono（`tabular-nums` 必開）

### Hierarchy

| Role | Font | Size | Weight | Line | Letter |
|---|---|---|---|---|---|
| Display Hero | **serif** | 56-72px | 400 (regular) | 1.05 | -0.02em |
| Section Headline | **serif** | 32-40px | 400 | 1.15 | -0.01em |
| Sub-heading | **serif italic** | 22-26px | 400 italic | 1.25 | normal |
| Body Lead | sans | 18px | 400 | 1.55 | normal |
| Body | sans | 15px | 400 | 1.6 | normal |
| Small Label | sans | 11-12px | 500 | 1.4 | 0.04em uppercase |
| Numeric | mono `tnum` | varies | 500 | 1.0 | tracking-tight |

**核心**：headline 用 **serif italic** 是雜誌靈魂，不要用 sans-serif。

## 4. Spacing & Shape

### Spacing scale (8px base)
8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

### Border radius
- **Cards**: `16px` (Pinterest-warm radius)
- **Buttons**: `9999px`（pill）or `8px`
- **Tags / chips**: `999px` pill
- **Images / sparkline**: `4px` 微圓

### Shadow（whisper-weight，借 Notion）
```css
box-shadow:
  rgba(33,25,34,0.04) 0px 4px 18px,
  rgba(33,25,34,0.02) 0px 2px 7.8px,
  rgba(33,25,34,0.01) 0px 0.8px 2.9px;
```
**禁止**：glow / saturated 光暈 / neon shadow（那是 AI 味）

## 5. Component Patterns

- **Card**: `#FAF9F6` 或白底，1px whisper border，16px radius，24px padding，whisper shadow
- **Primary Button**: 實心 `#211922`，文字白，pill or 8px
- **Secondary Button**: outline-only `1px solid rgba(33,25,34,0.15)`
- **Tag**: pill bg `#F5F4EF`，selected → bg `#211922` text `#FAF9F6`
- **Stock card**: 不要 emoji，price 用 mono tnum，漲跌 muted，sparkline 1px thin
- **Magazine section**: eyebrow（小寫小字 letter-spacing 0.2em）→ serif headline → italic sub → body lead

## 6. 動畫 / 互動

- 慢、輕（Notion 風） — `cubic-bezier(0.21, 0.61, 0.35, 1)` 0.3-0.5s
- ❌ 沒有 ping pulse / 沒有 LIVE 紅點動畫（雜誌不會閃）
- hover: 微抬 `translateY(-2px)` + shadow 加深一階
- focus: 暖灰 outline `2px solid rgba(33,25,34,0.2)`

## 7. 七條準則

1. 背景永遠是 **warm white**，不是純黑不是純白
2. **Headline 用 serif italic** — 雜誌靈魂
3. Borders 是 whisper — 看得到結構但不顯眼
4. 紅綠 **muted** — 不要螢光，要印刷雜誌色
5. 每個 section 最多 **1 個 accent** — 雜誌不喧鬧
6. **大量留白** — 不要 grid 塞滿
7. 數字用 **mono `tabular-nums`** — 對齊乾淨

## 8. 不允許的（避開 AI 味）

- ❌ 漸層背景（gradient overlay）
- ❌ Glow shadow / neon
- ❌ 螢光綠 / 螢光紅 / 金黃 accent（之前 v2.0 那套）
- ❌ Sparkle ✦ icon（太 AI）
- ❌ Marquee / 跑馬燈 ping pulse
- ❌ 飽和 saturated 大塊色
- ❌ 暗色模式 default（v2.1 主打 light mode 雜誌風）

## 9. Dark mode（次要，以後做）

- bg: `#1A1614`（warm dark with plum，不是純黑）
- text: `#F5F4EF`
- border: `rgba(255,255,255,0.06)`

---

**版本**：v2.1
**作者**：GKS (rule-based heuristic, MIT licensed)
**對標**：FT Online · The Atlantic · Substack · Notion · Pinterest editorial sections
