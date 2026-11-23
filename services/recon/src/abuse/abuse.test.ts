import { describe, it, expect, beforeEach } from "vitest";
import http from "http";
import { verifyTurnstileToken } from "./turnstile";
import { RateLimiter } from "./rateLimit";
import { OptOutBlocklist } from "./blocklist";
import { ConcurrencyManager } from "./concurrency";
import { AbuseAuditLogger } from "./logger";
import { checkSnapshotAbuse } from "./guard";

describe("Abuse Controls Test Suite", () => {
  describe("Turnstile Token Verification", () => {
    it("bypasses in test mode", async () => {
      const res = await verifyTurnstileToken("valid-token", "1.2.3.4", "test-secret");
      expect(res.success).toBe(true);
    });

    it("rejects explicitly invalid token in test mode", async () => {
      const res = await verifyTurnstileToken("invalid-token", "1.2.3.4", "test-secret");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Invalid test turnstile token");
    });
  });

  describe("Rate Limiting", () => {
    let limiter: RateLimiter;

    beforeEach(() => {
      limiter = new RateLimiter(5, 2, 60_000);
    });

    it("allows up to 5 requests per IP", () => {
      const now = 1000000;
      for (let i = 0; i < 5; i++) {
        const res = limiter.check("1.2.3.4", `domain-${i}.com`, now);
        expect(res.allowed).toBe(true);
      }

      const res6 = limiter.check("1.2.3.4", "another-domain.com", now);
      expect(res6.allowed).toBe(false);
      expect(res6.reason).toContain("Client IP rate limit exceeded");
    });

    it("allows up to 2 requests per target domain", () => {
      const now = 1000000;
      expect(limiter.check("1.1.1.1", "target.com", now).allowed).toBe(true);
      expect(limiter.check("2.2.2.2", "target.com", now).allowed).toBe(true);

      const res3 = limiter.check("3.3.3.3", "target.com", now);
      expect(res3.allowed).toBe(false);
      expect(res3.reason).toContain("Target domain rate limit reached");
    });

    it("resets limits when window passes", () => {
      const now = 1000000;
      expect(limiter.check("1.2.3.4", "target.com", now).allowed).toBe(true);
      expect(limiter.check("1.2.3.4", "target.com", now).allowed).toBe(true);
      expect(limiter.check("1.2.3.4", "target.com", now).allowed).toBe(false);

      // Advance by 61 seconds
      expect(limiter.check("1.2.3.4", "target.com", now + 61_000).allowed).toBe(true);
    });
  });

  describe("Opt-Out & Restricted Domain Blocklist", () => {
    let blocklist: OptOutBlocklist;

    beforeEach(() => {
      blocklist = new OptOutBlocklist(["opted-out.com"]);
    });

    it("blocks .gov and .mil domains by default", () => {
      expect(blocklist.check("nasa.gov").blocked).toBe(true);
      expect(blocklist.check("defense.mil").blocked).toBe(true);
      expect(blocklist.check("sub.india.gov.in").blocked).toBe(true);
      expect(blocklist.check("mod.uk").blocked).toBe(true);
    });

    it("blocks explicitly opted-out domains and subdomains", () => {
      expect(blocklist.check("opted-out.com").blocked).toBe(true);
      expect(blocklist.check("api.opted-out.com").blocked).toBe(true);
    });

    it("blocks domains by SHA-256 hash", () => {
      // sha256("secret-domain.org") = d0054817a8c3d820b9e8a75e18ef9bcf9fb3d3761352f7f18b3cb9f64c636f45
      blocklist.addDomain("secret-domain.org");
      expect(blocklist.check("secret-domain.org").blocked).toBe(true);
    });

    it("allows standard public websites", () => {
      expect(blocklist.check("example.com").blocked).toBe(false);
      expect(blocklist.check("github.com").blocked).toBe(false);
    });
  });

  describe("Concurrency Management", () => {
    it("enforces max 2 concurrent scans", () => {
      const cm = new ConcurrencyManager(2);
      expect(cm.tryAcquire()).toBe(true);
      expect(cm.tryAcquire()).toBe(true);
      expect(cm.tryAcquire()).toBe(false);

      cm.release();
      expect(cm.tryAcquire()).toBe(true);
      expect(cm.tryAcquire()).toBe(false);
    });
  });

  describe("Audit Logger (7-day retention & privacy)", () => {
    it("hashes IP and domain, never stores body content", () => {
      const logger = new AbuseAuditLogger();
      const entry = logger.logScan("target.com", "192.168.1.50");

      expect(entry.targetDomain).toBe("target.com");
      expect(entry.targetDomainHash).toMatch(/^[a-f0-9]{64}$/);
      expect(entry.clientIpHash).toMatch(/^[a-f0-9]{64}$/);
      // Confirm no raw IP or sensitive fields
      expect((entry as Record<string, unknown>).body).toBeUndefined();
      expect((entry as Record<string, unknown>).content).toBeUndefined();
    });

    it("purges entries older than 7 days", () => {
      const logger = new AbuseAuditLogger(7 * 24 * 60 * 60 * 1000);
      const pastTime = Date.now() - 8 * 24 * 60 * 60 * 1000;
      logger.logScan("old.com", "1.1.1.1", pastTime);
      expect(logger.getEntries().length).toBe(1);

      logger.purgeExpired(Date.now());
      expect(logger.getEntries().length).toBe(0);
    });
  });

  describe("checkSnapshotAbuse Middleware", () => {
    it("validates request with mock incoming message", async () => {
      const mockReq = {
        headers: { "x-forwarded-for": "100.20.30.40" },
        socket: {},
      } as unknown as http.IncomingMessage;

      const res = await checkSnapshotAbuse(
        mockReq,
        "https://example.com",
        "mock-token",
        "test-secret"
      );
      expect(res.allowed).toBe(true);
    });

    it("blocks restricted targets (.gov)", async () => {
      const mockReq = {
        headers: { "x-forwarded-for": "100.20.30.40" },
        socket: {},
      } as unknown as http.IncomingMessage;

      const res = await checkSnapshotAbuse(
        mockReq,
        "https://whitehouse.gov",
        "mock-token",
        "test-secret"
      );
      expect(res.allowed).toBe(false);
      expect(res.status).toBe(403);
    });
  });
});
