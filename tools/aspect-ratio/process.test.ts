import { describe, it, expect } from "vitest";
import { getGcd, calculateRatio, scaleDimension } from "./process";

describe("aspect-ratio process", () => {
  it("calculates correct GCD", () => {
    expect(getGcd(1920, 1080)).toBe(120);
    expect(getGcd(800, 600)).toBe(200);
    expect(getGcd(1080, 1080)).toBe(1080);
  });

  it("calculates 16:9 ratio for Full HD 1920x1080", () => {
    const res = calculateRatio(1920, 1080);
    expect(res.ratioString).toBe("16:9");
    expect(res.wRatio).toBe(16);
    expect(res.hRatio).toBe(9);
    expect(res.decimalRatio).toBeCloseTo(1.778, 3);
  });

  it("calculates 4:3 and 1:1 ratios accurately", () => {
    const res43 = calculateRatio(800, 600);
    expect(res43.ratioString).toBe("4:3");
    const res11 = calculateRatio(1080, 1080);
    expect(res11.ratioString).toBe("1:1");
  });

  it("scales height proportionally when target width is given", () => {
    // 16:9 original, scale width to 1280 -> height should be 720
    const scaled = scaleDimension(1920, 1080, 1280, undefined);
    expect(scaled.width).toBe(1280);
    expect(scaled.height).toBe(720);
  });

  it("scales width proportionally when target height is given", () => {
    // 16:9 original, scale height to 360 -> width should be 640
    const scaled = scaleDimension(1920, 1080, undefined, 360);
    expect(scaled.width).toBe(640);
    expect(scaled.height).toBe(360);
  });
});
