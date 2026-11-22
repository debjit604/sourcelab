import { describe, it, expect } from "vitest";
import {
  splitGraphemes,
  calculateMetrics,
  getMostMissedKeys,
  generateChartPoints,
} from "./process";

describe("Typing Test Engine (process.ts)", () => {
  describe("splitGraphemes", () => {
    it("splits standard English text accurately", () => {
      const graphemes = splitGraphemes("Hello World");
      expect(graphemes.length).toBe(11);
      expect(graphemes[0]).toBe("H");
    });

    it("handles Hindi conjuncts with Intl.Segmenter", () => {
      // "नमस्ते" is 3 grapheme clusters: 'न', 'म', 'स्ते'
      const graphemes = splitGraphemes("नमस्ते");
      expect(graphemes).toEqual(["न", "म", "स्ते"]);
    });

    it("handles Bengali text with conjuncts", () => {
      // "বাংলা" is 2 grapheme clusters: 'বাং', 'লা'
      const graphemes = splitGraphemes("বাংলা");
      expect(graphemes).toEqual(["বাং", "লা"]);
    });

    it("returns empty array for empty string", () => {
      expect(splitGraphemes("")).toEqual([]);
    });
  });

  describe("calculateMetrics", () => {
    it("calculates accurate Gross and Net WPM with zero errors", () => {
      // 250 characters typed in 60 seconds = (250/5)/1 = 50 WPM
      const metrics = calculateMetrics(250, 0, 250, 60, "standard");
      expect(metrics.grossWpm).toBe(50);
      expect(metrics.netWpm).toBe(50);
      expect(metrics.accuracy).toBe(100);
      expect(metrics.mode).toBe("standard");
    });

    it("deducts error penalty from Net WPM correctly", () => {
      // 300 characters in 60 seconds (60 Gross WPM), with 5 errors
      // Net WPM = 60 - (5 / 1) = 55 WPM
      const metrics = calculateMetrics(300, 5, 300, 60, "standard");
      expect(metrics.grossWpm).toBe(60);
      expect(metrics.netWpm).toBe(55);
      expect(metrics.accuracy).toBe(98.3);
    });

    it("prevents negative Net WPM when errors exceed gross WPM", () => {
      // 50 chars in 60 seconds = 10 gross, with 20 errors
      const metrics = calculateMetrics(50, 20, 50, 60, "standard");
      expect(metrics.grossWpm).toBe(10);
      expect(metrics.netWpm).toBe(0);
    });

    it("supports actual-words mode", () => {
      // 40 actual words completed in 60 seconds
      const metrics = calculateMetrics(200, 0, 200, 60, "actual-words", 40);
      expect(metrics.grossWpm).toBe(40);
      expect(metrics.netWpm).toBe(40);
    });
  });

  describe("getMostMissedKeys", () => {
    it("sorts and formats missed keys correctly", () => {
      const map = { a: 2, e: 7, " ": 4, t: 1 };
      const top = getMostMissedKeys(map, 3);
      expect(top[0]).toEqual({ key: "e", count: 7 });
      expect(top[1]).toEqual({ key: "Space", count: 4 });
      expect(top[2]).toEqual({ key: "a", count: 2 });
    });
  });

  describe("generateChartPoints", () => {
    it("generates an SVG polyline path string", () => {
      const points = [30, 45, 52, 60];
      const result = generateChartPoints(points, 200, 60);
      expect(result.path.startsWith("M ")).toBe(true);
      expect(result.min).toBe(30);
      expect(result.max).toBe(60);
    });

    it("handles empty or single point arrays safely", () => {
      const result = generateChartPoints([]);
      expect(result.path).toBe("");
    });
  });
});
