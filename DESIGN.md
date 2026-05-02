# Finora Design System — "Quant Terminal"
> **由 GKS 自行設計的設計系統**
> 風格綜合：**Linear**（dark canvas + 亮度階梯）+ **Raycast**（玻璃陰影分層）+ **Bloomberg Terminal**（資訊密度 + tabular nums + 紅綠 ±%）
> 採近黑色畫布 + 薄荷綠單一強調色；數據優先、克制配色、靠亮度（不靠色彩）做層級。
> 所有 tokens、字重節律、元件規格、動效原則均為原創整理。

---

## 1. Visual Theme

Finora 採用 **dark-mode-native** 設計：在接近純黑的畫布上，靠亮度的階梯（而非色相）讓資訊浮現。薄荷綠（`#4EAA85`）是整套系統的唯一強調色，只用於 CTA、active 狀態、即時資料訊號這類高訊息密度的場景。

**Tone**: engineered precision · calm authority · premium fintech · subtly alive · 量化終端機質感 (never noisy)

**核心三柱**：
1. **Linear**（基底）：近黑畫布 `#08090a`、亮度階梯而非色相、半透明白邊框、weight 510 簽名字重
2. **Raycast**（深度）：玻璃陰影 `0 24px 60px -20px rgba(0,0,0,0.7) + inset 0 1px 0 rgba(255,255,255,0.04)` 雙層
3. **Bloomberg Terminal**（資訊密度）：tabular-nums 強制對齊、彩色 ticker 跑馬燈、紅綠對比 ±%、monospace 時間戳

---

## 2. Color Tokens

### Background luminance stack
```css
--bg-marketing:  #08090a;  /* page (Linear marketing black) */
--bg-panel:      #0f1011;  /* sidebar / nav blur layer */
--bg-elevated:   #191a1b;  /* cards, dropdowns, dialogs */
--bg-hover:      #28282c;  /* hover state */
```

### Text (cool gray ladder)
```css
--text-primary:    #f7f8f8;  /* headings, body emphasis (NOT pure white) */
--text-secondary:  #d0d6e0;  /* body, descriptions */
--text-tertiary:   #8a8f98;  /* placeholders, metadata */
--text-quaternary: #62666d;  /* timestamps, disabled */
```

### Accent (Finora identity — replaces Linear indigo)
```css
--mint-bg:     #4EAA85;  /* primary CTA bg, brand mark */
--mint-accent: #6FC298;  /* link, active, focus */
--mint-hover:  #8AD4B0;  /* hover on accent */
--mint-deep:   #2E5845;  /* deep accent surfaces */
```

### Status (sparingly)
```css
--success: #10b981;
--danger:  #E5484D;
```

### Borders (semi-transparent white only — never solid dark)
```css
--border-subtle:   rgba(255,255,255,0.05);
--border-standard: rgba(255,255,255,0.08);
--border-strong:   rgba(255,255,255,0.12);
```

---

## 3. Typography

**Family**: `Inter Variable` (with fallback to GeistSans we already loaded), Berkeley Mono / Geist Mono for numerics.

**OpenType features**: `font-feature-settings: "cv01", "ss03", "tnum"` — non-negotiable.

**Weight ladder** (the Linear secret):
- `300` — de-emphasized body (rare)
- `400` — reading body
- `510` — **signature weight**: emphasis, UI labels, navigation (between 400 and 500)
- `590` — strong emphasis, card titles

**Display sizes use aggressive negative letter-spacing**:

| Size | Weight | Tracking | Use |
|---|---|---|---|
| 72px | 510 | -1.584px | Hero |
| 64px | 510 | -1.408px | Secondary hero |
| 48px | 510 | -1.056px | Section headlines |
| 32px | 400 | -0.704px | Major titles |
| 24px | 400 | -0.288px | Sub-section |
| 20px | 590 | -0.24px | Card title |
| 18px | 400 | -0.165px | Lead paragraph |
| 15px | 400 | -0.165px | Small body |

---

## 4. Component Patterns

### Buttons

**Primary (mint)** — replaces Linear indigo
```css
bg: #4EAA85 · text: #08090a · radius: 6px · padding: 8px 16px
hover: bg #6FC298
focus: ring 2px rgba(78,170,133,0.4)
```

**Ghost / Secondary**
```css
bg: rgba(255,255,255,0.02) · text: #d0d6e0
border: 1px solid rgba(255,255,255,0.08) · radius: 6px
hover: bg rgba(255,255,255,0.05)
```

**Pill** (filter chips, regions)
```css
bg: transparent · text: #d0d6e0
border: 1px solid #23252a · radius: 9999px · padding: 0 10px
```

### Cards
```css
bg: rgba(255,255,255,0.02-0.05)  /* never solid */
border: 1px solid rgba(255,255,255,0.08)
radius: 8px (standard) | 12px (featured) | 22px (large panel)
shadow: rgba(0,0,0,0.2) 0px 0px 0px 1px
hover: bg luminance step up
```

### Inputs
```css
bg: rgba(255,255,255,0.02) · text: #d0d6e0
border: 1px solid rgba(255,255,255,0.08) · radius: 6px
padding: 12px 14px
focus: border #6FC298 · shadow ring
```

---

## 5. Layout

