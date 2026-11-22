"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, ListOrdered } from "lucide-react";
import { caesarShift, rot47, bruteForceAllShifts, RotAllShift } from "./process";

export default function CaesarRotTool() {
  const [input, setInput] = useState<string>("Khoor Zruog! Wklv lv D Shuvrqdo Vhfuhw.");
  const [shift, setShift] = useState<number>(3);
  const [direction, setDirection] = useState<"decode" | "encode">("decode");
  const [useRot47, setUseRot47] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const singleResult = useMemo(() => {
    if (useRot47) return rot47(input);
    return caesarShift(input, shift, direction === "decode");
  }, [input, shift, direction, useRot47]);

  const allShifts: RotAllShift[] = useMemo(() => {
    if (viewMode !== "all" || !input) return [];
    return bruteForceAllShifts(input);
  }, [input, viewMode]);

  const bestMatchShift = useMemo(() => {
    if (allShifts.length === 0) return null;
    let max = allShifts[0];
    for (const s of allShifts) {
      if (s.score > max.score) max = s;
    }
    return max.shift;
  }, [allShifts]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD]">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yahan text paste karein..."
          className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[140px] text-[#E6EAF2]"
        />
      </div>

      <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
        <button
          type="button"
          onClick={() => { setViewMode("single"); setDirection("decode"); }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "single" && direction === "decode"
              ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold"
              : "text-[#8B95AD]"
          }`}
        >
          Decode (-Shift)
        </button>
        <button
          type="button"
          onClick={() => { setViewMode("single"); setDirection("encode"); }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "single" && direction === "encode"
              ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold"
              : "text-[#8B95AD]"
          }`}
        >
          Encode (+Shift)
        </button>
        <button
          type="button"
          onClick={() => setViewMode("all")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1 ${
            viewMode === "all" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          All 25 Shifts
        </button>
      </div>

      {viewMode === "single" && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8B95AD]">Shift Key (ROT):</span>
            <span className="font-mono text-sm font-bold text-[#22D3EE]">
              {useRot47 ? "ROT-47" : `ROT-${shift}`}
            </span>
          </div>

          {!useRot47 && (
            <input
              type="range"
              min={1}
              max={25}
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="w-full accent-[#22D3EE]"
            />
          )}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: "ROT3 (Caesar)", s: 3 },
              { label: "ROT13", s: 13 },
              { label: "ROT5", s: 5 },
              { label: "ROT1", s: 1 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setShift(p.s); setUseRot47(false); }}
                className={`px-2 py-0.5 text-xs rounded border ${
                  !useRot47 && shift === p.s
                    ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]"
                    : "border-[#232C42] text-[#8B95AD]"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setUseRot47((prev) => !prev)}
              className={`px-2 py-0.5 text-xs rounded border ${
                useRot47 ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
              }`}
            >
              ROT-47
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {viewMode === "single" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#8B95AD]">Result</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(singleResult, "single")}
              className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
            >
              {copiedKey === "single" ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
              {copiedKey === "single" ? "Copied!" : "Copy Result"}
            </Button>
          </div>

          <Textarea
            readOnly
            value={singleResult}
            placeholder="Processed output..."
            className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[220px] text-[#22D3EE] select-all"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#8B95AD]">
            <span>Brute-force All 25 ROT Shifts</span>
            {bestMatchShift && <span className="text-[#34D399]">⭐ Best Match: ROT-{bestMatchShift}</span>}
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
            {allShifts.map((row) => (
              <div
                key={row.shift}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 transition-colors ${
                  row.shift === bestMatchShift
                    ? "bg-[#22D3EE]/10 border-[#22D3EE]/60"
                    : "bg-[#121828] border-[#232C42] hover:border-[#22D3EE]/30"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-[#22D3EE] shrink-0 w-14">
                    ROT-{row.shift}:
                  </span>
                  <span className="font-mono text-[#E6EAF2] truncate">{row.result}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(row.result, `rot-${row.shift}`)}
                  className="text-[#8B95AD] hover:text-[#22D3EE] shrink-0 p-1"
                >
                  {copiedKey === `rot-${row.shift}` ? (
                    <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="caesar-rot"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
