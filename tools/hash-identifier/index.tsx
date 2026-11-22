"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { identifyHash, HashAnalysisResult } from "./process";

const SAMPLES = [
  { label: "MD5 (32 hex)", val: "5d41402abc4b2a76b9719d911017c592" },
  { label: "SHA-256 (64 hex)", val: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae" },
  { label: "bcrypt ($2a$)", val: "$2a$12$e8Mc8JwPjHvy0UdxjAeqrO3wP1J2X4k.0fG9z9X8H1WqZ7lM6rK4e" },
  { label: "SHA-1 (40 hex)", val: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d" },
];

export default function HashIdentifierTool() {
  const [input, setInput] = useState<string>("5d41402abc4b2a76b9719d911017c592");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result: HashAnalysisResult = useMemo(() => identifyHash(input), [input]);

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
        <label className="text-xs text-[#8B95AD]">Enter Hash String</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste hash here (MD5, SHA, bcrypt, NTLM...)"
          className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[140px] text-[#22D3EE]"
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-xs text-[#8B95AD] self-center">Try Sample:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setInput(s.val)}
            className="px-2.5 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {s.label}
          </button>
        ))}
      </div>

      {result.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#8B95AD]">Character Count:</span>
            <div className="font-mono text-sm font-bold text-[#E6EAF2]">{result.length} Chars</div>
          </div>
          <div>
            <span className="text-[#8B95AD]">Charset:</span>
            <div className="font-mono text-xs text-[#22D3EE] font-medium truncate">{result.charset}</div>
          </div>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-[#8B95AD]">
        <span>
          Possible Algorithms: <span className="text-[#22D3EE] font-bold">{result.matches.length}</span>
        </span>
      </div>

      {result.matches.length > 0 ? (
        <div className="space-y-3 max-h-[360px] overflow-y-auto">
          {result.matches.map((m, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] hover:border-[#22D3EE]/30 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#E6EAF2]">{m.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD]">
                    {m.category}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    m.confidence === "High"
                      ? "bg-green-500/10 text-[#34D399]"
                      : m.confidence === "Medium"
                      ? "bg-amber-500/10 text-[#FBBF24]"
                      : "bg-[#232C42] text-[#8B95AD]"
                  }`}
                >
                  {m.confidence} Confidence
                </span>
              </div>

              <p className="text-xs text-[#8B95AD]">{m.description}</p>

              <div className="flex flex-wrap gap-2 pt-1 border-t border-[#232C42]/60 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => copyToClipboard(m.hashcat, `cat-${i}`)}
                  className="px-2 py-1 rounded bg-[#0B0F1A] border border-[#232C42] text-[#22D3EE] hover:bg-[#1A2234] flex items-center gap-1.5"
                >
                  {copiedKey === `cat-${i}` ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Hashcat: {m.hashcat}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(m.john, `john-${i}`)}
                  className="px-2 py-1 rounded bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2] hover:bg-[#1A2234] flex items-center gap-1.5"
                >
                  {copiedKey === `john-${i}` ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>John: {m.john}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : input ? (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Is length ({input.length} chars) ka koi standard hash match nahi mila. Format verify karein.
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Unknown hash paste karein taaki algorithm detect kiya ja sake.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="hash-identifier"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
