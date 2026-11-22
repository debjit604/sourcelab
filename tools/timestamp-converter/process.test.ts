import { describe, it, expect } from "vitest";
import {
  parseTimestamp,
  parseDateString,
  getRelativeTime,
  isLeapYear,
  generateTimestampSummary,
} from "./process";

describe("timestamp-converter process", () => {
  it("converts epoch seconds correctly", () => {
    // 1700000000 = Wed, 14 Nov 2023 22:13:20 GMT
    const res = parseTimestamp(1700000000, "sec");
    expect(res).not.toBeNull();
    expect(res?.epochSeconds).toBe(1700000000);
    expect(res?.epochMilliseconds).toBe(1700000000000);
    expect(res?.isoString).toBe("2023-11-14T22:13:20.000Z");
    expect(res?.utcString).toContain("14 Nov 2023");
  });

  it("converts epoch milliseconds and auto-detects unit", () => {
    const res = parseTimestamp("1700000000123", "auto");
    expect(res).not.toBeNull();
    expect(res?.epochMilliseconds).toBe(1700000000123);
    expect(res?.epochSeconds).toBe(1700000000);
    expect(res?.isoString).toBe("2023-11-14T22:13:20.123Z");
  });

  it("converts ISO date string to timestamp results", () => {
    const res = parseDateString("2026-01-01T00:00:00.000Z");
    expect(res).not.toBeNull();
    expect(res?.isoString).toBe("2026-01-01T00:00:00.000Z");
    expect(res?.epochSeconds).toBe(1767225600);
    expect(res?.isLeapYear).toBe(false);
  });

  it("calculates human relative times accurately", () => {
    const now = new Date("2026-11-23T12:00:00Z");
    const past5Min = new Date("2026-11-23T11:55:00Z");
    const future2Hours = new Date("2026-11-23T14:00:00Z");

    expect(getRelativeTime(past5Min, now)).toBe("5 minutes ago");
    expect(getRelativeTime(future2Hours, now)).toBe("in 2 hours");
  });

  it("validates leap years and handles invalid inputs gracefully", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);

    expect(parseTimestamp("abc")).toBeNull();
    expect(parseTimestamp("")).toBeNull();
    expect(parseDateString("invalid-date-string")).toBeNull();

    const validRes = parseTimestamp(1700000000);
    expect(validRes).not.toBeNull();
    if (validRes) {
      const summary = generateTimestampSummary(validRes);
      expect(summary).toContain("Unix Epoch (Seconds): 1700000000");
    }
  });
});
