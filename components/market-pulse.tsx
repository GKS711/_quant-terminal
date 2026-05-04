"use client";

const SERIF = '"Iowan Old Style", "Palatino", "Georgia", serif';
const INK = "#211922";
const BULL = "#3E7A52";
const BEAR = "#A23E3E";

const MARKETS = [
  { flag: "🇹🇼", name: "台股", change: 1.42 },
  { flag: "🇺🇸", name: "美股", change: 0.83 },
  { flag: "🇭🇰", name: "港股", change: -0.51 },
  { flag: "🇨🇳", name: "A 股", change: 0.27 },
  { flag: "🇯🇵", name: "日股", change: 0.96 },
];

const TOP_OPPORTUNITIES = [
  { code: "NVDA", name: "NVIDIA", change: 7.99, signal: "AI 訊號 BUY · 30 日累漲 15.55%" },
  { code: "2330", name: "台積電", change: 3.42, signal: "MA 多頭排列 · 法人連 5 日買超" },
  { code: "TSLA", name: "Tesla", change: 5.18, signal: "MACD 黃金交叉 · 機構評等上修" },
];

const TOP_RISKS = [
  { code: "INTC", name: "Intel", change: -4.21, signal: "RSI 過熱 · 短線過漲過快" },
  { code: "0700", name: "騰訊", change: -2.85, signal: "成交量放大 · 籌碼鬆動" },
  { code: "BABA", name: "阿里", change: -3.12, signal: "跌破 MA20 · 動能轉弱" },
];

