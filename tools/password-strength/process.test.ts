import { describe, it, expect } from "vitest";
import { analyzePassword, formatCrackTime } from "./process";

describe("password-strength process", () => {
  it("rates weak short passwords correctly", () => {
    const res = analyzePassword("123456");
    expect(res.score).toBeLessThanOrEqual(1);
    expect(res.label).toBe("Very Weak");
    expect(res.warnings.length).toBeGreaterThan(0);
  });

  it("calculates high entropy for strong complex passwords", () => {
    const res = analyzePassword("S0urce!Lab#2026Secure");
    expect(res.entropyBits).toBeGreaterThan(80);
    expect(res.score).toBe(4);
    expect(res.label).toBe("Very Strong");
    expect(res.hasLowercase).toBe(true);
    expect(res.hasUppercase).toBe(true);
    expect(res.hasNumbers).toBe(true);
    expect(res.hasSymbols).toBe(true);
  });

  it("handles empty passwords gracefully", () => {
    const res = analyzePassword("");
    expect(res.entropyBits).toBe(0);
    expect(res.score).toBe(0);
    expect(res.label).toBe("Very Weak");
  });

  it("formats crack time estimates accurately", () => {
    expect(formatCrackTime(0.5)).toBe("Instantly (< 1 sec)");
    expect(formatCrackTime(45)).toBe("45 seconds");
    expect(formatCrackTime(120)).toBe("2 minutes");
    expect(formatCrackTime(3600 * 5)).toBe("5 hours");
    expect(formatCrackTime(86400 * 40)).toBe("1 months");
    expect(formatCrackTime(86400 * 365 * 10)).toBe("10 years");
  });

  it("flags repeated characters and dictionary passwords", () => {
    const repeated = analyzePassword("aaaaaaa");
    expect(repeated.warnings.some((w) => w.includes("repeat"))).toBe(true);

    const common = analyzePassword("password123");
    expect(common.warnings.some((w) => w.includes("common"))).toBe(true);
  });
});
