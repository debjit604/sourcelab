import { describe, it, expect } from "vitest";
import { isValidSvg, parseSvgDimensions, calculateScaledDimensions } from "./process";

describe("svg-to-png process", () => {
  it("validates valid SVG strings", () => {
    const valid = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>';
    expect(isValidSvg(valid)).toBe(true);
    expect(isValidSvg("<div>not an svg</div>")).toBe(false);
    expect(isValidSvg("")).toBe(false);
  });

  it("extracts width and height attributes correctly", () => {
    const svg = '<svg width="240px" height="180px"><rect/></svg>';
    const dims = parseSvgDimensions(svg);
    expect(dims.width).toBe(240);
    expect(dims.height).toBe(180);
  });

  it("extracts viewBox dimensions when width/height are omitted", () => {
    const svg = '<svg viewBox="0 0 800 600"><path/></svg>';
    const dims = parseSvgDimensions(svg);
    expect(dims.width).toBe(800);
    expect(dims.height).toBe(600);
  });

  it("calculates accurate scaling dimensions (1x, 2x, 4x)", () => {
    const scaled2x = calculateScaledDimensions(200, 100, 2);
    expect(scaled2x.width).toBe(400);
    expect(scaled2x.height).toBe(200);

    const scaled4x = calculateScaledDimensions(200, 100, 4);
    expect(scaled4x.width).toBe(800);
    expect(scaled4x.height).toBe(400);
  });

  it("clamps extreme scaling values safely", () => {
    const clampedMax = calculateScaledDimensions(100, 100, 50);
    expect(clampedMax.width).toBe(800); // capped at 8x

    const clampedMin = calculateScaledDimensions(100, 100, 0.01);
    expect(clampedMin.width).toBe(25); // floored at 0.25x
  });
});
