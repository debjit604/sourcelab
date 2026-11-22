"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { generateUuids, UuidOptions } from "./process";
import { RefreshCw, Copy, Check } from "lucide-react";

const QUANTITY_PRESETS = [1, 5, 10, 25, 50];

export default function UuidGeneratorTool() {
  const [options, setOptions] = useState<UuidOptions>({
    quantity: 5,
    hyphens: true,
    uppercase: false,
    braces: false,
    quotes: "none",
    separator: "newline",
  });

  // Lazy initializer to avoid client render cascades
  const [result, setResult] = useState(() => generateUuids({
    quantity: 5,
    hyphens: true,
    uppercase: false,
    braces: false,
    quotes: "none",
    separator: "newline",
  }));

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = (customOptions: Partial<UuidOptions> = {}) => {
    const updated = { ...options, ...customOptions };
    setOptions(updated);
    const res = generateUuids(updated);
    setResult(res);
  };

  const handleCopySingle = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // fallback
    }
  };

  const isJson = options.separator === "json";
  const downloadExt = isJson ? "json" : "txt";
  const downloadMime = isJson ? "application/json" : "text/plain";

  return (
    <ToolShell
      toolId="uuid-generator"
      downloadFilename={`uuids-${result.count}.${downloadExt}`}
      downloadMimeType={downloadMime}
      onRunShortcut={() => handleGenerate()}
      input={
        <div className="space-y-6">
          {/* Quantity Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="uuid-qty-input"
                className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase tracking-wider"
              >
                Kitne UUIDs Chahiye? ({options.quantity})
              </label>
              <div className="flex items-center gap-1.5">
                {QUANTITY_PRESETS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleGenerate({ quantity: q })}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                      options.quantity === q
                        ? "bg-[var(--sl-accent)] text-slate-950 font-bold"
                        : "bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <input
              id="uuid-qty-range"
              type="range"
              min={1}
              max={100}
              value={options.quantity}
              onChange={(e) => handleGenerate({ quantity: Number(e.target.value) })}
              className="w-full accent-[var(--sl-accent)] cursor-pointer"
            />
          </div>

          {/* Format Options */}
          <div className="space-y-3 pt-4 border-t border-[var(--sl-border)]">
            <span className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase tracking-wider block">
              Format Toggles:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleGenerate({ hyphens: !options.hyphens })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.hyphens
                    ? "bg-[rgba(34,211,238,0.1)] border-[var(--sl-accent)] text-[var(--sl-text)]"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                <div className="text-xs font-medium font-sans">Hyphens (-)</div>
                <div className="text-[10px] font-mono text-[var(--sl-muted)] mt-0.5">
                  {options.hyphens ? "Included" : "Removed (raw hex)"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate({ uppercase: !options.uppercase })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.uppercase
                    ? "bg-[rgba(34,211,238,0.1)] border-[var(--sl-accent)] text-[var(--sl-text)]"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                <div className="text-xs font-medium font-sans">UPPERCASE</div>
                <div className="text-[10px] font-mono text-[var(--sl-muted)] mt-0.5">
                  {options.uppercase ? "ABCDEF" : "abcdef"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate({ braces: !options.braces })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.braces
                    ? "bg-[rgba(34,211,238,0.1)] border-[var(--sl-accent)] text-[var(--sl-text)]"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                <div className="text-xs font-medium font-sans">Braces &#123;&#125;</div>
                <div className="text-[10px] font-mono text-[var(--sl-muted)] mt-0.5">
                  {options.braces ? "&#123;uuid&#125;" : "No braces"}
                </div>
              </button>
            </div>
          </div>

          {/* Separator & Quotes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--sl-border)]">
            <div className="space-y-1.5">
              <label
                htmlFor="uuid-separator-select"
                className="text-xs font-mono text-[var(--sl-muted)]"
              >
                Separator:
              </label>
              <select
                id="uuid-separator-select"
                value={options.separator}
                onChange={(e) =>
                  handleGenerate({
                    separator: e.target.value as "newline" | "comma" | "json",
                  })
                }
                className="w-full p-2.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-sm text-[var(--sl-text)] font-mono outline-none"
              >
                <option value="newline">Line by Line (\n)</option>
                <option value="comma">Comma Separated (,)</option>
                <option value="json">JSON Array ([])</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="uuid-quotes-select"
                className="text-xs font-mono text-[var(--sl-muted)]"
              >
                Quotes:
              </label>
              <select
                id="uuid-quotes-select"
                value={options.quotes}
                onChange={(e) =>
                  handleGenerate({
                    quotes: e.target.value as "none" | "single" | "double",
                  })
                }
                className="w-full p-2.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-sm text-[var(--sl-text)] font-mono outline-none"
              >
                <option value="none">None</option>
                <option value="single">Single Quotes (&apos;)</option>
                <option value="double">Double Quotes (&quot;)</option>
              </select>
            </div>
          </div>

          {/* Big Action Button */}
          <button
            type="button"
            onClick={() => handleGenerate()}
            className="w-full py-3.5 px-4 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-bold font-heading hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Naye UUIDs Generate Karo (Ctrl + Enter)</span>
          </button>
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
            <span className="text-xs font-mono font-medium text-[var(--sl-accent)] uppercase tracking-wider">
              Generated UUIDs ({result.count})
            </span>
            <span className="text-xs font-mono text-[var(--sl-muted)]">
              RFC 4122 v4 Compliant
            </span>
          </div>

          {options.separator === "newline" ? (
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {result.items.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] group hover:border-[var(--sl-accent)] transition-colors"
                >
                  <span className="font-mono text-xs sm:text-sm text-[var(--sl-text)] select-all truncate">
                    {uuid}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySingle(uuid, i)}
                    className="p-1.5 rounded-lg text-[var(--sl-muted)] group-hover:text-[var(--sl-accent)] hover:bg-[var(--sl-surface)] transition-colors shrink-0"
                    title="Copy this UUID"
                    aria-label={`Copy UUID ${i + 1}`}
                  >
                    {copiedIndex === i ? (
                      <Check className="w-4 h-4 text-[var(--sl-success)]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              readOnly
              rows={12}
              value={result.output}
              className="w-full p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-text)] font-mono text-xs sm:text-sm resize-y leading-relaxed outline-none"
            />
          )}
        </div>
      }
    />
  );
}
