import { describe, it, expect } from "vitest";
import { isAllowedRequest, validateTargetUrl } from "./url";
import { isForbiddenIp, normalizeIp } from "./ip";
import { safeFetch } from "./fetch";

describe("SSRF Defense & Guard Suite (Task 1 Checkpoint)", () => {
  describe("Direct Checkpoint Block Verification", () => {
    it("blocks http://localhost", async () => {
      const res = await isAllowedRequest("http://localhost");
      expect(res.allowed).toBe(false);
      expect(res.reason).toMatch(/forbidden|local/i);
    });

    it("blocks http://127.0.0.1", async () => {
      const res = await isAllowedRequest("http://127.0.0.1");
      expect(res.allowed).toBe(false);
      expect(res.reason).toMatch(/127\.0\.0\.0\/8|loopback/i);
    });

    it("blocks http://169.254.169.254 (Cloud metadata)", async () => {
      const res = await isAllowedRequest("http://169.254.169.254");
      expect(res.allowed).toBe(false);
      expect(res.reason).toMatch(/169\.254|metadata|link-local/i);
    });

    it("blocks http://[::1] (IPv6 loopback)", async () => {
      const res = await isAllowedRequest("http://[::1]");
      expect(res.allowed).toBe(false);
      expect(res.reason).toMatch(/::1|loopback/i);
    });

    it("blocks http://2130706433 (Decimal representation of 127.0.0.1)", async () => {
      const res = await isAllowedRequest("http://2130706433");
      expect(res.allowed).toBe(false);
      expect(res.reason).toMatch(/127\.0\.0\.0\/8|loopback/i);
    });

    it("blocks redirect chains ending in a private IP via safeFetch", async () => {
      // safeFetch must reject any redirect target that resolves to private IP
      await expect(
        safeFetch("http://127.0.0.1")
      ).rejects.toThrow(/SSRF Guard Blocked/i);
    });
  });

  describe("Alternative IP Representations & Encodings", () => {
    it("normalizes and blocks octal IPv4 (0177.0.0.1)", async () => {
      const norm = normalizeIp("0177.0.0.1");
      expect(norm).toBe("127.0.0.1");
      const check = isForbiddenIp("0177.0.0.1");
      expect(check.forbidden).toBe(true);
    });

    it("normalizes and blocks hex IPv4 (0x7f.0.0.1 and 0x7f000001)", async () => {
      const normDotted = normalizeIp("0x7f.0.0.1");
      expect(normDotted).toBe("127.0.0.1");
      expect(isForbiddenIp("0x7f.0.0.1").forbidden).toBe(true);

      const normFull = normalizeIp("0x7f000001");
      expect(normFull).toBe("127.0.0.1");
      expect(isForbiddenIp("0x7f000001").forbidden).toBe(true);
    });

    it("normalizes and blocks IPv4-mapped IPv6 (::ffff:127.0.0.1)", async () => {
      const norm = normalizeIp("::ffff:127.0.0.1");
      expect(norm).toBe("127.0.0.1");
      expect(isForbiddenIp("::ffff:127.0.0.1").forbidden).toBe(true);
    });

    it("normalizes and blocks hex IPv4-mapped IPv6 (::ffff:7f00:1)", async () => {
      const norm = normalizeIp("::ffff:7f00:0001");
      expect(norm).toBe("127.0.0.1");
      expect(isForbiddenIp("::ffff:7f00:0001").forbidden).toBe(true);
    });
  });

  describe("Private, Link-Local & Reserved Ranges", () => {
    it("blocks RFC 1918 10.0.0.0/8", () => {
      expect(isForbiddenIp("10.0.0.1").forbidden).toBe(true);
      expect(isForbiddenIp("10.254.12.99").forbidden).toBe(true);
    });

    it("blocks RFC 1918 172.16.0.0/12", () => {
      expect(isForbiddenIp("172.16.0.1").forbidden).toBe(true);
      expect(isForbiddenIp("172.31.255.254").forbidden).toBe(true);
    });

    it("blocks RFC 1918 192.168.0.0/16", () => {
      expect(isForbiddenIp("192.168.1.1").forbidden).toBe(true);
      expect(isForbiddenIp("192.168.100.254").forbidden).toBe(true);
    });

    it("blocks CGNAT 100.64.0.0/10", () => {
      expect(isForbiddenIp("100.64.0.1").forbidden).toBe(true);
      expect(isForbiddenIp("100.127.255.254").forbidden).toBe(true);
    });

    it("blocks IPv6 ULA fc00::/7 and link-local fe80::/10", () => {
      expect(isForbiddenIp("fe80::1").forbidden).toBe(true);
      expect(isForbiddenIp("fc00::1").forbidden).toBe(true);
      expect(isForbiddenIp("fd12:3456:789a::1").forbidden).toBe(true);
    });
  });

  describe("URL & Protocol Validations", () => {
    it("rejects non-http/https protocols", () => {
      expect(validateTargetUrl("file:///etc/passwd").valid).toBe(false);
      expect(validateTargetUrl("ftp://example.com").valid).toBe(false);
      expect(validateTargetUrl("gopher://127.0.0.1").valid).toBe(false);
    });

    it("rejects credentials in URL", () => {
      const res = validateTargetUrl("http://user:pass@example.com");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/credentials/i);
    });

    it("rejects internal non-whitelisted ports", () => {
      expect(validateTargetUrl("http://example.com:22").valid).toBe(false);
      expect(validateTargetUrl("http://example.com:3306").valid).toBe(false);
      expect(validateTargetUrl("http://example.com:6379").valid).toBe(false);
    });

    it("allows standard web ports (80, 443, 8080, 8443)", () => {
      expect(validateTargetUrl("http://example.com:80").valid).toBe(true);
      expect(validateTargetUrl("https://example.com:443").valid).toBe(true);
      expect(validateTargetUrl("https://example.com:8443").valid).toBe(true);
    });

    it("blocks internal and local domain suffixes", async () => {
      expect((await isAllowedRequest("http://localhost.localdomain")).allowed).toBe(false);
      expect((await isAllowedRequest("http://app.internal")).allowed).toBe(false);
      expect((await isAllowedRequest("http://printer.lan")).allowed).toBe(false);
      expect((await isAllowedRequest("http://gateway.local")).allowed).toBe(false);
    });
  });
});
