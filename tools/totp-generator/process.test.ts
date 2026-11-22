import { describe, it, expect } from "vitest";
import { base32ToBytes, generateTotp } from "./process";

describe("totp-generator process", () => {
  it("converts Base32 string to byte array and handles spaces/padding", () => {
    // "JBSWY3DPEHPK3PXP" is Base32 for "Hello!\xde\xad\xbe\xef"
    const bytes = base32ToBytes("JBSW Y3DP-EHPK 3PXP==");
    expect(bytes).not.toBeNull();
    expect(bytes?.length).toBe(10);
  });

  it("fails on invalid Base32 characters (1, 8, 9, 0)", () => {
    expect(base32ToBytes("INVALID1890")).toBeNull();
  });

  it("matches standard RFC 6238 test vector for SHA-1", async () => {
    // RFC 6238 standard test secret (ASCII "12345678901234567890") in Base32:
    const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
    // At timestamp 59 seconds (59,000 ms), interval is 1 (floor(59/30) = 1)
    const result = await generateTotp(secret, {
      timestampMs: 59 * 1000,
      period: 30,
      digits: 8,
    });

    // RFC 6238 Table 1 value for T=59s (SHA-1, 8 digits) is "94287082"
    expect(result.token).toBe("94287082");
    expect(result.secondsRemaining).toBe(1); // 30 - (59 % 30) = 1
  });

  it("generates standard 6-digit TOTP and calculates remaining seconds", async () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const result = await generateTotp(secret, {
      timestampMs: 30000, // exact 30s mark
      period: 30,
      digits: 6,
    });

    expect(result.token).toMatch(/^\d{6}$/);
    expect(result.nextToken).toMatch(/^\d{6}$/);
    expect(result.secondsRemaining).toBe(30);
  });

  it("supports 60-second period and SHA-256 algorithm", async () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const result = await generateTotp(secret, {
      timestampMs: 45000,
      period: 60,
      digits: 6,
      algorithm: "SHA-256",
    });

    expect(result.token).toMatch(/^\d{6}$/);
    expect(result.secondsRemaining).toBe(15);
  });
});
