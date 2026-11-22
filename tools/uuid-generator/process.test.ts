import { describe, it, expect } from "vitest";
import { generateUuids, generateSingleUuid, formatUuid } from "./process";

describe("uuid-generator/process", () => {
  it("generates a valid RFC 4122 v4 UUID", () => {
    const uuid = generateSingleUuid();
    // 8-4-4-4-12 format with version 4 and variant 8, 9, a, or b
    const v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(v4Regex);
  });

  it("generates requested bulk quantity accurately", () => {
    const res = generateUuids({ quantity: 10 });
    expect(res.count).toBe(10);
    expect(res.items.length).toBe(10);
    expect(res.output.split("\n").length).toBe(10);

    // Verify all generated UUIDs are unique
    const uniqueSet = new Set(res.items);
    expect(uniqueSet.size).toBe(10);
  });

  it("formats with uppercase, no hyphens, and braces", () => {
    const raw = "123e4567-e89b-12d3-a456-426614174000";

    const noHyphens = formatUuid(raw, { hyphens: false });
    expect(noHyphens).toBe("123e4567e89b12d3a456426614174000");

    const upper = formatUuid(raw, { uppercase: true });
    expect(upper).toBe("123E4567-E89B-12D3-A456-426614174000");

    const withBraces = formatUuid(raw, { braces: true });
    expect(withBraces).toBe("{123e4567-e89b-12d3-a456-426614174000}");

    const combined = formatUuid(raw, { uppercase: true, hyphens: false, braces: true });
    expect(combined).toBe("{123E4567E89B12D3A456426614174000}");
  });

  it("formats with quotes and separators (comma, json)", () => {
    const commaRes = generateUuids({ quantity: 3, separator: "comma", quotes: "single" });
    expect(commaRes.output).toContain("', '");

    const jsonRes = generateUuids({ quantity: 3, separator: "json" });
    const parsed = JSON.parse(jsonRes.output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(3);
  });

  it("clamps quantity safely between 1 and 500", () => {
    const minClamped = generateUuids({ quantity: -5 });
    expect(minClamped.count).toBe(1);

    const zeroClamped = generateUuids({ quantity: 0 });
    expect(zeroClamped.count).toBe(1);

    const maxClamped = generateUuids({ quantity: 9999 });
    expect(maxClamped.count).toBe(500);
  });
});
