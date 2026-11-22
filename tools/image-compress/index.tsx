"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { compressImage, ImageCompressOutput } from "./process";
import { formatBytes, downloadFile } from "@/lib/files";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Download, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function ImageCompressToolComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<string>("original");

  const [output, setOutput] = useState<ImageCompressOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setOutput(null);
    setError(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCompress = async (fileToCompress = selectedFile) => {
    if (!fileToCompress) {
      setError("Pehle photo upload karo jise compress karna hai.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await compressImage(fileToCompress, {
        quality: quality / 100,
        fileType: format === "original" ? fileToCompress.type : format,
      });
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image compression fail ho gayi.");
      setOutput(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    // Generate a sample 800x600 gradient canvas and convert to File
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 800, 600);
      grad.addColorStop(0, "#0B0F1A");
      grad.addColorStop(0.5, "#22D3EE");
      grad.addColorStop(1, "#3B82F6");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 600);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("SourceLab Image Compression Demo", 80, 300);

      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], "sample-photo.jpg", { type: "image/jpeg" });
          setSelectedFile(sampleFile);
          setPreviewUrl(URL.createObjectURL(sampleFile));
          handleCompress(sampleFile);
        }
      }, "image/jpeg", 0.95);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOutput(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!output) return;
    downloadFile(output.file, output.filename, output.mimeType);
  };

  return (
    <ToolShell
      toolId="image-compress"
      downloadFilename={output?.filename || "compressed-image.jpg"}
      downloadMimeType={output?.mimeType || "image/jpeg"}
      onRunShortcut={() => handleCompress()}
      input={
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--sl-muted)]">
              <ImageIcon className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
              <span>Browser Image Compressor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.1)] transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Sample</span>
              </button>
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-muted)] hover:text-[var(--sl-error)] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs font-mono">
            {/* Quality Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[var(--sl-text)]">Compression Quality</span>
                <span className="text-[var(--sl-accent)] font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={95}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[var(--sl-accent)] cursor-pointer"
              />
            </div>

            {/* Output Format */}
            <div className="space-y-1.5">
              <span className="text-[var(--sl-text)] block">Output Format</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-1.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)]"
              >
                <option value="original">Original Format</option>
                <option value="image/webp">WebP (Best Compression)</option>
                <option value="image/jpeg">JPEG / JPG</option>
              </select>
            </div>
          </div>

          {/* File Selected Card or Dropzone */}
          {selectedFile ? (
            <div className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3 truncate">
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Thumbnail" className="w-12 h-12 rounded object-cover border border-[var(--sl-border)] shrink-0" />
                )}
                <div className="truncate">
                  <span className="font-semibold text-[var(--sl-text)] block truncate">{selectedFile.name}</span>
                  <span className="text-[var(--sl-muted)]">{formatBytes(selectedFile.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-[var(--sl-muted)] hover:text-[var(--sl-error)] text-xs shrink-0"
              >
                Badlo
              </button>
            </div>
          ) : (
            <Dropzone
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple={false}
              maxSizeMB={25}
              onFiles={handleFiles}
              onReject={(msg) => setError(msg)}
              label="Photo yahan drop karo (JPG, PNG, WebP tak 25MB)"
            />
          )}

          <Button
            type="button"
            onClick={() => handleCompress()}
            disabled={loading || !selectedFile}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Compress ho rahi hai..." : "Compress Photo (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-4">
            {/* Savings highlight badge */}
            <div className="p-4 rounded-2xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--sl-success)]">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold text-sm">{output.stats.savedPercent}% Chhoti Ho Gayi!</span>
              </div>
              <span className="text-[var(--sl-success)] font-semibold">
                Saved {formatBytes(output.stats.savedBytes)}
              </span>
            </div>

            {/* Before vs After comparison cards */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center space-y-1">
                <span className="text-[var(--sl-muted)] text-[10px] uppercase block">Original Size</span>
                <span className="text-base font-bold text-[var(--sl-text)] block">
                  {formatBytes(output.stats.originalBytes)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center space-y-1">
                <span className="text-[var(--sl-muted)] text-[10px] uppercase block">Compressed Size</span>
                <span className="text-base font-bold text-[var(--sl-accent)] block">
                  {formatBytes(output.stats.compressedBytes)}
                </span>
              </div>
            </div>

            {/* Image Preview */}
            {output.dataUrl && (
              <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex flex-col items-center justify-center space-y-2">
                <div className="max-h-[280px] overflow-hidden rounded-lg border border-[var(--sl-border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={output.dataUrl} alt="Compressed preview" className="max-h-[280px] w-auto object-contain mx-auto" />
                </div>
                <span className="text-[10px] font-mono text-[var(--sl-muted)]">{output.filename}</span>
              </div>
            )}

            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--sl-accent)] text-[#0B0F1A] font-heading font-bold text-xs hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Photo ({formatBytes(output.stats.compressedBytes)})</span>
            </button>
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
