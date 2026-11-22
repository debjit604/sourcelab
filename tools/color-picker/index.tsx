"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { parseColor, ColorFormats } from "./process";

const PRESET_COLORS = [
  "#22D3EE", // SourceLab Cyan
  "#34D399", // Emerald Green
  "#FBBF24", // Amber Yellow
  "#F87171", // Rose Red
  "#818CF8", // Indigo
  "#C084FC", // Purple
  "#38BDF8", // Sky Blue
  "#FB923C", // Orange
];

export default function ColorPickerTool() {
  const [hexInput, setHexInput] = useState<string>("#22D3EE");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const color: ColorFormats | null = useMemo(() => parseColor(hexInput), [hexInput]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs text-[#8B95AD]">Pick or Type Color</label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={color ? color.hex : "#22D3EE"}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
          />
          <Input
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#22D3EE or 22D3EE"
            className="font-mono text-sm bg-[#121828] border-[#232C42] text-[#E6EAF2]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-[#8B95AD]">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setHexInput(c)}
              style={{ backgroundColor: c }}
              className="w-7 h-7 rounded-full border-2 border-[#121828] hover:scale-110 transition-transform"
            />
          ))}
        </div>
      </div>

      {color && (
        <div
          style={{ backgroundColor: color.hex }}
          className="h-28 rounded-xl border border-[#232C42] flex items-center justify-center shadow-inner"
        >
          <span
            style={{ color: color.contrastBlack >= color.contrastWhite ? "#000000" : "#ffffff" }}
            className="font-mono text-lg font-bold"
          >
            {color.hex.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );

  const formatList = color
    ? [
        { label: "HEX", value: color.hex.toUpperCase(), key: "hex" },
        { label: "RGB", value: color.rgbString, key: "rgb" },
        { label: "HSL", value: color.hslString, key: "hsl" },
        { label: "CMYK", value: color.cmykString, key: "cmyk" },
      ]
    : [];

  const outputPanel = (
    <div className="space-y-5">
      {color ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {formatList.map((fmt) => (
              <div
                key={fmt.key}
                className="p-3 rounded-lg bg-[#121828] border border-[#232C42] flex items-center justify-between hover:border-[#22D3EE]/30 transition-colors"
              >
                <div>
                  <div className="text-[11px] text-[#8B95AD]">{fmt.label}</div>
                  <div className="text-sm font-mono text-[#E6EAF2]">{fmt.value}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(fmt.value, fmt.key)}
                  className="h-8 w-8 p-0 text-[#8B95AD] hover:text-[#22D3EE]"
                >
                  {copiedKey === fmt.key ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </div>

          {/* WCAG Contrast */}
          <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
            <div className="text-xs text-[#8B95AD] font-medium">WCAG Contrast Ratios</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-[#0B0F1A] border border-[#232C42]">
                <div className="text-[#8B95AD]">On Black: {color.contrastBlack}:1</div>
                <div className={color.contrastBlack >= 4.5 ? "text-[#34D399] font-medium" : "text-[#F87171]"}>
                  {color.contrastBlack >= 7 ? "AAA Pass" : color.contrastBlack >= 4.5 ? "AA Pass" : "Fail"}
                </div>
              </div>
              <div className="p-2 rounded bg-[#0B0F1A] border border-[#232C42]">
                <div className="text-[#8B95AD]">On White: {color.contrastWhite}:1</div>
                <div className={color.contrastWhite >= 4.5 ? "text-[#34D399] font-medium" : "text-[#F87171]"}>
                  {color.contrastWhite >= 7 ? "AAA Pass" : color.contrastWhite >= 4.5 ? "AA Pass" : "Fail"}
                </div>
              </div>
            </div>
          </div>

          {/* Tints & Shades Palette */}
          <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
            <div className="text-xs text-[#8B95AD] font-medium">Shades & Tints (100–900)</div>
            <div className="grid grid-cols-9 gap-1">
              {color.shades.map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setHexInput(s.hex)}
                  title={`${s.level}: ${s.hex}`}
                  className="h-10 rounded flex flex-col justify-end p-0.5 text-[9px] font-mono hover:scale-105 transition-transform"
                  style={{ backgroundColor: s.hex }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Aapne invalid HEX color dala hai. Kripya valid 6-digit hex code likhein.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="color-picker"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
