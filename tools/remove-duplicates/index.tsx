"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { deduplicateLines, DeduplicateOptions } from "./process";
import { Copy, Check, Download, Trash2 } from "lucide-react";

export default function RemoveDuplicatesTool() {
  const [input, setInput] = useState<string>(
    "Delhi\nBengaluru\nMumbai\nDelhi\nHyderabad\nBengaluru\nKolkata\nMumbai\nPune"
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [sort, setSort] = useState<"none" | "asc" | "desc">("none");
  const [copied, setCopied] = useState<boolean>(false);

  const options: DeduplicateOptions = useMemo(
    () => ({ caseSensitive, trimWhitespace, removeEmptyLines, sort }),
    [caseSensitive, trimWhitespace, removeEmptyLines, sort]
  );

  const result = useMemo(() => deduplicateLines(input, options), [input, options]);

  const handleCopy = () => {
    if (!result.result) return;
    navigator.clipboard.writeText(result.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result.result) return;
    const blob = new Blob([result.result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deduplicated-list.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Input Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <label className="font-medium">Paste List or Text (One item per line)</label>
          <button
            type="button"
            onClick={() => setInput("")}
            className="flex items-center gap-1 text-[#8B95AD] hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={9}
          placeholder="Lines yahan paste karo..."
          className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE] resize-y"
        />
      </div>

      {/* Deduplication Controls */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3">
        <div className="text-xs font-medium text-[#8B95AD]">Options</div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded"
            />
            <span>Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded"
            />
            <span>Remove Empty Lines</span>
          </label>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-[#8B95AD]">Sort Output:</span>
          {(["none", "asc", "desc"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`px-2.5 py-1 rounded border capitalize transition-all ${
                sort === s
                  ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-medium"
                  : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
              }`}
            >
              {s === "none" ? "Keep Order" : s === "asc" ? "A → Z" : "Z → A"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Output Display */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <span>Unique Lines Result</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!result.result}
              className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!result.result}
              className="flex items-center gap-1 text-[#8B95AD] hover:text-[#E6EAF2] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .txt</span>
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={result.result}
          rows={9}
          placeholder="Unique lines yahan dikhengi..."
          className="w-full px-3 py-2 text-sm font-mono bg-[#0B0F1A] border border-[#232C42] rounded-lg text-[#E6EAF2] resize-y select-all focus:outline-none"
        />
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD]">Total Lines</div>
          <div className="text-xl font-bold font-mono text-[#E6EAF2]">
            {result.totalCount}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD]">Unique Lines</div>
          <div className="text-xl font-bold font-mono text-[#22D3EE]">
            {result.uniqueCount}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD]">Duplicates Removed</div>
          <div className="text-xl font-bold font-mono text-red-400">
            {result.duplicateCount}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="remove-duplicates"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