export function MarketPulse() {
  return (
    <section className="relative" style={{ background: "#FAF9F6" }}>
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 pt-20 pb-16">
        {/* Magazine masthead row */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#91918C", fontWeight: 500 }}
          >
            Vol. 1 · {new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div className="flex-1 h-px" style={{ background: "rgba(33,25,34,0.08)" }} />
          <div
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#91918C", fontWeight: 500 }}
          >
            Morning Brief · 雙語金融日報
          </div>
        </div>

        {/* Hero — magazine cover headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-4"
              style={{ color: "#A23E3E", fontWeight: 590 }}
            >
              Cover Story · 今日封面
            </div>
            <h1
              className="text-[44px] sm:text-[60px] lg:text-[76px]"
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                color: INK,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              打開就知道,
              <br />
              <span style={{ fontStyle: "italic" }}>今天該不該動。</span>
            </h1>

            <p
              className="mt-6 text-[17px] leading-[1.6] max-w-[560px]"
              style={{ color: "#62625B" }}
            >
              一份替你掃完全球 5 國市場、11 種策略訊號、24 小時新聞情緒的早報。
              我們把繁雜的圖表收進頁面深處，留下一頁讓你
              <span
                style={{
                  background: "#F2E8C9",
                  padding: "0 4px",
                  color: INK,
                }}
              >
                安靜閱讀
              </span>
              。
            </p>

            {/* AI Brief — pull quote magazine style */}
            <div
              className="mt-10 pl-6 border-l-2"
              style={{ borderColor: INK }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-2"
                style={{ color: "#91918C", fontWeight: 590 }}
              >
                AI Editor · Gemma 4 31B
              </div>
              <p
                className="text-[20px] sm:text-[24px] leading-[1.5]"
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: INK,
                }}
              >
                「美股昨夜創高，AI 半導體領漲；台股早盤可關注台積電與 NVIDIA 連動。
                港股恆生跌破 5 日均線，等反彈訊號再進場。」
              </p>
            </div>
          </div>

          {/* Right: Market index strip — vertical magazine sidebar */}
          <aside className="lg:col-span-4">
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-4"
              style={{ color: "#91918C", fontWeight: 590 }}
            >
              Index · 今日指數
            </div>
            <div className="space-y-2.5">
              {MARKETS.map((m) => {
                const isUp = m.change >= 0;
                return (
                  <div
                    key={m.name}
                    className="flex items-baseline justify-between py-2.5"
                    style={{ borderBottom: "1px solid rgba(33,25,34,0.08)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">{m.flag}</span>
                      <span
                        className="text-[15px]"
                        style={{
                          fontFamily: SERIF,
                          color: INK,
                          fontWeight: 400,
                        }}
                      >
                        {m.name}
                      </span>
                    </div>
                    <span
                      className="text-[14px] font-mono tabular-nums"
                      style={{ color: isUp ? BULL : BEAR, fontWeight: 500 }}
                    >
                      {isUp ? "+" : ""}{m.change.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* 2-column editorial: Opportunities + Risks */}
        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 pt-12"
          style={{ borderTop: "1px solid rgba(33,25,34,0.08)" }}
        >
          {/* Opportunities */}
          <article>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: BULL, fontWeight: 590 }}
            >
              Watchworthy · 值得留意
            </div>
            <h2
              className="text-[28px] mb-5"
              style={{
                fontFamily: SERIF,
                color: INK,
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              今日{" "}
              <span style={{ fontStyle: "italic" }}>三檔機會</span>
            </h2>
            <div className="space-y-5">
              {TOP_OPPORTUNITIES.map((s, i) => (
                <article key={s.code}>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-[12px] font-mono tabular-nums"
                        style={{ color: "#91918C" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-[20px]"
                        style={{
                          fontFamily: SERIF,
                          color: INK,
                          fontWeight: 400,
                        }}
                      >
                        {s.name}{" "}
                        <span
                          className="text-[14px] font-mono"
                          style={{ color: "#91918C" }}
                        >
                          / {s.code}
                        </span>
                      </h3>
                    </div>
                    <span
                      className="text-[15px] font-mono tabular-nums"
                      style={{ color: BULL, fontWeight: 500 }}
                    >
                      +{s.change.toFixed(2)}%
                    </span>
                  </div>
                  <p
                    className="text-[13px] leading-relaxed pl-7"
                    style={{ color: "#62625B" }}
                  >
                    {s.signal}
                  </p>
                </article>
              ))}
            </div>
          </article>

          {/* Risks */}
          <article>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: BEAR, fontWeight: 590 }}
            >
              Caution · 今日警示
            </div>
            <h2
              className="text-[28px] mb-5"
              style={{
                fontFamily: SERIF,
                color: INK,
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              三檔{" "}
              <span style={{ fontStyle: "italic" }}>請放慢手</span>
            </h2>
            <div className="space-y-5">
              {TOP_RISKS.map((s, i) => (
                <article key={s.code}>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-[12px] font-mono tabular-nums"
                        style={{ color: "#91918C" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-[20px]"
                        style={{
                          fontFamily: SERIF,
                          color: INK,
                          fontWeight: 400,
                        }}
                      >
                        {s.name}{" "}
                        <span
                          className="text-[14px] font-mono"
                          style={{ color: "#91918C" }}
                        >
                          / {s.code}
                        </span>
                      </h3>
                    </div>
                    <span
                      className="text-[15px] font-mono tabular-nums"
                      style={{ color: BEAR, fontWeight: 500 }}
                    >
                      {s.change.toFixed(2)}%
                    </span>
                  </div>
                  <p
                    className="text-[13px] leading-relaxed pl-7"
                    style={{ color: "#62625B" }}
                  >
                    {s.signal}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>

        {/* Footer CTA — minimal, no gradient */}
        <div
          className="mt-16 pt-8 flex flex-wrap items-center gap-3"
          style={{ borderTop: "1px solid rgba(33,25,34,0.08)" }}
        >
          <button
            className="px-6 py-2.5 rounded-full text-[13px] transition-colors"
            style={{
              background: INK,
              color: "#FAF9F6",
              fontWeight: 500,
            }}
          >
            繼續閱讀完整儀表板 →
          </button>
          <button
            className="px-6 py-2.5 rounded-full text-[13px]"
            style={{
              background: "transparent",
              color: INK,
              border: "1px solid rgba(33,25,34,0.15)",
            }}
          >
            問 AI 編輯
          </button>
          <span
            className="ml-auto text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#91918C" }}
          >
            Issue · v2.1 · Editorial
          </span>
        </div>
      </div>
    </section>
  );
}
