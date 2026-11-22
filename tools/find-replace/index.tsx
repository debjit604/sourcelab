"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { findAndReplace, FindReplaceOptions } from "./process";
import { Copy, Check, Download, Replace, AlertCircle } from "lucide-react";

export default function FindReplaceTool() {
  const [text, setText] = useState<string>(
    "Welcome to SourceLab. SourceLab gives you 100% privacy-first tools.\nEvery tool in SourceLab runs completely in your browser."
  );
  const [find, setFind] = useState<string>("SourceLab");
  const [replaceWith, setReplaceWith] = useState<string>("SourceLab Suite");
  const [isRegex, setIsRegex] = useState<boolean>(false);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [matchWholeWord, setMatchWholeWord] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const options: FindReplaceOptions = useMemo(
    () => ({ isRegex, caseSensitive, matchWholeWord }),
    [isRegex, caseSensitive, matchWholeWord]
  );

  const { result, matchCount, error } = useMemo(() => {
    try {
      const res = findAndReplace(text, find, replaceWith, options);
      return { result: res.result, matchCount: res.matchCount, error: null };
    } catch (err: unknown) {
      return {
        result: text,
        matchCount: 0,
        error: err instanceof Error ? err.message : "Error executing replace",
      };
    }
  }, [text, find, replaceWith, options]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "replaced-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Source Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">Source Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Yahan source text paste karo..."
          className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE] resize-y"
        />
      </div>

      {/* Find & Replace Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-[#8B95AD] font-medium">Find</label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Search text ya regex..."
            className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[#8B95AD] font-medium">Replace With</label>
          <input
            type="text"
            value={replaceWith}
            onChange={(e) => setReplaceWith(e.target.value)}
            placeholder="Replacement string ($1 for groups)..."
            className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          />
        </div>
      </div>

      {/* Options */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-2.5">
        <div className="text-xs font-medium text-[#8B95AD]">Search Modifiers</div>
        <div className="flex flex-wrap gap-4 text-xs">
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
              checked={matchWholeWord}
              disabled={isRegex}
              onChange={(e) => setMatchWholeWord(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded disabled:opacity-50"
            />
            <span>Match Whole Word (\b)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-[#22D3EE] font-medium">
            <input
              type="checkbox"
              checked={isRegex}
              onChange={(e) => setIsRegex(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded"
            />
            <span>Regex Mode</span>
          </label>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => {
            setFind("https://");
            setReplaceWith("http://");
            setIsRegex(false);
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          HTTPS → HTTP
        </button>
        <button
          type="button"
          onClick={() => {
            setFind("\\s+");
            setReplaceWith(" ");
            setIsRegex(true);
          }}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Strip Extra Spaces (Regex)
        </button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Output Display */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <div className="flex items-center gap-2">
            <span>Result</span>
            <span className="px-2 py-0.5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-mono font-bold">
              {matchCount} {matchCount === 1 ? "match" : "matches"} replaced
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!result}
              className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!result}
              className="flex items-center gap-1 text-[#8B95AD] hover:text-[#E6EAF2] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .txt</span>
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={result}
          rows={8}
          placeholder="Replaced output yahan dikhega..."
          className="w-full px-3 py-2 text-sm font-mono bg-[#0B0F1A] border border-[#232C42] rounded-lg text-[#E6EAF2] resize-y select-all focus:outline-none"
        />
      </div>

      {/* Error alert if regex fails */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Replace Action Banner */}
      <div className="p-3 rounded-lg bg-[#0B0F1A] border border-[#232C42] flex items-center justify-between text-xs text-[#8B95AD]">
        <div className="flex items-center gap-2">
          <Replace className="w-4 h-4 text-[#22D3EE]" />
          <span>Matches are updated automatically in real-time as you type.</span>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="find-replace"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
