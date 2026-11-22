"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { autoMagicDecode, tryRot13, AutoDecodeResult } from "./process";

const PRESETS = [
  { label: "Base64", val: "U291cmNlTGFiIDIwMjYgLSBQcml2YXRlIFRvb2xz" },
  { label: "Hex", val: "536f757263654c61622050726976616379" },
  { label: "Binary", val: "01010011 01101111 01110101 01110010 01100011 01100101" },
  { label: "Nested (B64 in Hex)", val: "NTM2Zjc1NzI2MzY1NGM2MTYy" },
  { label: "URL Encoded", val: "Hello%20SourceLab%21%20%402026" },
];

export default function MagicDecoderTool() {
  const [input, setInput] = useState<string>("U291cmNlTGFiIDIwMjYgLSBQcml2YXRlIFRvb2xz");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result: AutoDecodeResult = useMemo(() => autoMagicDecode(input), [input]);
  const rot13Val = useMemo(() => (input ? tryRot13(input) : ""), [input]);

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
        <label className="text-xs text-[#8B95AD]">Paste Encoded Payload / Ciphertext</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste encoded text (Base64, Hex, Binary, URL encoded...)"
          className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[140px] text-[#E6EAF2]"
        />
      </div>

      <div className="space-y-2 pt-1">
        <div className="text-xs text-[#8B95AD] font-medium">Try Presets:</div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInput(p.val)}
              className="px-2.5 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {rot13Val && (
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] flex items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[#8B95AD]">ROT13 Equivalent: </span>
            <span className="font-mono text-[#E6EAF2]">{rot13Val}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(rot13Val, "rot13")}
            className="text-[#8B95AD] hover:text-[#22D3EE] p-1"
          >
            {copiedKey === "rot13" ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs text-[#8B95AD] font-medium">
          {result.isDecoded ? `Decoded (${result.layers.length} Layers Unwrapped)` : "Decode Result"}
        </label>
        {result.decoded && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(result.decoded, "final")}
            className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
          >
            {copiedKey === "final" ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
            {copiedKey === "final" ? "Copied!" : "Copy Result"}
          </Button>
        )}
      </div>

      {result.isDecoded ? (
        <div className="space-y-3">
          {/* Final Decoded Box */}
          <div className="p-4 rounded-xl bg-[#121828] border border-[#22D3EE]/40 bg-gradient-to-br from-[#22D3EE]/5 to-transparent space-y-2">
            <div className="text-xs text-[#22D3EE] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Decoded Plaintext:</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-[#E6EAF2] break-all select-all">
              {result.decoded}
            </div>
          </div>

          {/* Step-by-step layer breadcrumb */}
          <div className="space-y-2">
            <div className="text-xs text-[#8B95AD] font-medium">Decoding Recipe Layers:</div>
            <div className="space-y-1.5">
              {result.layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0B0F1A] border border-[#232C42] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-[#34D399] font-semibold">{layer.method}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B95AD]" />
                    <span className="text-[#8B95AD] truncate max-w-[180px] sm:max-w-[280px]">{layer.output}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(layer.output, `step-${idx}`)}
                    className="text-[#8B95AD] hover:text-[#22D3EE]"
                  >
                    {copiedKey === `step-${idx}` ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Is string me koi standard encoding (Base64, Hex, URL, Binary) detect nahi hui.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="magic-decoder"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
