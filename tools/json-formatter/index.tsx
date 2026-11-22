"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processJson, FormatMode, JsonProcessOutput } from "./process";
import { readFileAsText, formatBytes } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, ArrowUpDown } from "lucide-react";

const SAMPLE_JSON = `{
  "app": "SourceLab",
  "privacy": "100% Client-Side",
  "features": ["zero-upload", "offline-ready", "free"],
  "stats": {
    "totalTools": 200,
    "speedMs": 0
  }
}`;

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FormatMode>("beautify_2");
  const [sortKeys, setSortKeys] = useState(false);
  const [stats, setStats] = useState<JsonProcessOutput["stats"] | null>(null);

  const handleRun = () => {
    try {
      setLoading(true);
      setError(null);
      const res = processJson({
        text: input,
        mode,
        sortKeys,
      });
      setOutput(res.result);
      setStats(res.stats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      setOutput("");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const content = await readFileAsText(files[0]);
      setInput(content);
      // Auto-run on file upload
      const res = processJson({
        text: content,
        mode,
        sortKeys,
      });
      setOutput(res.result);
      setStats(res.stats);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me dikkat aayi.");
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_JSON);
    try {
      const res = processJson({ text: SAMPLE_JSON, mode, sortKeys });
      setOutput(res.result);
      setStats(res.stats);
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
  };

  return (
    <ToolShell
      toolId="json-formatter"
      downloadFilename={mode === "minify" ? "minified.json" : "formatted.json"}
      downloadMimeType="application/json"
      onRunShortcut={handleRun}
      input={
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setMode("beautify_2")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                  mode === "beautify_2"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => setMode("beautify_4")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                  mode === "beautify_4"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                4 Spaces
              </button>
              <button
                type="button"
                onClick={() => setMode("minify")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                  mode === "minify"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                Minify
              </button>

              <button
                type="button"
                onClick={() => setSortKeys(!sortKeys)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                  sortKeys
                    ? "bg-[rgba(52,211,153,0.15)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort Keys</span>
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

          {/* Textarea Input */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Yahan raw JSON paste karo ya file drop karo..."
            rows={12}
            className="font-mono text-xs md:text-sm resize-y bg-[var(--sl-bg)]"
          />

          {/* File Dropzone */}
          <Dropzone
            accept=".json,application/json,text/plain"
            multiple={false}
            maxSizeMB={15}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="JSON file upload karo (Max 15MB)"
          />

          {/* Run Button */}
          <Button
            type="button"
            onClick={handleRun}
            disabled={loading || !input.trim()}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Formatting chal rahi hai..." : "Format / Validate (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-3">
            {stats && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[11px] font-mono text-[var(--sl-muted)]">
                <span>Type: <strong className="text-[var(--sl-accent)]">{stats.type}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-[var(--sl-text)]">{formatBytes(stats.resultSize)}</strong></span>
                <span>•</span>
                <span>Lines: <strong className="text-[var(--sl-text)]">{stats.lineCount}</strong></span>
                {stats.savedBytes > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-[var(--sl-success)]">
                      Saved {formatBytes(stats.savedBytes)} (
                      {Math.round((stats.savedBytes / stats.originalSize) * 100)}%)
                    </span>
                  </>
                )}
              </div>
            )}
            <pre className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs md:text-sm text-[var(--sl-text)] overflow-auto max-h-[460px] whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
