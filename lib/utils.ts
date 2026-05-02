import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 預設 TWD，符合台股題材；可傳入其他幣別。 */
export function formatCurrency(n: number, currency = "TWD") {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "TWD" ? 0 : 2,
  }).format(n);
}

export function formatPercent(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

/** 把絕對股價 + 持有股數 → 部位市值 */
export function positionValue(price: number, shares: number) {
  return Math.round(price * shares);
}
