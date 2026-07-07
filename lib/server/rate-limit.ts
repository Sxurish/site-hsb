// Rate limit em memória — suficiente pra single-instance.
// Para produção multi-region, troque por Upstash/Redis.

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = { ok: boolean; retryAfter?: number };

export function createRateLimiter(max: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();
  let nextSweepAt = 0;

  // Sweep amortizado: sem isso o Map cresce um registro por IP até a
  // instância reciclar (memory leak lento explorável por IP spoofing/botnet).
  function sweep(now: number) {
    if (now < nextSweepAt) return;
    nextSweepAt = now + windowMs;
    buckets.forEach((b, key) => {
      if (now > b.resetAt) buckets.delete(key);
    });
  }

  return function rateLimit(key: string): RateLimitResult {
    const now = Date.now();
    sweep(now);
    const b = buckets.get(key);
    if (!b || now > b.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true };
    }
    if (b.count >= max) {
      return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
    }
    b.count += 1;
    return { ok: true };
  };
}
