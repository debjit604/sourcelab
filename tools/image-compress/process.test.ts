import { describe, it, expect } from "vitest";
import { calculateSavings, validateImageFile } from "./process";

describe("Image Compressor Process", () => {
  it("calculates compression savings and reduction ratios accurately", () => {
    // 1000 KB to 250 KB
    const savings = calculateSavings(1000 * 1024, 250 * 1024);

    expect(savings.savedBytes).toBe(750 * 1024);
    expect(savings.savedPercent).toBe(75);
    expect(savings.reductionRatio).toBe("4.00x");
  });

  it("handles negative or zero savings gracefully", () => {
    const savings = calculateSavings(100, 100);
    expect(savings.savedBytes).toBe(0);
    expect(savings.savedPercent).toBe(0);
  });

  it("validates valid image mime types and extensions", () => {
    expect(() =>
      validateImageFile({ size: 1024 * 1024, type: "image/jpeg", name: "photo.jpg" }, 25)
    ).not.toThrow();

    expect(() =>
      validateImageFile({ size: 500 * 1024, type: "image/webp", name: "banner.webp" }, 25)
    ).not.toThrow();
  });

  it("throws friendly Hinglish error for non-image files", () => {
    expect(() =>
      validateImageFile({ size: 1024, type: "application/pdf", name: "document.pdf" })
    ).toThrow("Kripya valid image file");
  });

  it("throws friendly Hinglish error when file exceeds size limit", () => {
    const thirtyMb = 30 * 1024 * 1024;
    expect(() =>
      validateImageFile({ size: thirtyMb, type: "image/jpeg", name: "large.jpg" }, 25)
    ).toThrow("Ye photo 25MB se badi hai");
  });
});
