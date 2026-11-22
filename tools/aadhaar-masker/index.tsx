/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useTransition } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Download, Copy, Check } from "lucide-react";
import { maskAadhaarString } from "./process";

export default function AadhaarMaskerTool() {
  const [activeTab, setActiveTab] = useState<"card" | "text">("card");
  const [textInput, setTextInput] = useState<string>("5432 1098 7654");
  const [textCopied, setTextCopied] = useState<boolean>(false);

  // Card photo masking state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [maskX, setMaskX] = useState<number>(25);
  const [maskY, setMaskY] = useState<number>(75);
  const [maskW, setMaskW] = useState<number>(35);
  const [maskH, setMaskH] = useState<number>(8);
  const [maskedOutputUrl, setMaskedOutputUrl] = useState<string | null>(null);
  const [isProcessing, startTransition] = useTransition();

  const handleImage = (files: File[]) => {
    if (!files.length) return;
    const f = files[0];
    const url = URL.createObjectURL(f);
    setImageSrc(url);
    setMaskedOutputUrl(null);
  };

  const handleApplyMask = () => {
    if (!imageSrc) return;
    startTransition(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          // Draw dark privacy mask strip
          const rx = (maskX / 100) * canvas.width;
          const ry = (maskY / 100) * canvas.height;
          const rw = (maskW / 100) * canvas.width;
          const rh = (maskH / 100) * canvas.height;

          ctx.fillStyle = "#0B0F1A";
          ctx.fillRect(rx, ry, rw, rh);

          // Optional text on mask
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.max(12, Math.round(rh * 0.55))}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("XXXX XXXX", rx + rw / 2, ry + rh / 2);

          const dataUrl = canvas.toDataURL("image/png", 0.95);
          setMaskedOutputUrl(dataUrl);
        }
      };
      img.src = imageSrc;
    });
  };

  const maskedText = maskAadhaarString(textInput);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(maskedText);
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
        <button
          type="button"
          onClick={() => setActiveTab("card")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            activeTab === "card" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Aadhaar Photo / Scan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            activeTab === "text" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Aadhaar Number Text
        </button>
      </div>

      {activeTab === "card" ? (
        <div className="space-y-4">
          <Dropzone
            accept="image/*"
            maxSizeMB={15}
            onFiles={handleImage}
            label="Aadhaar photo drag karein ya click karke upload karein"
          />

          {imageSrc && (
            <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
              <div className="text-xs text-[#8B95AD] font-medium">Mask Position & Size (%)</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8B95AD]">Horizontal (X): {maskX}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={maskX}
                    onChange={(e) => setMaskX(Number(e.target.value))}
                    className="w-full accent-[#22D3EE]"
                  />
                </div>
                <div>
                  <span className="text-[#8B95AD]">Vertical (Y): {maskY}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={maskY}
                    onChange={(e) => setMaskY(Number(e.target.value))}
                    className="w-full accent-[#22D3EE]"
                  />
                </div>
                <div>
                  <span className="text-[#8B95AD]">Width: {maskW}%</span>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={maskW}
                    onChange={(e) => setMaskW(Number(e.target.value))}
                    className="w-full accent-[#22D3EE]"
                  />
                </div>
                <div>
                  <span className="text-[#8B95AD]">Height: {maskH}%</span>
                  <input
                    type="range"
                    min={3}
                    max={25}
                    value={maskH}
                    onChange={(e) => setMaskH(Number(e.target.value))}
                    className="w-full accent-[#22D3EE]"
                  />
                </div>
              </div>

              <Button
                onClick={handleApplyMask}
                disabled={isProcessing}
                className="w-full bg-[#22D3EE] text-[#0B0F1A] font-semibold hover:bg-cyan-300"
              >
                {isProcessing ? "Processing..." : "Apply Privacy Mask"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8B95AD]">12-Digit Aadhaar Number</label>
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. 5432 1098 7654"
              className="font-mono text-base bg-[#121828] border-[#232C42] text-[#E6EAF2]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] text-xs space-y-1 text-[#8B95AD]">
            <div className="flex items-center gap-1.5 text-[#34D399]">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-medium">100% Client-Side Privacy</span>
            </div>
            <div>Aadhaar number aapke browser me hi format hota hai, server par kabhi nahi jata.</div>
          </div>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {activeTab === "card" ? (
        maskedOutputUrl ? (
          <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
            <div className="text-xs text-[#34D399] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Masked Aadhaar Card Ready</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-[#232C42] bg-[#0B0F1A] max-h-72 flex items-center justify-center p-2">
              <img src={maskedOutputUrl} alt="Masked Aadhaar preview" className="max-h-64 object-contain rounded" />
            </div>
            <a
              href={maskedOutputUrl}
              download="masked-aadhaar.png"
              className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#22D3EE] text-[#0B0F1A] font-semibold hover:bg-cyan-300"
            >
              <Download className="w-4 h-4" />
              Download Masked Photo
            </a>
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42] flex flex-col items-center justify-center gap-2">
            <ShieldCheck className="w-8 h-8 opacity-40 text-[#22D3EE]" />
            <span>Aadhaar card ki photo upload karein aur mask generate karein.</span>
          </div>
        )
      ) : (
        <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] space-y-4">
          <div>
            <div className="text-xs text-[#8B95AD]">Masked Aadhaar Number</div>
            <div className="font-mono text-2xl font-bold text-[#22D3EE] mt-1 select-all tracking-wider">
              {maskedText || "XXXX XXXX XXXX"}
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyText}
            className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
          >
            {textCopied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
            {textCopied ? "Copied!" : "Copy Masked Number"}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="aadhaar-masker"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
