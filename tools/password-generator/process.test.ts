import { describe, it, expect } from "vitest";
import { processPassword, calculateEntropy } from "./process";

describe("Password Generator Process", () => {
  it("generates default 16-character strong password with all character sets", () => {
    const res = processPassword();

    expect(res.primary).toHaveLength(16);
    expect(res.passwords).toHaveLength(1);
    expect(res.stats.length).toBe(16);
    expect(res.strength.score).toBeGreaterThanOrEqual(4);
    // At least one uppercase, lowercase, number, symbol
    expect(/[A-Z]/.test(res.primary)).toBe(true);
    expect(/[a-z]/.test(res.primary)).toBe(true);
    expect(/[0-9]/.test(res.primary)).toBe(true);
    expect(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(res.primary)).toBe(true);
  });

  it("respects custom length and multi-count generation", () => {
    const res = processPassword({ length: 24, count: 5 });

    expect(res.passwords).toHaveLength(5);
    res.passwords.forEach((p) => {
      expect(p.password).toHaveLength(24);
    });
    expect(res.stats.count).toBe(5);
  });

  it("excludes ambiguous characters when requested", () => {
    const res = processPassword({
      length: 64,
      excludeAmbiguous: true,
      count: 3,
    });

    const ambiguousRegex = /[l1IO0o]/;
    res.passwords.forEach((p) => {
      expect(ambiguousRegex.test(p.password)).toBe(false);
    });
  });

  it("calculates entropy and strength levels correctly", () => {
    const weak = calculateEntropy(6, 26); // 6 lowercase chars
    expect(weak.score).toBeLessThanOrEqual(2);
    expect(weak.label).toMatch(/Kamzor/);

    const strong = calculateEntropy(20, 94); // 20 chars from 94-char pool
    expect(strong.score).toBe(5);
    expect(strong.label).toBe("Unbreakable");
  });

  it("throws friendly Hinglish error when all character sets are disabled", () => {
    expect(() =>
      processPassword({
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      })
    ).toThrow("Kam se kam ek character type");
  });
});
