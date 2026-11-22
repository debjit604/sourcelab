import { describe, it, expect } from "vitest";
import {
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentChange,
  calculateDiscount,
  process,
} from "./process";

describe("Percentage Calculator Process", () => {
  it("calculates P percent of X accurately", () => {
    const res = calculatePercentOf(15, 200);
    expect(res.value).toBe(30);
    expect(res.formula).toBe("15% × 200 = 30");
  });

  it("calculates what percent X is of Y accurately", () => {
    const res = calculateWhatPercent(25, 100);
    expect(res.value).toBe(25);
    expect(res.formatted).toBe("25%");

    expect(() => calculateWhatPercent(10, 0)).toThrow("Total 0 nahi ho sakta");
  });

  it("calculates percentage increase and decrease correctly", () => {
    const inc = calculatePercentChange(100, 150);
    expect(inc.value).toBe(50);
    expect(inc.details?.direction).toBe("Increase");

    const dec = calculatePercentChange(200, 150);
    expect(dec.value).toBe(-25);
    expect(dec.details?.direction).toBe("Decrease");

    expect(() => calculatePercentChange(0, 100)).toThrow(
      "Initial value 0 nahi ho sakti"
    );
  });

  it("calculates shopping discount and final price", () => {
    const res = calculateDiscount(1000, 20);
    expect(res.value).toBe(800);
    expect(res.details?.savings).toBe(200);
    expect(res.details?.finalPrice).toBe(800);
  });

  it("process function dispatches all modes correctly", async () => {
    const pOf = await process({ mode: "percent-of", val1: 20, val2: 50 });
    expect(pOf.value).toBe(10);

    const disc = await process({ mode: "discount", val1: 500, val2: 10 });
    expect(disc.value).toBe(450);
  });
});
