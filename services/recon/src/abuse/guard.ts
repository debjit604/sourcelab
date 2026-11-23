import http from "http";
import { verifyTurnstileToken } from "./turnstile";
import { defaultBlocklist } from "./blocklist";
import { rateLimiter } from "./rateLimit";
import { globalConcurrency } from "./concurrency";
import { auditLogger } from "./logger";

export interface AbuseCheckResult {
  allowed: boolean;
  status?: number;
  error?: string;
  headers?: Record<string, string>;
}

export async function checkSnapshotAbuse(
  req: http.IncomingMessage,
  targetUrl: string,
  turnstileToken?: string,
  turnstileSecret?: string
): Promise<AbuseCheckResult> {
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "127.0.0.1";

  // 1. Turnstile verification
  const turnstileRes = await verifyTurnstileToken(turnstileToken, clientIp, turnstileSecret);
  if (!turnstileRes.success) {
    return {
      allowed: false,
      status: 403,
      error: turnstileRes.error || "Turnstile verification failed. Please complete the captcha.",
    };
  }

  // 2. Parse target host
  let targetHost = "";
  try {
    targetHost = new URL(targetUrl).hostname;
  } catch {
    return { allowed: false, status: 400, error: "Invalid target URL" };
  }

  // 3. Blocklist check (.gov, .mil, and opt-outs)
  const blockCheck = defaultBlocklist.check(targetHost);
  if (blockCheck.blocked) {
    return {
      allowed: false,
      status: 403,
      error: blockCheck.reason || "Target domain is blocked by security policy.",
    };
  }

  // 4. Rate limiting (per IP and per host)
  const rateCheck = rateLimiter.check(clientIp, targetHost);
  if (!rateCheck.allowed) {
    return {
      allowed: false,
      status: 429,
      error: rateCheck.reason || "Rate limit exceeded. Please wait before retrying.",
      headers: rateCheck.retryAfterSeconds
        ? { "Retry-After": String(rateCheck.retryAfterSeconds) }
        : undefined,
    };
  }

  // 5. Concurrency cap
  if (!globalConcurrency.tryAcquire()) {
    return {
      allowed: false,
      status: 429,
      error: "Recon server capacity reached (max 2 concurrent browser scans). Please retry shortly.",
    };
  }

  // 6. Audit logging (target host + timestamp + hashed client IP)
  auditLogger.logScan(targetHost, clientIp);

  return { allowed: true };
}
