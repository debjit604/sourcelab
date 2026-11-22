"use client";

import React, { useState, useCallback } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { processPassword, PasswordProcessOutput, PasswordOptions } from "./process";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check, Shield, Sparkles } from "lucide-react";

export default function PasswordGeneratorToolComponent() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState(1);

  // Initialize password on initial render via lazy state initializer
  const [output, setOutput] = useState<PasswordProcessOutput | null>(() => {
    try {
      return processPassword({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
        count: 1,
      });
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(
    (customOpts?: Partial<PasswordOptions>) => {
      try {
        setError(null);
        const res = processPassword({
          length,
          uppercase,
          lowercase,
          numbers,
          symbols,
          excludeAmbiguous,
          count,
          ...customOpts,
        });
        setOutput(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      }
    },
    [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, count]
  );

  const handleCopy = (pw: string, index: number) => {
    navigator.clipboard.writeText(pw);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const strength = output?.strength;

  return (
    <ToolShell
      toolId="password-generator"
      downloadFilename="passwords.txt"
      downloadMimeType="text/plain"
      onRunShortcut={() => handleGenerate()}
      input={
        <div className="space-y-5">
          {/* Main preview box */}
          <div className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--sl-muted)] font-mono">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                Generated Password
              </span>
              {strength && (
                <span style={{ color: strength.color }} className="font-semibold">
                  {strength.label} ({strength.entropy} bits)
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)]">
              <div className="font-mono text-base md:text-lg font-bold text-[var(--sl-text)] break-all select-all">
                {output?.primary || "..."}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => output && handleCopy(output.primary, -1)}
                  aria-label="Copy password"
                  className="p-2 rounded-lg text-[var(--sl-muted)] hover:text-[var(--sl-accent)] hover:bg-[var(--sl-bg)] transition-colors"
                  title="Copy password"
                >
                  {copiedIndex === -1 ? (
                    <Check className="w-4 h-4 text-[var(--sl-success)]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  aria-label="Regenerate password"
                  className="p-2 rounded-lg text-[var(--sl-muted)] hover:text-[var(--sl-accent)] hover:bg-[var(--sl-bg)] transition-colors"
                  title="Regenerate password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Strength meter bar */}
            {strength && (
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        lvl <= strength.score ? strength.color : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Configuration controls */}
          <div className="space-y-4 p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs">
            {/* Length slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[var(--sl-text)] font-medium">Password Length</span>
                <span className="px-2 py-0.5 rounded bg-[var(--sl-surface)] text-[var(--sl-accent)] font-bold">
                  {length} chars
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLength(val);
                  handleGenerate({ length: val });
                }}
                className="w-full accent-[var(--sl-accent)] cursor-pointer"
              />
            </div>

            {/* Character toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => {
                    setUppercase(e.target.checked);
                    handleGenerate({ uppercase: e.target.checked });
                  }}
                  className="accent-[var(--sl-accent)] rounded"
                />
                <span className="font-mono text-[var(--sl-text)]">Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowercase}
                  onChange={(e) => {
                    setLowercase(e.target.checked);
                    handleGenerate({ lowercase: e.target.checked });
                  }}
                  className="accent-[var(--sl-accent)] rounded"
                />
                <span className="font-mono text-[var(--sl-text)]">Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={numbers}
                  onChange={(e) => {
                    setNumbers(e.target.checked);
                    handleGenerate({ numbers: e.target.checked });
                  }}
                  className="accent-[var(--sl-accent)] rounded"
                />
                <span className="font-mono text-[var(--sl-text)]">Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={symbols}
                  onChange={(e) => {
                    setSymbols(e.target.checked);
                    handleGenerate({ symbols: e.target.checked });
                  }}
                  className="accent-[var(--sl-accent)] rounded"
                />
                <span className="font-mono text-[var(--sl-text)]">Symbols (!@#$)</span>
              </label>
            </div>

            {/* Ambiguous filter */}
            <label className="flex items-center gap-2 p-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => {
                  setExcludeAmbiguous(e.target.checked);
                  handleGenerate({ excludeAmbiguous: e.target.checked });
                }}
                className="accent-[var(--sl-accent)] rounded"
              />
              <span className="font-mono text-[var(--sl-muted)]">
                Avoid confusing chars (1, l, I, 0, O)
              </span>
            </label>

            {/* Quantity selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[var(--sl-muted)]">Passcode Quantity:</span>
              <div className="flex items-center gap-1.5 font-mono">
                {[1, 5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setCount(num);
                      handleGenerate({ count: num });
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      count === num
                        ? "bg-[rgba(34,211,238,0.2)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.4)]"
                        : "bg-[var(--sl-surface)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="button"
            onClick={() => handleGenerate()}
            className="w-full font-heading font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Naya Password Generate Karo (Ctrl + Enter)
          </Button>
        </div>
      }
      output={
        output && output.passwords.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs font-mono text-[var(--sl-muted)]">
              <span>Entropy Pool: <strong className="text-[var(--sl-accent)]">{output.stats.poolSize} chars</strong></span>
              <span>Length: <strong className="text-[var(--sl-text)]">{output.stats.length}</strong></span>
              <span>Count: <strong className="text-[var(--sl-success)]">{output.stats.count}</strong></span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-auto pr-1">
              {output.passwords.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] hover:border-[rgba(34,211,238,0.4)] transition-all"
                >
                  <span className="font-mono text-xs md:text-sm text-[var(--sl-text)] break-all select-all flex-1">
                    {item.password}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.password, idx)}
                    className="p-1.5 rounded-lg text-[var(--sl-muted)] hover:text-[var(--sl-accent)] hover:bg-[var(--sl-surface)] transition-colors shrink-0"
                    title="Copy password"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-[var(--sl-success)]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
      error={error}
    />
  );
}
