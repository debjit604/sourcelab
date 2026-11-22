"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
import { testRegex, RegexTestResult } from "./process";

const PRESETS = [
  { label: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "Phone (10 Digits)", pattern: "\\b[6-9]\\d{9}\\b", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", flags: "gi" },
  { label: "IPv4 Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Hex Color", pattern: "#[0-9a-fA-F]{3,6}\\b", flags: "g" },
  { label: "Dates (YYYY-MM-DD)", pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b", flags: "g" },
];

const SAMPLE_TEXT = `Welcome to SourceLab (created on 2026-11-23).
Contact us at support@sourcelab.dev or info@google.com.
Indian mobile: 9876543210 or 8123456789.
Local IP: 192.168.1.1 and brand color #22D3EE.
Website: https://sourcelab.dev/tools`;

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState<string>("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState<string>("g");
  const [testText, setTestText] = useState<string>(SAMPLE_TEXT);
  const [copied, setCopied] = useState<boolean>(false);

  const result: RegexTestResult = useMemo(() => {
    return testRegex(pattern, flags, testText);
  }, [pattern, flags, testText]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag));
  };

  const handleCopyMatches = async () => {
    const list = result.matches.map((m) => m.match).join("\n");
    try {
      await navigator.clipboard.writeText(list);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD]">Regular Expression</label>
        <div className="flex gap-2">
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. \b[a-z]+\b"
            className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] text-[#22D3EE]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Flags:</span>
        {["g", "i", "m", "s"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toggleFlag(f)}
            className={`px-2 py-0.5 rounded font-mono font-bold border transition-colors ${
              flags.includes(f)
                ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]"
                : "border-[#232C42] text-[#8B95AD]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD]">Test Text</label>
        <Textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Yahan text enter karein..."
          className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[160px] text-[#E6EAF2]"
        />
      </div>

      <div className="space-y-2 pt-1">
        <div className="text-xs text-[#8B95AD] font-medium">Common Patterns</div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
              className="px-2 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#8B95AD]">
          Total Matches:{" "}
          <span className="text-[#22D3EE] font-mono font-bold">{result.totalMatches}</span>
        </div>
        {result.matches.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyMatches}
            className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
          >
            {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Copied!" : "Copy Matches"}
          </Button>
        )}
      </div>

      {result.error ? (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-[#F87171] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Regex Error: {result.error}</span>
        </div>
      ) : result.matches.length > 0 ? (
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {result.matches.map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#121828] border border-[#232C42] space-y-1 hover:border-[#22D3EE]/30"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8B95AD]">Match #{idx + 1} (Index: {m.index})</span>
              </div>
              <div className="font-mono text-sm text-[#22D3EE] font-medium break-all">{m.match}</div>
              {m.groups.length > 0 && (
                <div className="pt-1 text-xs text-[#8B95AD] flex gap-2 flex-wrap">
                  {m.groups.map((g, gi) => (
                    <span key={gi} className="px-1.5 py-0.5 rounded bg-[#0B0F1A] border border-[#232C42]">
                      Group {gi + 1}: <span className="text-[#34D399] font-mono">{g}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Koi match nahi mila. Regex pattern ya test string check karein.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="regex-tester"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
