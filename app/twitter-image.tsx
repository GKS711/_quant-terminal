// Twitter card 跟 OG image 用同一張，next/og 自動處理。
// runtime 必須是直接的字串字面量，不能透過 re-export（Next.js 14 metadata 限制）。
export { default } from "./opengraph-image";
export const runtime = "edge";
export const alt = "每日股市儀表板 — AI 在看懂全球股票";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
