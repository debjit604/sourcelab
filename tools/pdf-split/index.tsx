"use client";

import React, { useState, useTransition } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { parsePageRange, getPdfPageCount, splitPdf } from "./process";

export default function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>("1");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, startTransition] = useTransition();

  const handleFile = async (files: File[]) => {
    if (!files.length) return;
    const f = files[0];
    setError(null);
    setOutputUrl(null);
    try {
      const buffer = await f.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const count = await getPdfPageCount(bytes);
      setFile(f);
      setFileBytes(bytes);
      setPageCount(count);
      setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : "1");
    } catch {
      setError("PDF load karne me error aaya. Kripya valid unprotected PDF upload karein.");
    }
  };

  const handleSplit = () => {
    if (!fileBytes || pageCount === 0) return;
    setError(null);

    const indices = parsePageRange(rangeInput, pageCount);
    if (indices.length === 0) {
      setError(`Kripya 1 se ${pageCount} ke beech valid page range enter karein.`);
      return;
    }

    startTransition(async () => {
      try {
        const resultBytes = await splitPdf(fileBytes, indices);
        const blob = new Blob([resultBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setOutputUrl(url);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "PDF split fail ho gaya.");
      }
    });
  };

  const inputPanel = (
    <div className="space-y-4">
      <Dropzone
        accept=".pdf,application/pdf"
        maxSizeMB={50}
        onFiles={handleFile}
        onReject={(msg) => setError(msg)}
        label="PDF file drag karein ya click karke upload karein"
      />

      {file && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#E6EAF2] font-medium truncate max-w-[200px]">{file.name}</span>
            <span className="text-[#22D3EE] font-mono">{pageCount} Pages</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[#8B95AD]">Page Range to Extract</label>
              <span className="text-[11px] text-[#8B95AD]">e.g. 1-3, 5, 7</span>
            </div>
            <Input
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="font-mono text-sm bg-[#0B0F1A] border-[#232C42] text-[#E6EAF2]"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setRangeInput(`1-${pageCount}`)}
              className="px-2 py-1 text-xs rounded bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
            >
              All ({pageCount} Pages)
            </button>
            <button
              type="button"
              onClick={() => setRangeInput("1")}
              className="px-2 py-1 text-xs rounded bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
            >
              First Page Only
            </button>
            {pageCount > 1 && (
              <button
                type="button"
                onClick={() => setRangeInput(String(pageCount))}
                className="px-2 py-1 text-xs rounded bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
              >
                Last Page Only
              </button>
            )}
          </div>

          <Button
            onClick={handleSplit}
            disabled={isProcessing}
            className="w-full bg-[#22D3EE] text-[#0B0F1A] font-semibold hover:bg-cyan-300"
          >
            {isProcessing ? "Processing..." : "Extract Pages"}
          </Button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-[#F87171] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {outputUrl ? (
        <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-4">
          <div className="flex items-center gap-2 text-sm text-[#34D399]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">Split PDF Taiyar Hai!</span>
          </div>

          <div className="h-64 rounded-lg overflow-hidden border border-[#232C42]">
            <iframe src={outputUrl} className="w-full h-full" title="PDF Preview" />
          </div>

          <a
            href={outputUrl}
            download={`split-${file?.name || "document.pdf"}`}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#22D3EE] text-[#0B0F1A] font-semibold hover:bg-cyan-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Split PDF
          </a>
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42] flex flex-col items-center justify-center gap-2">
          <FileText className="w-8 h-8 opacity-40 text-[#22D3EE]" />
          <span>PDF upload karein aur pages extract karne ke liye range select karein.</span>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="pdf-split"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
