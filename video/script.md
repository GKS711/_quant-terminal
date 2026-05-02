# 每日股市儀表板 — 90 秒作品介紹影片腳本

> **總長**：90 秒（可彈性 80-95s）
> **解析度**：建議 1920×1080（橫式 LinkedIn / YouTube）或 1080×1920（直式 IG Reels）
> **錄影方式**：Mac `Cmd + Shift + 5` → 「錄製選定部分」，先把瀏覽器視窗 maximize 到 1920×1080
> **語速**：自然說話速度（每秒約 3.5 字）
> **小字提示**：旁白句子有用 `\` 表示「該停 0.3 秒換氣」

---

## 🎬 Scene 1 — 開場 Hook（0:00 – 0:10）

**畫面**：
- 起手在 **首頁 Hero**，spotlight 卡片正在輪播（任一檔都行，建議停在 NVDA）
- 不要點任何東西，就讓 sparkline 描繪 + 卡片切換的動畫自然跑完一輪

**旁白**（35 字 · 約 10s）：
> 嗨，我是 GKS。\
> 這是我做的 **每日股市儀表板** ——\
> 一個自動掃 4 國股市、 用 AI 給你決策參考的儀表板。

**字幕（簡）**：
> 每日股市儀表板 · AI 多市場量化分析儀表板 / 由 GKS 從 0 到 1 自行設計實作

**後製動畫建議**：
- 0:00 – 0:02 logo「每日股市儀表板」淡入左上角（後面會持續放 watermark）
- 0:08 字幕「每日股市儀表板」浮現於畫面中下方，mint 綠色

---

## 🎬 Scene 2 — 多市場 + 真實數據（0:10 – 0:25）

**畫面**：
- Scroll 下到 **Decision Terminal**（首頁第 2 屏）
- 慢慢滑動 6 秒，露出 12 張卡片
- 點上方「美股 · 4」filter chip → 卡片重排
- 再點「全部 · 12」回來

**旁白**（50 字 · 約 14s）：
> 12 檔精選股、分布在台股、美股、港股、A 股。\
> 每張卡片都接 Yahoo Finance 真實報價，\
> 後面跟著 30 天 K 線、 跟 AI 給的買、持、或賣訊號。

**字幕（簡）**：
> 12 檔 · 4 市場 · 真實 Yahoo Finance 報價 + AI 共識訊號

**後製動畫建議**：
- 0:12 標出 4 個 market chip 的圈圈動畫（mint 描邊）
- 0:18 框住其中一張卡片（例如 NVDA），標示「Real-time Quote」+「30d Sparkline」+「AI Signal」三個小箭頭
- 0:22 數字浮現「Yahoo Finance × Gemma 4」

---

## 🎬 Scene 3 — 深度詳情頁（0:25 – 0:45）

**畫面**：
- 點 **NVDA** 卡片 → 出 dialog → 點「**查看完整頁面 →**」進詳情頁 `/us/nvda`
- 詳情頁停 2 秒看 hero（大字 NVDA、價格、sparkline）
- Scroll 往下 5 秒：看 K 線圖、AI rationale、風險檢核、行動清單
- 繼續 scroll 看 11 策略 signal grid
- 最後 scroll 看 related stocks

**旁白**（70 字 · 約 18s）：
> 點進去任一檔， 你會看到\
> 正規 K 線、 加上 MA5、 MA20 移動平均線。\
> 11 種策略——\
> 技術面 7 種、 基本面跟風險加起來 4 種——\
> 全部是用真實 OHLC 數據算出來的，不是我寫死的。

**字幕（簡）**：
> 完整 K 線 × MA5/20 × 11 策略真實計算

**後製動畫建議**：
- 0:28 點擊動效：滑鼠 click ripple + 按鈕亮一下
- 0:32 K 線出來時，標示 MA5（mint）+ MA20（黃）兩條線
- 0:36 11 策略 grid 進場時 stagger highlight，框出「均線多頭」、「RSI 動能」、「MACD」三個方塊
- 0:42 文字浮現「7 + 4 = 11 strategies, all from real OHLC」

---

## 🎬 Scene 4 — AI 顧問即時串流（0:45 – 1:00）

**畫面**：
- 回首頁 → scroll 到 **AI 顧問** section
- 點任一個建議按鈕（推薦點「**2330 現在該追嗎？**」或「**NVDA 跟 AAPL 比，哪個 AI 共識比較強？**」）
- **錄完整 12 秒**讓 token 串流出來（Gemma 4 大概 8-10 秒生完）

**旁白**（45 字 · 約 13s）：
> AI 顧問接的是 Google 的 Gemma 4 31B 模型，\
> 不是預先寫好的回答。\
> 我把 12 檔的真實價格跟策略訊號塞進 system prompt，\
> 它會直接引用真實數字。

**字幕（簡）**：
> 真打 Gemma 4 31B · 即時串流 · 引用真實 snapshot 數據

**後製動畫建議**：
- 0:46 標示「LIVE」綠色 badge 在畫面右上
- 0:48 在 streaming 開始時加 typewriter 音效（很輕，可選）
- 0:52 浮現「gemma-4-31b-it · token 串流中」字樣
- 0:58 重點圈出回答中真實出現的「$208.26」「+15.55%」這種真實數字

---

## 🎬 Scene 5 — 技術棧 + 後端（1:00 – 1:15）

**畫面**：
- Scroll 到 **How It Works** 5 階段流水線（資料 → 策略 → LLM → 決策 → 推送）
- 慢慢看每個節點 2 秒
- 然後 scroll 到 **技術棧 6 卡**

**旁白**（50 字 · 約 14s）：
> 後端是另一個 GitHub repo——\
> Python 寫的、 8 個資料源、 6 個推送通道，\
> 每天 9 點靠 GitHub Actions 自動跑，\
> 完全免費。

**字幕（簡）**：
> Python × Litellm × GitHub Actions · 0 維護成本 · 完全開源

**後製動畫建議**：
- 1:01 流水線出現時，每個節點 stagger 進場（300ms 間隔），中間箭頭跟著動
- 1:08 切到技術棧時，6 個 icon 同時 fade-up
- 1:12 浮現 GitHub URL「github.com/GKS711/_quant-terminal」並 highlight

---

## 🎬 Scene 6 — 收尾 / Call to Action（1:15 – 1:30）

**畫面**：
- 回到首頁頂部 hero（hard scroll to top）
- 停在 hero 完整顯示的畫面，sparkline 卡片繼續輪播
- 最後 3 秒疊加 GitHub URL 跟 QR code（後製加）

**旁白**（45 字 · 約 13s）：
> 從設計、 前端、 後端、 到 AI 整合，\
> 全部我自己做的、 全部 MIT 開源。\
> 如果你想看完整 source code，\
> GitHub 連結放下面。

**字幕（簡）**：
> 100% 開源 · MIT License · github.com/GKS711

**後製動畫建議**：
- 1:18 浮現 3 個 chip：「DESIGN」「ENGINEERING」「AI INTEGRATION」依序出來
- 1:23 整個畫面慢慢 dim 70%
- 1:25 中央放大 logo「每日股市儀表板」+ tagline「by GKS · 2026」
- 1:28 GitHub QR code（200×200）淡入畫面右下
- 1:29 → 黑屏 + URL 文字「github.com/GKS711/_quant-terminal」

---

## 📋 錄影前快速 checklist

```
□ 瀏覽器拉到 1920×1080 全螢幕
□ 關閉 macOS 通知（避免錄到亂入彈窗）
□ 關閉其他 tab，只留 http://localhost:3000
□ 確認 dev server 在跑：curl http://localhost:3000
□ 滑鼠移到畫面外（不出現在錄影裡）
□ 用 Chrome / Safari 都行，但建議 Chrome
□ macOS 錄影：Cmd + Shift + 5 → 錄製選定部分 → 框出視窗
□ 第一次失敗別怕，重錄就好
```

## 🎙 錄旁白 3 種選擇

| | 成本 | 品質 | 推薦給 |
|---|---|---|---|
| **你自己錄音**（手機 / AirPods 麥克風）| 免費 | 自然有溫度 | **首選**——作品集就是介紹自己，你聲音最對 |
| **macOS 內建 say 中文女聲**（`say -v Mei-Jia`）| 免費 | 機械感重，但清晰 | 不想露聲音時 |
| **ElevenLabs 中文聲音克隆** | $5/月起 | 最自然 | 想做更專業 production |

---

## 🚀 錄完之後給我

**只要 3 樣**：
1. 影片檔（建議 .mov / .mp4，1080p 即可）
2. 旁白音軌（如果你錄的，給 .m4a 或 .mp3）
3. 想用橫式（YT/LinkedIn）還是直式（IG/抖音）？或都要？

放到 `/Users/gankaisheng/VScode/claude實作2/finora-clone/video/` 資料夾任一處告訴我路徑。

我會幫你做：
- ✅ 卡掉 NG 段落、串接乾淨
- ✅ 字幕燒入（mint 綠色 + 黑色描邊，跟品牌一致）
- ✅ 加片頭（每日股市儀表板 logo + tagline，2.5s）
- ✅ 加片尾（QR code + GitHub URL，3s）
- ✅ 加背景音樂（從 Pixabay 推 3 首免版稅，你選）
- ✅ 場景之間的 cross-fade 轉場
- ✅ 重點數字浮現動畫（如 12 檔 / 4 市場 / 11 策略）
- ✅ 三版輸出：橫式 1920×1080、直式 1080×1920、方形 1080×1080（IG 貼文）

---

## 🪶 完整旁白（一次抓走給你跑詞）

```
嗨，我是 GKS。
這是我做的 每日股市儀表板 ——
一個自動掃 4 國股市、用 AI 給你決策參考的儀表板。

12 檔精選股、分布在台股、美股、港股、A 股。
每張卡片都接 Yahoo Finance 真實報價，
後面跟著 30 天 K 線、跟 AI 給的買、持、或賣訊號。

點進去任一檔，你會看到
正規 K 線、加上 MA5、MA20 移動平均線。
11 種策略——
技術面 7 種、基本面跟風險加起來 4 種——
全部是用真實 OHLC 數據算出來的，不是我寫死的。

AI 顧問接的是 Google 的 Gemma 4 31B 模型，
不是預先寫好的回答。
我把 12 檔的真實價格跟策略訊號塞進 system prompt，
它會直接引用真實數字。

後端是另一個 GitHub repo ——
Python 寫的、8 個資料源、6 個推送通道，
每天 9 點靠 GitHub Actions 自動跑，
完全免費。

從設計、前端、後端、到 AI 整合，
全部我自己做的、全部 MIT 開源。
如果你想看完整 source code，
GitHub 連結放下面。
```

**全文 290 字** · 自然語速約 87 秒。
