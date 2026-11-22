"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  textToBinary,
  binaryToText,
  calculateBitStats,
  bytesToHex,
  bytesToDecimal,
  DelimiterType,
  PrefixType,
} from "./process";
import { Copy, Check, Hash } from "lucide-react";

export default function TextBinaryTool() {
  const [mode, setMode] = useState<"text-to-binary" | "binary-to-text">("text-to-binary");
  const [input, setInput] = useState<string>("SourceLab 2026");
  const [delimiter, setDelimiter] = useState<DelimiterType>("space");
  const [prefix, setPrefix] = useState<PrefixType>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<boolean>(false);

  const { output, hex, decimal, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: "", hex: "", decimal: "", error: null };
    }
    try {
      if (mode === "text-to-binary") {
        const bin = textToBinary(input, delimiter, prefix);
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        return {
          output: bin,
          hex: bytesToHex(bytes),
          decimal: bytesToDecimal(bytes),
          error: null,
        };
      } else {
        const decoded = binaryToText(input);
        const encoder = new TextEncoder();
        const bytes = encoder.encode(decoded);
        return {
          output: decoded,
          hex: bytesToHex(bytes),
          decimal: bytesToDecimal(bytes),
          error: null,
        };
      }
    } catch (err: unknown) {
      return {
        output: "",
        hex: "",
        decimal: "",
        error: err instanceof Error ? err.message : "Invalid binary data",
      };
    }
  }, [input, mode, delimiter, prefix]);

  const stats = useMemo(() => {
    const binForStats =
      mode === "text-to-binary" ? output : input;
    return calculateBitStats(binForStats);
  }, [input, output, mode]);

  const handleCopy = (text: string, type: "main" | "hex") => {
    navigator.clipboard.writeText(text);
    if (type === "main") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex gap-2 p-1 bg-[#121828] border border-[#232C42] rounded-lg">
        <button
          type="button"
          onClick={() => {
            setMode("text-to-binary");
            setInput("SourceLab 2026");
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
            mode === "text-to-binary"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Text → Binary
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("binary-to-text");
            setInput("01010011 01101111 01110101 01110010 01100011 01100101");
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
            mode === "binary-to-text"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Binary → Text
        </button>
      </div>

      {/* Input Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">
          {mode === "text-to-binary"
            ? "Plain Text (UTF-8 supported)"
            : "Binary Bitstream (0s and 1s)"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={
            mode === "text-to-binary"
              ? "Type text to convert to binary..."
              : "01001000 01101001..."
          }
          className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE] resize-y"
        />
      </div>

      {/* Formatting Options (Active when Text -> Binary) */}
      {mode === "text-to-binary" && (
        <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3">
          <div className="text-xs font-medium text-[#8B95AD]">Binary Output Formatting</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[#8B95AD] self-center">Delimiter:</span>
            {(["space", "none", "comma", "hyphen"] as DelimiterType[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDelimiter(d)}
                className={`px-2.5 py-1 rounded border capitalize transition-all ${
                  delimiter === d
                    ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]"
                    : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
                }`}
              >
                {d === "space" ? "Space (8-bit)" : d === "none" ? "None (Stream)" : d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs pt-1">
            <span className="text-[#8B95AD]">Byte Prefix:</span>
            <button
              type="button"
              onClick={() => setPrefix(prefix === "0b" ? "" : "0b")}
              className={`px-2.5 py-1 rounded border transition-all ${
                prefix === "0b"
                  ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]"
                  : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
              }`}
            >
              0b Prefix {prefix === "0b" ? "(On)" : "(Off)"}
            </button>
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => {
            if (mode === "text-to-binary") setInput("Hello World!");
            else setInput("01001000 01100101 01101100 01101100 01101111");
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Hello World
        </button>
        <button
          type="button"
          onClick={() => {
            if (mode === "text-to-binary") setInput("CTF{b1n4ry_h4ck3r}");
            else setInput("01000011 01010100 01000110 01111011 01100010 00110001 01101110 00110100 01110010 01111001 01111101");
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          CTF Flag
        </button>
        <button
          type="button"
          onClick={() => {
            if (mode === "text-to-binary") setInput("Hindi: नमस्ते");
            else setInput("11100000 10100100 10111000 11100000 10100100 10111010");
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          UTF-8 Multibyte
        </button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Main Output Box */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <span>{mode === "text-to-binary" ? "Binary Representation" : "Decoded Text"}</span>
          <button
            type="button"
            onClick={() => handleCopy(output, "main")}
            disabled={!output}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="font-mono text-sm text-[#E6EAF2] bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] break-all select-all min-h-[90px] whitespace-pre-wrap">
          {output || <span className="text-[#8B95AD]">Output yahan dikhega...</span>}
        </div>
      </div>

      {/* Bit Statistics */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Total Bits</div>
          <div className="text-base font-bold font-mono text-[#E6EAF2]">
            {stats.totalBits}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Bytes</div>
          <div className="text-base font-bold font-mono text-[#22D3EE]">
            {stats.byteCount}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Ones (1s)</div>
          <div className="text-base font-bold font-mono text-green-400">
            {stats.onesCount}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[10px] text-[#8B95AD]">Zeros (0s)</div>
          <div className="text-base font-bold font-mono text-[#8B95AD]">
            {stats.zerosCount}
          </div>
        </div>
      </div>

      {/* Side-by-Side Hex Representation */}
      {hex && (
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#8B95AD]">
            <div className="flex items-center gap-1.5 font-medium text-[#E6EAF2]">
              <Hash className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Hex Bytes:</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(hex, "hex")}
              className="text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              {copiedHex ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedHex ? "Copied" : "Copy Hex"}
            </button>
          </div>
          <div className="font-mono text-xs text-[#22D3EE] bg-[#0B0F1A] p-2 rounded border border-[#232C42] break-all select-all">
            {hex}
          </div>
        </div>
      )}

      {/* Side-by-Side Decimal Representation */}
      {decimal && (
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] space-y-1.5 text-xs">
          <div className="text-[#8B95AD] font-medium text-[#E6EAF2]">
            Decimal Byte Values:
          </div>
          <div className="font-mono text-xs text-[#8B95AD] bg-[#0B0F1A] p-2 rounded border border-[#232C42] break-all select-all">
            {decimal}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="text-binary"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
