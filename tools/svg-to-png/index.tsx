/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useTransition, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { isValidSvg, parseSvgDimensions, calculateScaledDimensions } from "./process";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22D3EE" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="#121828" />
  <circle cx="100" cy="100" r="60" fill="url(#grad)" />
  <path d="M75 100 L95 120 L135 80" stroke="#0B0F1A" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`;

export default function SvgToPngTool() {
  const [svgText, setSvgText] = useState<string>(SAMPLE_SVG);
  const [scale, setScale] = useState<number>(2);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [bgColor, setBgColor] = useState<"transparent" | "white" | "dark">("transparent");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, startTransition] = useTransition();

  const dims = useMemo(() => parseSvgDimensions(svgText), [svgText]);
  const scaledDims = useMemo(() => calculateScaledDimensions(dims.width, dims.height, scale), [dims, scale]);

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;
    setError(null);
    try {
      const text = await files[0].text();
      if (!isValidSvg(text)) {
        setError("Invalid SVG file format.");
        return;
      }
      setSvgText(text);
      setOutputUrl(null);
    } catch {
      setError("File read karne me error aaya.");
    }
  };

  const handleConvert = () => {
    if (!isValidSvg(svgText)) {
      setError("Valid SVG code ya file provide karein.");
      return;
    }
    setError(null);

    startTransition(() => {
      const img = new Image();
      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = scaledDims.width;
        canvas.height = scaledDims.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          if (bgColor === "white") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (bgColor === "dark") {
            ctx.fillStyle = "#0B0F1A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const mime = format === "png" ? "image/png" : "image/jpeg";
          const dataUrl = canvas.toDataURL(mime, 0.95);
          setOutputUrl(dataUrl);
        }
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        setError("SVG render karne me error aaya. Syntax verify karein.");
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  };

  const inputPanel = (
    <div className="space-y-4">
      <Dropzone
        accept=".svg,image/svg+xml"
        maxSizeMB={10}
        onFiles={handleFiles}
        onReject={(msg) => setError(msg)}
        label="SVG file upload karein ya niche code edit karein"
      />

      <div className="space-y-3 p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#8B95AD]">Scale Factor</span>
          <span className="text-[#22D3EE] font-mono">{scaledDims.width} × {scaledDims.height} px</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 4, 8].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md border ${
                scale === s ? "bg-[#22D3EE] text-[#0B0F1A] border-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-[#8B95AD]">Format</span>
          <div className="flex gap-1.5">
            {(["png", "jpeg"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`px-2 py-0.5 text-xs rounded border uppercase ${
                  format === fmt ? "bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-[#8B95AD]">Background</span>
          <div className="flex gap-1.5">
            {(["transparent", "white", "dark"] as const).map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setBgColor(bg)}
                className={`px-2 py-0.5 text-xs rounded border capitalize ${
                  bgColor === bg ? "bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={isConverting}
          className="w-full bg-[#22D3EE] text-[#0B0F1A] font-semibold hover:bg-cyan-300 mt-2"
        >
          {isConverting ? "Converting..." : `Convert to ${format.toUpperCase()}`}
        </Button>
      </div>

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
            <span className="font-medium">Image Ready ({scaledDims.width} × {scaledDims.height}px)</span>
          </div>

          <div className="p-4 rounded-lg bg-[#0B0F1A] border border-[#232C42] flex items-center justify-center max-h-72 overflow-hidden">
            <img src={outputUrl} alt="Converted PNG preview" className="max-h-60 object-contain rounded" />
          </div>

          <a
            href={outputUrl}
            download={`converted-${scaledDims.width}x${scaledDims.height}.${format}`}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#22D3EE] text-[#0B0F1A] font-semibold hover:bg-cyan-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download {format.toUpperCase()}
          </a>
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42] flex flex-col items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 opacity-40 text-[#22D3EE]" />
          <span>SVG upload karein aur scale factor chun kar convert karein.</span>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="svg-to-png"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
