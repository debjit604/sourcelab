import { describe, it, expect } from "vitest";
import { parsePageRange, splitPdf, getPdfPageCount } from "./process";
import { PDFDocument } from "pdf-lib";

describe("pdf-split process", () => {
  it("parses single page numbers correctly into 0-indexed values", () => {
    const pages = parsePageRange("1, 3, 5", 10);
    expect(pages).toEqual([0, 2, 4]);
  });

  it("parses ranges with hyphens and clamps to total pages", () => {
    const pages = parsePageRange("1-3, 8-12", 10);
    // 1-3 -> 0, 1, 2; 8-12 clamped to 10 -> 7, 8, 9
    expect(pages).toEqual([0, 1, 2, 7, 8, 9]);
  });

  it("deduplicates and sorts page numbers", () => {
    const pages = parsePageRange("5, 2, 2-4", 10);
    expect(pages).toEqual([1, 2, 3, 4]);
  });

  it("handles empty or invalid range strings gracefully", () => {
    expect(parsePageRange("", 10)).toEqual([]);
    expect(parsePageRange("abc, xyz", 10)).toEqual([]);
    expect(parsePageRange("1-5", 0)).toEqual([]);
  });

  it("creates a test PDF and successfully extracts specific pages", async () => {
    // Generate a 4-page test PDF in memory
    const srcDoc = await PDFDocument.create();
    srcDoc.addPage([200, 200]);
    srcDoc.addPage([200, 200]);
    srcDoc.addPage([200, 200]);
    srcDoc.addPage([200, 200]);
    const srcBytes = await srcDoc.save();

    const count = await getPdfPageCount(srcBytes);
    expect(count).toBe(4);

    // Extract pages 2 and 4 (indices 1 and 3)
    const splitBytes = await splitPdf(srcBytes, [1, 3]);
    const splitCount = await getPdfPageCount(splitBytes);
    expect(splitCount).toBe(2);
  });
});
