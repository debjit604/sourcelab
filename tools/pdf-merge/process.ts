import { PDFDocument } from "pdf-lib";

export interface PdfFileInfo {
  id: string;
  name: string;
  size: number;
  data: Uint8Array;
  pageCount?: number;
}

export interface MergePdfResult {
  mergedBytes: Uint8Array;
  totalPages: number;
  totalSize: number;
  error?: string;
}

export async function getPdfPageCount(data: Uint8Array | ArrayBuffer): Promise<number> {
  try {
    const doc = await PDFDocument.load(data, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    return 0;
  }
}

export async function mergePdfs(
  files: Array<Uint8Array | ArrayBuffer>
): Promise<MergePdfResult> {
  if (!files || files.length === 0) {
    return {
      mergedBytes: new Uint8Array(0),
      totalPages: 0,
      totalSize: 0,
      error: "Merge karne ke liye kam se kam ek PDF file zaroori hai.",
    };
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const buffer = files[i];
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const indices = srcDoc.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(srcDoc, indices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    return {
      mergedBytes,
      totalPages: mergedPdf.getPageCount(),
      totalSize: mergedBytes.length,
    };
  } catch (err: unknown) {
    return {
      mergedBytes: new Uint8Array(0),
      totalPages: 0,
      totalSize: 0,
      error: err instanceof Error ? err.message : "PDF merge karne me error aaya.",
    };
  }
}
