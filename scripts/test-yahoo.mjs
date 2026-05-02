import YahooFinance from "yahoo-finance2";
const yf = new YahooFinance();
try {
  const q = await yf.quote("AAPL");
  console.log("✅ quote ok:", q.regularMarketPrice, q.shortName);
} catch (e) { console.log("❌ quote fail:", e.message); }

try {
  const h = await yf.historical("AAPL", { period1: "2026-03-26", period2: "2026-04-26", interval: "1d" });
  console.log("✅ historical ok:", h.length, "days, last close:", h[h.length-1]?.close);
} catch (e) { console.log("❌ historical fail:", e.message); }
