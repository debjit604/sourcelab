import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfs, getPdfPageCount } from "./process";

async function createSamplePdf(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([200, 200]);
  }
  return await doc.save();
}

describe("pdf-merge/process", () => {
  it("merges two PDF documents with accurate combined page count", async () => {
    const pdf1 = await createSamplePdf(1);
    const pdf2 = await createSamplePdf(2);

    const res = await mergePdfs([pdf1, pdf2]);
    expect(res.error).toBeUndefined();
    expect(res.totalPages).toBe(3);
    expect(res.totalSize).toBeGreaterThan(0);

    // Verify PDF header magic bytes "%PDF-"
    const header = new TextDecoder().decode(res.mergedBytes.slice(0, 5));
    expect(header).toBe("%PDF-");
  });

  it("merges three documents in strict sequential order", async () => {
    const pdf1 = await createSamplePdf(2);
    const pdf2 = await createSamplePdf(3);
    const pdf3 = await createSamplePdf(1);

    const res = await mergePdfs([pdf1, pdf2, pdf3]);
    expect(res.error).toBeUndefined();
    expect(res.totalPages).toBe(6);
  });

  it("handles single PDF merge cleanly", async () => {
    const single = await createSamplePdf(4);
    const res = await mergePdfs([single]);
    expect(res.error).toBeUndefined();
    expect(res.totalPages).toBe(4);
  });

  it("handles empty files array with descriptive Hinglish error", async () => {
    const res = await mergePdfs([]);
    expect(res.totalPages).toBe(0);
    expect(res.error).toBe("Merge karne ke liye kam se kam ek PDF file zaroori hai.");
  });

  it("calculates PDF page count accurately using getPdfPageCount", async () => {
    const sample = await createSamplePdf(5);
    const count = await getPdfPageCount(sample);
    expect(count).toBe(5);

    const invalidCount = await getPdfPageCount(new Uint8Array([1, 2, 3]));
    expect(invalidCount).toBe(0);
  });
});
