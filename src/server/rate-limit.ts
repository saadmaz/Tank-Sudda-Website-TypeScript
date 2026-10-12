import "server-only";

/**
 * Best-effort, in-memory sliding-window rate limiter. It protects a single
 * server instance; on serverless or multi-instance hosting each instance keeps
 * its own window, so use a shared store (e.g. Redis/Upstash) if abuse appears.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5_000,
}: {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}) {
  const hits = new Map<string, number[]>();
  return {
    /** Records a hit and returns whether the caller is within the limit. */
    check(key: string, now: number = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.delete(key);
      hits.set(key, recent);
      if (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      return true;
    },
  };
}

export const leadRateLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1_000 });
