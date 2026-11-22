"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Lock, Unlock } from "lucide-react";
import { calculateRatio, scaleDimension, RatioResult } from "./process";

const PRESETS = [
  { label: "16:9 (YouTube / HD)", w: 1920, h: 1080 },
  { label: "9:16 (Reels / TikTok)", w: 1080, h: 1920 },
  { label: "1:1 (Square Post)", w: 1080, h: 1080 },
  { label: "4:3 (Classic Video)", w: 1024, h: 768 },
  { label: "4:5 (Instagram Portrait)", w: 1080, h: 1350 },
  { label: "21:9 (Ultrawide)", w: 2560, h: 1080 },
];

export default function AspectRatioTool() {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const ratio: RatioResult = useMemo(() => calculateRatio(width, height), [width, height]);

  const handleWidthChange = (newW: number) => {
    const val = Math.max(1, newW);
    setWidth(val);
    if (lockRatio) {
      const scaled = scaleDimension(width, height, val, undefined);
      setHeight(scaled.height);
    }
  };

  const handleHeightChange = (newH: number) => {
    const val = Math.max(1, newH);
    setHeight(val);
    if (lockRatio) {
      const scaled = scaleDimension(width, height, undefined, val);
      setWidth(scaled.width);
    }
  };

  const handleCopy = async () => {
    const text = `Aspect Ratio: ${ratio.ratioString} (${ratio.decimalRatio}) | Dimensions: ${width}x${height}px`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 items-end">
        <div className="space-y-1.5">
          <label className="text-xs text-[#8B95AD]">Width (px)</label>
          <Input
            type="number"
            min={1}
            max={32000}
            value={width}
            onChange={(e) => handleWidthChange(Number(e.target.value) || 1)}
            className="font-mono text-sm bg-[#121828] border-[#232C42] text-[#E6EAF2]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[#8B95AD]">Height (px)</label>
          <Input
            type="number"
            min={1}
            max={32000}
            value={height}
            onChange={(e) => handleHeightChange(Number(e.target.value) || 1)}
            className="font-mono text-sm bg-[#121828] border-[#232C42] text-[#E6EAF2]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={() => setLockRatio((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
            lockRatio ? "bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
          }`}
        >
          {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          {lockRatio ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}
        </button>
      </div>

      <div className="space-y-2 pt-2">
        <div className="text-xs text-[#8B95AD] font-medium">Standard Presets</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => { setWidth(p.w); setHeight(p.h); }}
              className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE]/40 text-left transition-colors flex justify-between items-center text-xs"
            >
              <span className="text-[#E6EAF2]">{p.label}</span>
              <span className="text-[#8B95AD] font-mono">{p.w}×{p.h}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-[#121828] border border-[#22D3EE]/40 bg-gradient-to-br from-[#22D3EE]/5 to-transparent text-center">
          <div className="text-xs text-[#22D3EE] font-medium">Aspect Ratio</div>
          <div className="text-3xl font-bold font-mono text-[#22D3EE] mt-1">{ratio.ratioString}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] text-center">
          <div className="text-xs text-[#8B95AD] font-medium">Decimal Ratio</div>
          <div className="text-3xl font-bold font-mono text-[#E6EAF2] mt-1">{ratio.decimalRatio}</div>
        </div>
      </div>

      {/* Visual Box Representation */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] flex flex-col items-center justify-center min-h-[180px] gap-2">
        <div className="text-xs text-[#8B95AD]">Visual Preview</div>
        <div
          style={{
            aspectRatio: `${width} / ${height}`,
            maxHeight: "130px",
            maxWidth: "100%",
          }}
          className="border-2 border-dashed border-[#22D3EE] rounded-lg bg-[#22D3EE]/10 flex items-center justify-center p-3 text-xs font-mono text-[#22D3EE] transition-all"
        >
          {width} × {height}
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
      >
        {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
        {copied ? "Copied!" : "Copy Ratio & Dimensions"}
      </Button>
    </div>
  );

  return (
    <ToolShell
      toolId="aspect-ratio"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
