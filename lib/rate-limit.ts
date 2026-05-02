/**
 * 簡易 in-memory rate limiter（per-IP token bucket）
 *
 * 注意：Next.js 在 dev 時是單一 Node 進程，prod (Vercel) 是 serverless 函式
 * → Vercel 上每個 invocation 有獨立 memory，這個 limiter 在 prod 「best-effort」
 * 不會精確 throttle 所有跨 cold start 的請求，但能擋掉同一個 lambda warm 階段內的暴衝
 *
 * 對於作品集 demo 防止單人 abuse 已足夠；正式上線應換 Vercel KV / Upstash Redis
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitConfig {
  /** 每秒回填多少 token */
  refillRate: number;
  /** 桶的最大容量 */
  capacity: number;
}

/**
 * 嘗試消耗一個 token。回傳 true = 通過、false = 被擋
 * @param key 通常是 IP（X-Forwarded-For）
 */
export function checkRateLimit(key: string, config: RateLimitConfig): {
  ok: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: config.capacity, lastRefill: now };

  // 補滿 token（time elapsed × refill rate）
  const elapsedSec = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(
    config.capacity,
    bucket.tokens + elapsedSec * config.refillRate,
  );
  bucket.lastRefill = now;

  let ok = false;
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    ok = true;
  }
  buckets.set(key, bucket);

  // 估計下次補到 1 個 token 需要的毫秒
  const resetMs = ok
    ? 0
    : Math.ceil(((1 - bucket.tokens) / config.refillRate) * 1000);

  return { ok, remaining: Math.floor(bucket.tokens), resetMs };
}

/**
 * 從 Next.js Request 抓 IP，簡單版（信任 x-forwarded-for 第一段）
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "anonymous";
}

/** 預設配置 */
export const RATE_LIMIT_CHAT: RateLimitConfig = {
  refillRate: 0.2,    // 每 5 秒回填 1 token
  capacity: 5,        // burst 5 次後就要等待
};

export const RATE_LIMIT_ANALYZE: RateLimitConfig = {
  refillRate: 0.1,    // 每 10 秒回填 1 token
  capacity: 4,        // burst 4 次
};

/** 簡單清理 — 每 1000 個 key 觸發一次清理（移除 1 小時沒用過的）*/
export function cleanupOld() {
  if (buckets.size < 1000) return;
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [k, v] of buckets) {
    if (v.lastRefill < cutoff) buckets.delete(k);
  }
}
