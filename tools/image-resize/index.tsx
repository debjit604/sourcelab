"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { calculateTargetDimensions, resizeImageToBlob, createSampleImageBlob } from "./process";
import { Download, Lock, Unlock, Sparkles, RotateCcw, ImageIcon } from "lucide-react";

export default function ImageResizeTool() {
  const [imageFile, setImageFile] = useState<{ name: string; size: number; url: string } | null>(null);
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockRatio, setLockRatio] = useState(true);
  const [scalePercent, setScalePercent] = useState<number | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resizedBlobUrl, setResizedBlobUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageLoaded = (url: string, name: string, size: number) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
      setImageFile({ name, size, url });
      setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setScalePercent(null);
      setError(null);
    };
  };

  const handleFileDrop = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    handleImageLoaded(URL.createObjectURL(file), file.name, file.size);
  };

  const handleSample = async () => {
    try {
      const blob = await createSampleImageBlob();
      handleImageLoaded(URL.createObjectURL(blob), "sample-image.jpg", blob.size);
    } catch {
      setError("Sample load karne me error aaya.");
    }
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    setScalePercent(null);
    if (lockRatio && origDims) {
      const d = calculateTargetDimensions({ originalWidth: origDims.w, originalHeight: origDims.h, targetWidth: val, lockAspectRatio: true });
      setTargetHeight(d.height);
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    setScalePercent(null);
    if (lockRatio && origDims) {
      const d = calculateTargetDimensions({ originalWidth: origDims.w, originalHeight: origDims.h, targetHeight: val, lockAspectRatio: true });
      setTargetWidth(d.width);
    }
  };

  const handlePercentClick = (pct: number) => {
    setScalePercent(pct);
    if (origDims) {
      const d = calculateTargetDimensions({ originalWidth: origDims.w, originalHeight: origDims.h, scalePercent: pct });
      setTargetWidth(d.width);
      setTargetHeight(d.height);
    }
  };

  const handleResize = async () => {
    if (!imgRef.current || !origDims) {
      setError("Pehle koi image upload karo.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const blob = await resizeImageToBlob(imgRef.current, targetWidth, targetHeight, format, quality / 100);
      if (resizedBlobUrl) URL.revokeObjectURL(resizedBlobUrl);
      setResizedBlobUrl(URL.createObjectURL(blob));
      setResizedSize(blob.size);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Resize process me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setOrigDims(null);
    setResizedBlobUrl(null);
    setResizedSize(null);
  };

  useEffect(() => {
    return () => {
      if (resizedBlobUrl) URL.revokeObjectURL(resizedBlobUrl);
      if (imageFile?.url) URL.revokeObjectURL(imageFile.url);
    };
  }, [resizedBlobUrl, imageFile]);

  return (
    <ToolShell
      toolId="image-resize"
      error={error}
      loading={loading}
      onRunShortcut={handleResize}
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase">Upload Image:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[var(--sl-accent)] bg-[rgba(34,211,238,0.1)] hover:bg-[rgba(34,211,238,0.2)] rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample</span>
              </button>
              {imageFile && (
                <button type="button" onClick={handleReset} className="px-2 py-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-error)] rounded-lg">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <Dropzone accept=".jpg,.jpeg,.png,.webp,image/*" multiple={false} maxSizeMB={25} camera={true} onFiles={handleFileDrop} label="Photo drag-and-drop karo ya select karo" />

          {origDims && (
            <div className="space-y-3.5 pt-2 border-t border-[var(--sl-border)]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[var(--sl-muted)]">
                  <span>Dimensions (Pixels):</span>
                  <span>Original: {origDims.w}×{origDims.h}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-[var(--sl-muted)] block">Width</span>
                    <input type="number" min={1} max={10000} value={targetWidth} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-xs font-mono text-[var(--sl-text)] outline-none" />
                  </div>
                  <button type="button" onClick={() => setLockRatio(!lockRatio)} className={`mt-4 p-2 rounded-xl border ${lockRatio ? "bg-[rgba(34,211,238,0.15)] border-[var(--sl-accent)] text-[var(--sl-accent)]" : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"}`} title={lockRatio ? "Locked" : "Unlocked"}>
                    {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-[var(--sl-muted)] block">Height</span>
                    <input type="number" min={1} max={10000} value={targetHeight} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-xs font-mono text-[var(--sl-text)] outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--sl-muted)] block">Scale %:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[25, 50, 75, 100, 150].map((pct) => (
                    <button key={pct} type="button" onClick={() => handlePercentClick(pct)} className={`py-1 text-xs font-mono rounded-lg ${scalePercent === pct ? "bg-[var(--sl-accent)] text-slate-950 font-bold" : "bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)]"}`}>{pct}%</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[var(--sl-muted)] block mb-1">Format</span>
                  <select value={format} onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png" | "image/webp")} className="w-full p-1.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs text-[var(--sl-text)] outline-none">
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-[var(--sl-muted)] mb-1"><span>Quality</span><span>{quality}%</span></div>
                  <input type="range" min={20} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[var(--sl-accent)] cursor-pointer mt-1" />
                </div>
              </div>

              <button type="button" onClick={handleResize} disabled={loading} className="w-full py-3 px-4 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-bold font-heading hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                <ImageIcon className="w-4 h-4" />
                <span>Image Resize Karo (Ctrl + Enter)</span>
              </button>
            </div>
          )}
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
            <span className="text-xs font-mono font-medium text-[var(--sl-accent)] uppercase">Output Preview</span>
            {resizedSize && <span className="text-xs font-mono text-[var(--sl-success)] font-semibold">{(resizedSize / 1024).toFixed(1)} KB</span>}
          </div>

          {resizedBlobUrl ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-[var(--sl-text)] font-semibold">{targetWidth} × {targetHeight} px</div>
                  <div className="text-[var(--sl-muted)]">Orig: {origDims?.w}×{origDims?.h} ({((imageFile?.size || 0) / 1024).toFixed(1)} KB)</div>
                </div>
                <a href={resizedBlobUrl} download={`resized-${targetWidth}x${targetHeight}.${format.split("/")[1]}`} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-bold text-xs hover:brightness-110">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
              <div className="rounded-xl overflow-hidden border border-[var(--sl-border)] bg-[var(--sl-bg)] p-2 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resizedBlobUrl} alt="Resized Preview" className="max-h-[350px] w-auto object-contain rounded-lg shadow-md" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 rounded-xl bg-[var(--sl-bg)] border border-dashed border-[var(--sl-border)]">
              <div className="p-3 rounded-full bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]"><ImageIcon className="w-6 h-6" /></div>
              <p className="text-sm font-medium text-[var(--sl-text)]">Resized photo yahan dikhegi</p>
              <p className="text-xs text-[var(--sl-muted)] max-w-xs">Left panel me photo upload karo ya &quot;Sample&quot; dabao.</p>
            </div>
          )}
        </div>
      }
    />
  );
}