- Base spacing: 8px (also use 4, 7, 11, 12, 16, 19, 20, 22, 24, 28, 32, 35)
- Max content width: **1200px**
- Section vertical padding: 80px+ (mobile collapse to 48px)
- Grid: 1 / 2 / 3 columns
- **Whitespace = darkness** — no visible dividers, the void separates

### Border radius scale
- 2px — inline badges, micro toolbar
- 4px — small containers
- 6px — buttons, inputs
- 8px — cards, dropdowns
- 12px — featured panels
- 22px — large hero panels
- 9999px — pills
- 50% — icon buttons, avatars, status dots

---

## 6. Elevation (luminance, not shadow)

| Level | Treatment |
|---|---|
| 0 | Page bg `#08090a` |
| 1 | Subtle micro-shadow `rgba(0,0,0,0.03) 0px 1.2px 0px` |
| 2 | Surface `rgba(255,255,255,0.02-0.05)` + standard border |
| 2b | Inset `rgba(0,0,0,0.2) 0px 0px 12px 0px inset` |
| 3 | Ring border-as-shadow `rgba(0,0,0,0.2) 0px 0px 0px 1px` |
| 4 | Float `rgba(0,0,0,0.4) 0px 2px 4px` |
| 5 | Dialog multi-stack (5 layers) |

**Philosophy**: depth comes from luminance steps + semi-transparent borders, NOT from dark shadows on dark surfaces (those vanish). Each elevated surface = slight bg luminance increase.

---

## 7. Motion & Asset Principles (Finora extension)

Finora 的動效層比一般 dark-mode SaaS 更豐厚——黑底是舞台，動效與素材是表演：

### Motion vocabulary
- **Idle ambient**: 60s globe rotation, 2.4s hotspot pulse, 8s gradient drift
- **Reveal**: scroll-triggered fade-up + 12px y, ease `cubic-bezier(0.22, 1, 0.36, 1)`, duration 0.6-0.8s
- **Micro-interaction**: hover lift `translateY(-2px)` + border luminance step, 200ms
- **Streaming**: token-by-token typewriter for AI replies, 18-40ms per token
- **Number transition**: `framer-motion` count-up for stats, ease-out 1.4s
- **Page-level**: scroll-linked sphere zoom (scale 1 → 1.65, opacity fade-out for fg text)

### Asset budget per section
- **Hero**: globe + 9 hotspots + grid bg + radial gradient + cursor-follow gradient
- **Stats**: number animation + sparkline charts (4 cards)
- **Features**: 6 isometric SVG illustrations (one per pillar) + hover micro-animation
- **AI Demo**: streaming UI + typing indicator + token-counter visualization
- **Pricing**: scale toggle + card lift on hover
- **Footer**: subtle gradient orbit ambient

### Image / illustration sources
- **Custom SVG**: globe topology, sector icons, sparklines (lightweight, controllable)
- **Lucide icons**: status, action, navigation
- **Generated patterns**: dot grid, line grid, noise overlay (CSS background or SVG)
- **NO Unsplash photos** — they break the dark-canvas aesthetic

---

## 8. Do / Don't (critical)

### Do
- Use weight **510** for all UI labels (between 400 and 500 — Finora 的招牌字重)
- Apply negative letter-spacing at display sizes (-1.584px @ 72px down to -0.165px @ 15px)
- Use **`#f7f8f8`** for primary text (NOT `#ffffff`)
- Borders are **semi-transparent white**, never solid dark
- Buttons backgrounds at near-zero opacity (`rgba(255,255,255,0.02-0.05)`)
- Mint accent reserved for CTAs / interactive / live-data signals only
- Numbers always tabular (`font-variant-numeric: tabular-nums`)

### Don't
- Don't use pure `#ffffff` (eye strain on dark)
- Don't introduce a second accent — Finora 的強調色只有 mint `#4EAA85`
- Don't use weight 700 (max is 590)
- Don't apply mint decoratively (only interactive / CTA / live data)
- Don't introduce warm colors (palette is cool gray + mint only)
- Don't use Unsplash / stock photos (breaks dark canvas)
- Don't use drop shadows for elevation (use luminance stepping)

---

## 9. Section design briefs

### Nav
Sticky top, blur backdrop on scroll, `#0f1011` bg, links 13px weight 510 `#d0d6e0`, mint primary CTA right.

### Hero
Two-pane: left foreground = compressed display headline (72px / -1.584px / weight 510), serif-feel italic accent on key word in mint; right = 9-hotspot rotating globe with click-to-dialog.

### Stats Strip
4-cell horizontal, luminance-stepped surfaces, count-up number animation on scroll into view, tiny sparkline below each.

### Features
6 cards in 2-3 column grid, each with custom isometric SVG illustration, scroll-triggered reveal stagger 80ms.

### AI Demo
Two-pane: left intro + tech badges; right chat panel with streaming + typing indicator + token count subtle.

### Pricing
3 tiers, middle "Most popular" elevated, monthly/yearly toggle with smooth transition.

### FAQ
Accordion with smooth grid-row expansion, chevron rotate 180° on open.

### CTA
Full-width gradient panel (mint to deep mint), CTA button with cursor-follow ripple.

### Footer
Multi-column links, subtle ambient gradient orbit at bottom corner, GitHub/Twitter/LinkedIn icons.

---

Designed & built by GKS · 2026
