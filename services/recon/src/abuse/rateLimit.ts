interface RequestTimestamp {
  timestamps: number[];
}

class RateLimiter {
  private ipLimits = new Map<string, RequestTimestamp>();
  private hostLimits = new Map<string, RequestTimestamp>();

  private readonly maxPerIpPerMin: number;
  private readonly maxPerHostPerMin: number;
  private readonly windowMs: number;

  constructor(maxPerIp = 5, maxPerHost = 2, windowMs = 60_000) {
    this.maxPerIpPerMin = maxPerIp;
    this.maxPerHostPerMin = maxPerHost;
    this.windowMs = windowMs;
  }

  public check(
    clientIp: string,
    targetHost: string,
    now: number = Date.now()
  ): { allowed: boolean; reason?: string; retryAfterSeconds?: number } {
    const normalizedIp = clientIp.trim().toLowerCase();
    const normalizedHost = targetHost.trim().toLowerCase();
    const windowStart = now - this.windowMs;

    // Check IP rate limit
    const ipRecord = this.ipLimits.get(normalizedIp) || { timestamps: [] };
    const validIpTimestamps = ipRecord.timestamps.filter((t) => t > windowStart);
    if (validIpTimestamps.length >= this.maxPerIpPerMin) {
      const oldest = validIpTimestamps[0];
      const retryAfter = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        reason: `Client IP rate limit exceeded (${this.maxPerIpPerMin} req/min). Please slow down.`,
        retryAfterSeconds: Math.max(1, retryAfter),
      };
    }

    // Check target host rate limit
    const hostRecord = this.hostLimits.get(normalizedHost) || { timestamps: [] };
    const validHostTimestamps = hostRecord.timestamps.filter((t) => t > windowStart);
    if (validHostTimestamps.length >= this.maxPerHostPerMin) {
      const oldest = validHostTimestamps[0];
      const retryAfter = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        reason: `Target domain rate limit reached (${this.maxPerHostPerMin} req/min for ${normalizedHost}).`,
        retryAfterSeconds: Math.max(1, retryAfter),
      };
    }

    // Record usage
    validIpTimestamps.push(now);
    this.ipLimits.set(normalizedIp, { timestamps: validIpTimestamps });

    validHostTimestamps.push(now);
    this.hostLimits.set(normalizedHost, { timestamps: validHostTimestamps });

    return { allowed: true };
  }

  public reset(): void {
    this.ipLimits.clear();
    this.hostLimits.clear();
  }
}

export const rateLimiter = new RateLimiter();
export { RateLimiter };
