type RateLimitResult = { ok: boolean };

export type RateLimitHitOptions = {
  identifier: string;
  max?: number;
  windowSeconds?: number;
  /** W produkcji bez Upstash — odrzuć żądanie zamiast przepuszczać. */
  failClosed?: boolean;
};

export async function rateLimitHit(options: RateLimitHitOptions): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[rate-limit] Brak UPSTASH_REDIS_REST_URL / TOKEN — limit wyłączony.",
        options.identifier,
      );
      if (options.failClosed) return { ok: false };
    }
    return { ok: true };
  }

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url, token });
    const max = options.max ?? 20;
    const window = options.windowSeconds ?? 60;

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${window} s`),
      analytics: false,
      prefix: "minizoo_rl",
    });

    const { success } = await ratelimit.limit(options.identifier);
    return { ok: success };
  } catch (e) {
    console.error("[rate-limit]", e);
    if (options.failClosed && process.env.NODE_ENV === "production") {
      return { ok: false };
    }
    return { ok: true };
  }
}
