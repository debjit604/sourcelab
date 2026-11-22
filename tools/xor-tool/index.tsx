"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Search } from "lucide-react";
import {
  executeKeyedXor,
  bruteForceSingleByteXor,
  XorBruteCandidate,
} from "./process";

const PRESETS = [
  {
    label: "Cryptopals Challenge 3",
    input: "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736",
    isHex: true,
  },
  {
    label: "Plaintext Sample",
    input: "SourceLab privacy first tools suite",
    isHex: false,
  },
];

export default function XorToolTool() {
  const [mode, setMode] = useState<"keyed" | "brute">("keyed");
  const [input, setInput] = useState<string>("Hello SourceLab");
  const [isInputHex, setIsInputHex] = useState<boolean>(false);
  const [key, setKey] = useState<string>("secret");
  const [isKeyHex, setIsKeyHex] = useState<boolean>(false);
  const [outputHex, setOutputHex] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const keyedResult = useMemo(() => {
    if (mode !== "keyed") return null;
    return executeKeyedXor(input, key, isInputHex, isKeyHex, outputHex);
  }, [mode, input, key, isInputHex, isKeyHex, outputHex]);

  const bruteCandidates: XorBruteCandidate[] = useMemo(() => {
    if (mode !== "brute" || !input) return [];
    return bruteForceSingleByteXor(input, isInputHex);
  }, [mode, input, isInputHex]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
        <button
          type="button"
          onClick={() => setMode("keyed")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "keyed" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Keyed XOR (Encode/Decode)
        </button>
        <button
          type="button"
          onClick={() => setMode("brute")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1 ${
            mode === "brute" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Single-Byte Brute-Force (256 Keys)
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label className="text-[#8B95AD]">Input Data</label>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#8B95AD]">
            <input
              type="checkbox"
              checked={isInputHex}
              onChange={(e) => setIsInputHex(e.target.checked)}
              className="accent-[#22D3EE]"
            />
            Input is Hex
          </label>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isInputHex ? "e.g. 1b373733..." : "Text enter karein..."}
          className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[120px] text-[#E6EAF2]"
        />
      </div>

      {mode === "keyed" && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="text-[#8B95AD]">XOR Key</label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#8B95AD]">
              <input
                type="checkbox"
                checked={isKeyHex}
                onChange={(e) => setIsKeyHex(e.target.checked)}
                className="accent-[#22D3EE]"
              />
              Key is Hex
            </label>
          </div>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={isKeyHex ? "Hex key (e.g. 5f or a1b2)" : "Secret string key..."}
            className="font-mono text-sm bg-[#0B0F1A] border-[#232C42] text-[#22D3EE]"
          />
          <div className="flex items-center gap-2 text-xs pt-1">
            <span className="text-[#8B95AD]">Output Format:</span>
            <button
              type="button"
              onClick={() => setOutputHex(true)}
              className={`px-2 py-0.5 rounded border ${
                outputHex ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
              }`}
            >
              Hex Bytes
            </button>
            <button
              type="button"
              onClick={() => setOutputHex(false)}
              className={`px-2 py-0.5 rounded border ${
                !outputHex ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
              }`}
            >
              Text (ASCII)
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-xs text-[#8B95AD] self-center">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setInput(p.input);
              setIsInputHex(p.isHex);
              if (p.isHex) setMode("brute");
            }}
            className="px-2.5 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {mode === "keyed" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#8B95AD]">XOR Output</label>
            {keyedResult && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(keyedResult.output, "keyed")}
                className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
              >
                {copiedKey === "keyed" ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
                {copiedKey === "keyed" ? "Copied!" : "Copy Output"}
              </Button>
            )}
          </div>
          <Textarea
            readOnly
            value={keyedResult ? keyedResult.output : ""}
            placeholder="XOR result..."
            className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[220px] text-[#22D3EE] select-all"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#8B95AD]">
            <span>Ranked Brute-Force Candidates (by English Frequency)</span>
            <span className="text-[#34D399]">Top 50 Shown</span>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
            {bruteCandidates.slice(0, 50).map((cand) => (
              <div
                key={cand.keyByte}
                className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE]/30 text-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-[#22D3EE] shrink-0 w-24">
                    Key: {cand.keyHex} ({cand.keyChar})
                  </span>
                  <span className="font-mono text-[#E6EAF2] truncate">{cand.plaintext}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cand.plaintext, `cand-${cand.keyByte}`)}
                  className="text-[#8B95AD] hover:text-[#22D3EE] shrink-0 p-1"
                >
                  {copiedKey === `cand-${cand.keyByte}` ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
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
      toolId="xor-tool"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
