import { describe, it, expect } from "vitest";
import { calculateTargetDimensions } from "./process";

describe("image-resize/process", () => {
  it("calculates dimensions with locked aspect ratio accurately", () => {
    // 16:9 ratio: 1920 x 1080 -> targetWidth: 1280 -> targetHeight: 720
    const res = calculateTargetDimensions({
      originalWidth: 1920,
      originalHeight: 1080,
      targetWidth: 1280,
      lockAspectRatio: true,
    });

    expect(res.error).toBeUndefined();
    expect(res.width).toBe(1280);
    expect(res.height).toBe(720);
    expect(res.aspectRatio).toBeCloseTo(16 / 9, 2);
  });

  it("calculates unlocked custom dimensions without aspect ratio constraint", () => {
    const res = calculateTargetDimensions({
      originalWidth: 1920,
      originalHeight: 1080,
      targetWidth: 500,
      targetHeight: 500,
      lockAspectRatio: false,
    });

    expect(res.width).toBe(500);
    expect(res.height).toBe(500);
  });

  it("scales dimensions accurately by percentage", () => {
    // 50% of 1000 x 800 -> 500 x 400
    const res50 = calculateTargetDimensions({
      originalWidth: 1000,
      originalHeight: 800,
      scalePercent: 50,
    });

    expect(res50.width).toBe(500);
    expect(res50.height).toBe(400);

    // 25% of 1000 x 800 -> 250 x 200
    const res25 = calculateTargetDimensions({
      originalWidth: 1000,
      originalHeight: 800,
      scalePercent: 25,
    });

    expect(res25.width).toBe(250);
    expect(res25.height).toBe(200);
  });

  it("clamps extreme boundaries safely between 1px and 10000px", () => {
    const maxClamped = calculateTargetDimensions({
      originalWidth: 500,
      originalHeight: 500,
      targetWidth: 50000,
      lockAspectRatio: false,
    });

    expect(maxClamped.width).toBe(10000);

    const minClamped = calculateTargetDimensions({
      originalWidth: 500,
      originalHeight: 500,
      scalePercent: 0.0001,
    });

    expect(minClamped.width).toBeGreaterThanOrEqual(1);
  });

  it("returns descriptive Hinglish error on invalid zero or negative dimensions", () => {
    const res = calculateTargetDimensions({
      originalWidth: 0,
      originalHeight: 100,
    });

    expect(res.error).toBe("Original dimensions zero se badi honi chahiye.");
    expect(res.width).toBe(0);
  });
});
