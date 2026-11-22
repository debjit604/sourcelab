"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { generateLorem, LoremUnit } from "./process";
import { RefreshCw, Code } from "lucide-react";

const PRESETS = [1, 3, 5, 10, 20];

export default function LoremGeneratorTool() {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);

  // Lazy initializer to avoid client render cascades
  const [result, setResult] = useState(() =>
    generateLorem({ count: 3, unit: "paragraphs", startWithLorem: true, asHtml: false })
  );

  const handleGenerate = (overrides: {
    unit?: LoremUnit;
    count?: number;
    startWithLorem?: boolean;
    asHtml?: boolean;
  } = {}) => {
    const nextUnit = overrides.unit ?? unit;
    const nextCount = overrides.count ?? count;
    const nextStart = overrides.startWithLorem ?? startWithLorem;
    const nextHtml = overrides.asHtml ?? asHtml;

    if (overrides.unit !== undefined) setUnit(overrides.unit);
    if (overrides.count !== undefined) setCount(overrides.count);
    if (overrides.startWithLorem !== undefined) setStartWithLorem(overrides.startWithLorem);
    if (overrides.asHtml !== undefined) setAsHtml(overrides.asHtml);

    const res = generateLorem({
      unit: nextUnit,
      count: nextCount,
      startWithLorem: nextStart,
      asHtml: nextHtml,
    });
    setResult(res);
  };

  const downloadExt = asHtml ? "html" : "txt";
  const downloadMime = asHtml ? "text/html" : "text/plain";

  return (
    <ToolShell
      toolId="lorem-generator"
      downloadFilename={`lorem-ipsum-${count}-${unit}.${downloadExt}`}
      downloadMimeType={downloadMime}
      onRunShortcut={() => handleGenerate()}
      input={
        <div className="space-y-5">
          {/* Unit Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase tracking-wider block">
              Generate Unit:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["paragraphs", "sentences", "words"] as LoremUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleGenerate({ unit: u })}
                  className={`py-2.5 px-3 rounded-xl border text-center capitalize transition-all ${
                    unit === u
                      ? "bg-[rgba(34,211,238,0.15)] border-[var(--sl-accent)] text-[var(--sl-accent)] font-bold shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                      : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                  }`}
                >
                  <span className="text-xs font-sans font-medium">{u}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Count Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="lorem-count-input"
                className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase tracking-wider"
              >
                Quantity: ({count} {unit})
              </label>
              <div className="flex items-center gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleGenerate({ count: p })}
                    className={`px-2 py-0.5 text-xs font-mono rounded-lg transition-colors ${
                      count === p
                        ? "bg-[var(--sl-accent)] text-slate-950 font-bold"
                        : "bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <input
              id="lorem-count-input"
              type="range"
              min={1}
              max={unit === "words" ? 100 : 30}
              value={count}
              onChange={(e) => handleGenerate({ count: Number(e.target.value) })}
              className="w-full accent-[var(--sl-accent)] cursor-pointer"
            />
          </div>

          {/* Formatting Options */}
          <div className="space-y-2.5 pt-2 border-t border-[var(--sl-border)] text-xs font-mono text-[var(--sl-muted)]">
            <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--sl-text)]">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => handleGenerate({ startWithLorem: e.target.checked })}
                className="accent-[var(--sl-accent)]"
              />
              <span>Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--sl-text)]">
              <input
                type="checkbox"
                checked={asHtml}
                onChange={(e) => handleGenerate({ asHtml: e.target.checked })}
                className="accent-[var(--sl-accent)]"
              />
              <span className="flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                <span>Wrap inside HTML &lt;p&gt; tags</span>
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => handleGenerate()}
            className="w-full py-3.5 px-4 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-bold font-heading hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Naya Text Generate Karo (Ctrl + Enter)</span>
          </button>
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3 text-xs font-mono">
            <span className="text-[var(--sl-accent)] font-semibold uppercase">
              Generated Dummy Text
            </span>
            <div className="flex items-center gap-2 text-[var(--sl-muted)]">
              <span>{result.wordCount} words</span>
              <span>•</span>
              <span>{result.charCount} chars</span>
            </div>
          </div>

          <textarea
            readOnly
            rows={15}
            value={result.output}
            className="w-full p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs sm:text-sm text-[var(--sl-text)] leading-relaxed resize-y outline-none select-all"
          />
        </div>
      }
    />
  );
}
