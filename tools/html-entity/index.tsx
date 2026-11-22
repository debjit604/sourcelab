"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { encodeHtmlEntities, decodeHtmlEntities } from "./process";

export default function HtmlEntityTool() {
  const [input, setInput] = useState<string>('<div class="box">SourceLab & Privacy © 2026</div>');
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState<"named" | "decimal" | "hex">("named");
  const [copied, setCopied] = useState<boolean>(false);

  const output = useMemo(() => {
    if (mode === "encode") {
      return encodeHtmlEntities(input, format);
    } else {
      return decodeHtmlEntities(input);
    }
  }, [input, mode, format]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSwap = () => {
    setInput(output);
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
        <button
          type="button"
          onClick={() => setMode("encode")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            mode === "encode" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Encode to Entities
        </button>
        <button
          type="button"
          onClick={() => setMode("decode")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            mode === "decode" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Decode to Text
        </button>
      </div>

      {mode === "encode" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8B95AD]">Format:</span>
          {(["named", "decimal", "hex"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`px-2.5 py-1 text-xs rounded border capitalize transition-colors ${
                format === fmt
                  ? "bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]"
                  : "border-[#232C42] text-[#8B95AD]"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      )}

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Enter raw text with special characters..." : "Enter text with &lt;entities&gt;..."}
        className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[220px] text-[#E6EAF2]"
      />

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSwap}
          className="border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
          Swap Input / Output
        </Button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs text-[#8B95AD] font-medium">Processed Output</label>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
        >
          {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? "Copied!" : "Copy Result"}
        </Button>
      </div>

      <Textarea
        readOnly
        value={output}
        placeholder="Output yahan aayega..."
        className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[220px] text-[#22D3EE] select-all"
      />
    </div>
  );

  return (
    <ToolShell
      toolId="html-entity"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
