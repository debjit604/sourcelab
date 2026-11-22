import { describe, it, expect } from "vitest";
import { parseColor, hexToRgb, rgbToHex, getContrastRatio, getLuminance } from "./process";

describe("color-picker process", () => {
  it("converts hex to RGB and back accurately", () => {
    const rgb = hexToRgb("#22D3EE");
    expect(rgb).toEqual({ r: 34, g: 211, b: 238 });
    if (rgb) {
      expect(rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase()).toBe("#22d3ee");
    }
  });

  it("handles short 3-character hex shorthand", () => {
    const rgb = hexToRgb("#fff");
    expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
    const rgbCyan = hexToRgb("0ff");
    expect(rgbCyan).toEqual({ r: 0, g: 255, b: 255 });
  });

  it("calculates HSL and CMYK properly", () => {
    const parsed = parseColor("#ff0000"); // Pure red
    expect(parsed).not.toBeNull();
    expect(parsed?.hsl.h).toBe(0);
    expect(parsed?.hsl.s).toBe(100);
    expect(parsed?.cmyk.c).toBe(0);
    expect(parsed?.cmyk.m).toBe(100);
    expect(parsed?.cmyk.y).toBe(100);
  });

  it("calculates contrast ratios and WCAG standards correctly", () => {
    const whiteLum = getLuminance(255, 255, 255);
    const blackLum = getLuminance(0, 0, 0);
    const ratio = getContrastRatio(whiteLum, blackLum);
    expect(ratio).toBe(21); // 21:1 is maximum contrast
  });

  it("generates 9-step tint and shade palette and handles invalid inputs", () => {
    const parsed = parseColor("#22D3EE");
    expect(parsed?.shades).toHaveLength(9);
    expect(parsed?.shades[0].level).toBe(100);
    expect(parsed?.shades[8].level).toBe(900);

    expect(parseColor("invalid-color")).toBeNull();
    expect(parseColor("#xyz123")).toBeNull();
  });
});
