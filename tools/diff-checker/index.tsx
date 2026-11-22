"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { computeDiff, DiffMode } from "./process";
import { ArrowLeftRight, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";

const SAMPLE_OLD = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const SAMPLE_NEW = `function calculateTotal(items, discountRate = 0) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const discount = subtotal * discountRate;
  return subtotal - discount;
}`;

export default function DiffCheckerTool() {
  const [oldText, setOldText] = useState(SAMPLE_OLD);
  const [newText, setNewText] = useState(SAMPLE_NEW);
  const [mode, setMode] = useState<DiffMode>("lines");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [viewType, setViewType] = useState<"visual" | "patch">("visual");

  const diffResult = computeDiff(oldText, newText, {
    mode,
    ignoreWhitespace,
    ignoreCase,
  });

  const handleSwap = () => {
    const temp = oldText;
    setOldText(newText);
    setNewText(temp);
  };

  const handleClear = () => {
    setOldText("");
    setNewText("");
  };

  const handleSample = () => {
    setOldText(SAMPLE_OLD);
    setNewText(SAMPLE_NEW);
  };

  return (
    <ToolShell
      toolId="diff-checker"
      downloadFilename="diff-patch.patch"
      downloadMimeType="text/plain"
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase">
              Input Comparisons:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[var(--sl-accent)] bg-[rgba(34,211,238,0.1)] hover:bg-[rgba(34,211,238,0.2)] rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample</span>
              </button>
              <button
                type="button"
                onClick={handleSwap}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-text)] rounded-lg transition-colors"
                title="Swap Inputs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-error)] rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Original Text Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="diff-original-input"
              className="text-xs font-mono text-[var(--sl-muted)] flex items-center justify-between"
            >
              <span>1. Original (Pehle Wala Text)</span>
              <span>{oldText.length} chars</span>
            </label>
            <textarea
              id="diff-original-input"
              rows={6}
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Original code ya text yahan paste karo..."
              className="w-full p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-[var(--sl-text)] font-mono text-xs resize-y outline-none leading-relaxed"
            />
          </div>

          {/* Modified Text Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="diff-modified-input"
              className="text-xs font-mono text-[var(--sl-muted)] flex items-center justify-between"
            >
              <span>2. Modified (Naya Text)</span>
              <span>{newText.length} chars</span>
            </label>
            <textarea
              id="diff-modified-input"
              rows={6}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Modified version yahan paste karo..."
              className="w-full p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-[var(--sl-text)] font-mono text-xs resize-y outline-none leading-relaxed"
            />
          </div>

          {/* Diff Controls */}
          <div className="space-y-3 pt-2 border-t border-[var(--sl-border)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-[var(--sl-muted)]">Granularity Mode:</span>
              <div className="flex items-center gap-1">
                {(["lines", "words", "chars"] as DiffMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg capitalize transition-colors ${
                      mode === m
                        ? "bg-[var(--sl-accent)] text-slate-950 font-bold"
                        : "bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--sl-muted)]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="accent-[var(--sl-accent)]"
                />
                <span>Ignore Whitespace</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="accent-[var(--sl-accent)]"
                />
                <span>Ignore Case</span>
              </label>
            </div>
          </div>
        </div>
      }
      output={
        <div className="space-y-4">
          {/* Header Stats */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--sl-border)] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-[rgba(52,211,153,0.15)] text-[var(--sl-success)] font-semibold">
                +{diffResult.addedCount} additions
              </span>
              <span className="px-2 py-0.5 rounded bg-[rgba(248,113,113,0.15)] text-[var(--sl-error)] font-semibold">
                -{diffResult.removedCount} deletions
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewType("visual")}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  viewType === "visual"
                    ? "bg-[rgba(34,211,238,0.2)] text-[var(--sl-accent)] font-semibold"
                    : "text-[var(--sl-muted)]"
                }`}
              >
                Visual Diff
              </button>
              <button
                type="button"
                onClick={() => setViewType("patch")}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  viewType === "patch"
                    ? "bg-[rgba(34,211,238,0.2)] text-[var(--sl-accent)] font-semibold"
                    : "text-[var(--sl-muted)]"
                }`}
              >
                Unified Patch
              </button>
            </div>
          </div>

          {/* Results Display */}
          {!diffResult.hasDifferences && oldText && newText ? (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-2 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)]">
              <CheckCircle2 className="w-6 h-6 text-[var(--sl-success)]" />
              <p className="text-sm font-semibold text-[var(--sl-text)]">
                Dono text bilkul same hain!
              </p>
              <p className="text-xs text-[var(--sl-muted)]">
                Koi bhi addition ya deletion nahi mila.
              </p>
            </div>
          ) : viewType === "patch" ? (
            <pre className="w-full p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-text)] font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed select-all">
              {diffResult.unifiedPatch}
            </pre>
          ) : (
            <div className="w-full p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs leading-relaxed max-h-[460px] overflow-y-auto space-y-1">
              {diffResult.parts.map((part, index) => {
                if (part.added) {
                  return (
                    <span
                      key={index}
                      className="bg-[rgba(52,211,153,0.18)] text-[var(--sl-success)] border-b border-[var(--sl-success)] px-0.5 rounded whitespace-pre-wrap font-semibold"
                    >
                      {part.value}
                    </span>
                  );
                }
                if (part.removed) {
                  return (
                    <span
                      key={index}
                      className="bg-[rgba(248,113,113,0.18)] text-[var(--sl-error)] border-b border-[var(--sl-error)] px-0.5 rounded whitespace-pre-wrap line-through font-semibold opacity-80"
                    >
                      {part.value}
                    </span>
                  );
                }
                return (
                  <span
                    key={index}
                    className="text-[var(--sl-muted)] whitespace-pre-wrap"
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      }
    />
  );
}
