"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { mergePdfs, getPdfPageCount, PdfFileInfo } from "./process";
import { PDFDocument } from "pdf-lib";
import { ArrowUp, ArrowDown, Trash2, FileText, Download, Sparkles, CheckCircle2 } from "lucide-react";

export default function PdfMergeTool() {
  const [files, setFiles] = useState<PdfFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedStats, setMergedStats] = useState<{ pages: number; size: number } | null>(null);

  const handleFilesAdded = async (newFiles: File[]) => {
    setError(null);
    try {
      const addedInfos: PdfFileInfo[] = [];
      for (const f of newFiles) {
        const buffer = await f.arrayBuffer();
        const uint8 = new Uint8Array(buffer);
        const pages = await getPdfPageCount(uint8);
        addedInfos.push({
          id: `${f.name}-${Date.now()}-${Math.random()}`,
          name: f.name,
          size: f.size,
          data: uint8,
          pageCount: pages,
        });
      }
      setFiles((prev) => [...prev, ...addedInfos]);
    } catch {
      setError("Files load karne me error aaya.");
    }
  };

  const handleAddSample = async () => {
    try {
      setLoading(true);
      const doc1 = await PDFDocument.create();
      doc1.addPage([300, 400]);
      const bytes1 = await doc1.save();

      const doc2 = await PDFDocument.create();
      doc2.addPage([300, 400]);
      doc2.addPage([300, 400]);
      const bytes2 = await doc2.save();

      setFiles([
        { id: "sample-1", name: "Sample-Document-1.pdf", size: bytes1.length, data: bytes1, pageCount: 1 },
        { id: "sample-2", name: "Sample-Document-2.pdf", size: bytes2.length, data: bytes2, pageCount: 2 },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFiles(updated);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) {
      setError("Pehle kam se kam ek PDF file add karo.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const buffers = files.map((f) => f.data);
      const res = await mergePdfs(buffers);
      if (res.error) {
        setError(res.error);
      } else {
        const blob = new Blob([res.mergedBytes as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setMergedBlobUrl(url);
        setMergedStats({ pages: res.totalPages, size: res.totalSize });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Merge process me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setError(null);
    if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
    setMergedBlobUrl(null);
    setMergedStats(null);
  };

  return (
    <ToolShell
      toolId="pdf-merge"
      error={error}
      loading={loading}
      onRunShortcut={handleMerge}
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase">
              PDF Files ({files.length})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAddSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[var(--sl-accent)] bg-[rgba(34,211,238,0.1)] hover:bg-[rgba(34,211,238,0.2)] rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample PDFs</span>
              </button>
              {files.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2 py-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-error)] rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <Dropzone
            accept=".pdf,application/pdf"
            multiple={true}
            maxSizeMB={50}
            onFiles={handleFilesAdded}
            label="PDF files yahan drag-and-drop karo ya click karke upload karo"
          />

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {files.map((file, i) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[var(--sl-muted)] text-[11px] w-4">{i + 1}.</span>
                    <FileText className="w-4 h-4 text-[var(--sl-accent)] shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--sl-text)] truncate">{file.name}</div>
                      <div className="text-[10px] font-mono text-[var(--sl-muted)]">
                        {file.pageCount || 1} pages • {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveFile(i, "up")}
                      className="p-1 rounded text-[var(--sl-muted)] hover:text-[var(--sl-text)] disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={i === files.length - 1}
                      onClick={() => moveFile(i, "down")}
                      className="p-1 rounded text-[var(--sl-muted)] hover:text-[var(--sl-text)] disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1 rounded text-[var(--sl-muted)] hover:text-[var(--sl-error)]"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleMerge}
            disabled={files.length === 0 || loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-bold font-heading hover:brightness-110 active:scale-[0.99] disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            <FileText className="w-4 h-4" />
            <span>PDFs Merge Karo (Ctrl + Enter)</span>
          </button>
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
            <span className="text-xs font-mono font-medium text-[var(--sl-accent)] uppercase tracking-wider">
              Merged Document Output
            </span>
            {mergedStats && (
              <span className="text-xs font-mono text-[var(--sl-success)] font-semibold">
                {mergedStats.pages} Pages Total
              </span>
            )}
          </div>

          {mergedBlobUrl ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-[var(--sl-text)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--sl-success)]" />
                    <span>Merge Safaltapoorvak Ho Gaya!</span>
                  </div>
                  <div className="text-xs font-mono text-[var(--sl-muted)]">
                    Total: {mergedStats?.pages} pages • {((mergedStats?.size || 0) / 1024).toFixed(1)} KB
                  </div>
                </div>

                <a
                  href={mergedBlobUrl}
                  download="sourcelab-merged.pdf"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-bold font-heading text-xs hover:brightness-110 transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>

              {/* PDF Preview Frame */}
              <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[var(--sl-border)] bg-[var(--sl-bg)]">
                <iframe
                  src={mergedBlobUrl}
                  title="Merged PDF Preview"
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-14 text-center space-y-3 rounded-xl bg-[var(--sl-bg)] border border-dashed border-[var(--sl-border)]">
              <div className="p-3 rounded-full bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--sl-text)]">
                Merged PDF yahan dikhega
              </p>
              <p className="text-xs text-[var(--sl-muted)] max-w-xs">
                Left panel me PDF files add karo ya &quot;Sample PDFs&quot; dabao, fir &quot;PDFs Merge Karo&quot; par click karo.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
