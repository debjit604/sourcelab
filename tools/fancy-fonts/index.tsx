"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { convertToStyles, FontStyleItem } from "./process";
import { Copy, Check, Sparkles } from "lucide-react";

export default function FancyFontsTool() {
  const [input, setInput] = useState<string>("SourceLab 2026");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const styles = useMemo(() => convertToStyles(input), [input]);

  const handleCopy = (item: FontStyleItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Input Text Box */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">
          Type or Paste Text to Style
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Apna name ya bio text likho..."
          className="w-full px-3 py-2.5 text-base font-medium bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-[#8B95AD] self-center">Presets:</span>
        <button
          type="button"
          onClick={() => setInput("SourceLab")}
          className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Brand Name
        </button>
        <button
          type="button"
          onClick={() => setInput("Gamer Pro 99")}
          className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Gamer Tag
        </button>
        <button
          type="button"
          onClick={() => setInput("Love & Peace")}
          className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Aesthetic Bio
        </button>
      </div>

      {/* Info Notice */}
      <div className="p-3.5 rounded-xl bg-[#0B0F1A] border border-[#232C42] text-xs text-[#8B95AD] flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
        <div>
          Ye pure Unicode mathematical symbols hain. Inhe kisi bhi social platform (Instagram, Discord, WhatsApp, Twitter) par copy-paste kar sakte ho bina kisi styling loss ke.
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-3">
      <div className="text-xs text-[#8B95AD] font-medium">
        Available Unicode Font Styles ({styles.length})
      </div>
      <div className="grid grid-cols-1 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
        {styles.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-[#121828] border border-[#232C42] hover:border-[#22D3EE]/50 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="space-y-1 min-w-0">
              <div className="text-[11px] text-[#8B95AD] flex items-center gap-1.5">
                <span>{item.name}</span>
              </div>
              <div className="text-base text-[#E6EAF2] break-all select-all font-sans">
                {item.text}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(item)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                copiedId === item.id
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE] hover:border-[#22D3EE]"
              }`}
            >
              {copiedId === item.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="fancy-fonts"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
