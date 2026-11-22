import { PDFDocument } from "pdf-lib";

/**
 * Parses user input page range like "1-3, 5, 8-10" into 0-indexed page numbers
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim() || totalPages <= 0) return [];

  const pagesSet = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
          pagesSet.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pagesSet.add(p - 1);
      }
    }
  }

  return Array.from(pagesSet).sort((a, b) => a - b);
}

export async function getPdfPageCount(pdfBytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(pdfBytes);
  return doc.getPageCount();
}

/**
 * Extracts specified 0-indexed page indices from source PDF into a new PDF
 */
export async function splitPdf(
  pdfBytes: Uint8Array,
  pageIndices: number[]
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error("Kam se kam ek valid page select karein.");
  }

  const srcDoc = await PDFDocument.load(pdfBytes);
  const totalPages = srcDoc.getPageCount();

  const validIndices = pageIndices.filter((idx) => idx >= 0 && idx < totalPages);
  if (validIndices.length === 0) {
    throw new Error("Selected pages PDF ke total page count se bahar hain.");
  }

  const destDoc = await PDFDocument.create();
  const copiedPages = await destDoc.copyPages(srcDoc, validIndices);

  for (const page of copiedPages) {
    destDoc.addPage(page);
  }

  return await destDoc.save();
}
