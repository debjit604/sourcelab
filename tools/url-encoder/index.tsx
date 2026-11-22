"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processUrl, UrlMode, UrlProcessOutput } from "./process";
import { readFileAsText } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, ArrowRightLeft, Link2, Copy, Check } from "lucide-react";

const SAMPLE_URL = "https://sourcelab.app/search?query=privacy tools&filter=free browser tools&sort=popular#top";

export default function UrlEncoderToolComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<UrlMode>("encode_component");
  const [stats, setStats] = useState<UrlProcessOutput["stats"] | null>(null);
  const [params, setParams] = useState<UrlProcessOutput["params"] | undefined>(undefined);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRun = () => {
    try {
      setLoading(true);
      setError(null);
      const res = processUrl({
        text: input,
        mode,
      });
      setOutput(res.result);
      setStats(res.stats);
      setParams(res.params);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      setOutput("");
      setStats(null);
      setParams(undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput("");
      setMode(mode === "decode" ? "encode_component" : "decode");
      setStats(null);
      setParams(undefined);
      setError(null);
    } else {
      setMode(mode === "decode" ? "encode_component" : "decode");
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const text = await readFileAsText(files[0]);
      setInput(text);
      const res = processUrl({ text, mode });
      setOutput(res.result);
      setStats(res.stats);
      setParams(res.params);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_URL);
    try {
      const res = processUrl({ text: SAMPLE_URL, mode });
      setOutput(res.result);
      setStats(res.stats);
      setParams(res.params);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setStats(null);
    setParams(undefined);
  };

  const handleCopyParam = (val: string, keyName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <ToolShell
      toolId="url-encoder"
      downloadFilename={mode === "decode" ? "decoded-url.txt" : "encoded-url.txt"}
      downloadMimeType="text/plain"
      onRunShortcut={handleRun}
      input={
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode("encode_component")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mode === "encode_component"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                Encode Component
              </button>
              <button
                type="button"
                onClick={() => setMode("encode_full")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mode === "encode_full"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                Full URL
              </button>
              <button
                type="button"
                onClick={() => setMode("decode")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mode === "decode"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                Decode
              </button>

              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap mode and content"
                title="Swap mode & content"
                className="p-1.5 rounded-lg text-[var(--sl-muted)] hover:text-[var(--sl-accent)] hover:bg-[var(--sl-surface)] transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.1)] transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Sample</span>
              </button>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-muted)] hover:text-[var(--sl-error)] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "decode"
                ? "Yahan percent-encoded URL string paste karo..."
                : "Yahan raw URL ya query string paste karo..."
            }
            rows={8}
            className="font-mono text-xs md:text-sm resize-y bg-[var(--sl-bg)]"
          />

          {/* Dropzone */}
          <Dropzone
            accept=".txt,.url"
            multiple={false}
            maxSizeMB={5}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="Text ya URL file drop karo (Max 5MB)"
          />

          {/* Run button */}
          <Button
            type="button"
            onClick={handleRun}
            disabled={loading || !input.trim()}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Processing chal rahi hai..." : `${mode === "decode" ? "Decode Karo" : "Encode Karo"} (Ctrl + Enter)`}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-4">
            {stats && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[11px] font-mono text-[var(--sl-muted)]">
                <span>Mode: <strong className="text-[var(--sl-accent)] uppercase">{stats.mode.replace("_", " ")}</strong></span>
                <span>•</span>
                <span>Input: <strong className="text-[var(--sl-text)]">{stats.inputLength} chars</strong></span>
                <span>•</span>
                <span>Output: <strong className="text-[var(--sl-text)]">{stats.outputLength} chars</strong></span>
                {stats.paramCount > 0 && (
                  <>
                    <span>•</span>
                    <span>Params: <strong className="text-[var(--sl-success)]">{stats.paramCount}</strong></span>
                  </>
                )}
              </div>
            )}

            {/* Output code block */}
            <pre className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs md:text-sm text-[var(--sl-text)] overflow-auto max-h-[320px] whitespace-pre-wrap break-all">
              {output}
            </pre>

            {/* Query Parameter Inspector */}
            {params && params.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[var(--sl-text)]">
                  <Link2 className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                  <span>Detected Query Parameters ({params.length})</span>
                </div>
                <div className="divide-y divide-[var(--sl-border)] border border-[var(--sl-border)] rounded-lg overflow-hidden text-xs">
                  {params.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-[var(--sl-surface)] transition-colors gap-2">
                      <div className="font-mono font-medium text-[var(--sl-accent)] truncate max-w-[35%]">
                        {p.key}
                      </div>
                      <div className="font-mono text-[var(--sl-muted)] truncate flex-1 text-right">
                        {p.value}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyParam(p.value, `${p.key}-${idx}`)}
                        className="p-1 rounded text-[var(--sl-muted)] hover:text-[var(--sl-text)] transition-colors"
                        title="Copy value"
                      >
                        {copiedKey === `${p.key}-${idx}` ? (
                          <Check className="w-3 h-3 text-[var(--sl-success)]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
