// Twitter card 跟 OG image 用同一張。
// runtime 必須是直接字串字面量（Next.js 14 metadata 限制，不接受 re-export）。
export { default } from "./opengraph-image";
export const runtime = "edge";
export const alt = "Stock detail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
