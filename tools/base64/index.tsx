"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processBase64, Base64Mode, Base64ProcessOutput } from "./process";
import { readFileAsDataURL, readFileAsText, formatBytes } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, ArrowRightLeft, Shield } from "lucide-react";

const SAMPLE_TEXT = "Tumhari file tumhare browser me hi process hoti hai — SourceLab";

export default function Base64ToolComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Base64Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [stats, setStats] = useState<Base64ProcessOutput["stats"] | null>(null);

  const handleRun = () => {
    try {
      setLoading(true);
      setError(null);
      const res = processBase64({
        text: input,
        mode,
        urlSafe,
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

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput("");
      setMode(mode === "encode" ? "decode" : "encode");
      setStats(null);
      setError(null);
    } else {
      setMode(mode === "encode" ? "decode" : "encode");
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const file = files[0];

      if (mode === "encode") {
        // Read file as Data URL
        const dataUrl = await readFileAsDataURL(file);
        // Extract raw base64 or keep dataUrl
        const base64Only = dataUrl.replace(/^data:[^;]+;base64,/, "");
        setInput(file.name + " (" + formatBytes(file.size) + ")");
        setOutput(base64Only);
        setStats({
          inputBytes: file.size,
          outputBytes: base64Only.length,
          mode: "encode",
          ratio: (base64Only.length / Math.max(1, file.size)).toFixed(2) + "x",
        });
      } else {
        // Decode file content (assuming text file containing base64)
        const text = await readFileAsText(file);
        setInput(text);
        const res = processBase64({ text, mode: "decode", urlSafe });
        setOutput(res.result);
        setStats(res.stats);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_TEXT);
    try {
      const res = processBase64({ text: SAMPLE_TEXT, mode: "encode", urlSafe });
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
      toolId="base64"
      downloadFilename={mode === "encode" ? "encoded-base64.txt" : "decoded.txt"}
      downloadMimeType="text/plain"
      onRunShortcut={handleRun}
      input={
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode("encode")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mode === "encode"
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                Encode
              </button>
              <button
                type="button"
                onClick={() => setMode("decode")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
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
                className="p-1 rounded-lg text-[var(--sl-muted)] hover:text-[var(--sl-accent)] hover:bg-[var(--sl-surface)] transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {mode === "encode" && (
                <button
                  type="button"
                  onClick={() => setUrlSafe(!urlSafe)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                    urlSafe
                      ? "bg-[rgba(52,211,153,0.15)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.3)]"
                      : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>URL-Safe</span>
                </button>
              )}
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

          {/* Text input area */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Yahan text paste karo ya file upload karo..."
                : "Yahan Base64 string paste karo..."
            }
            rows={10}
            className="font-mono text-xs md:text-sm resize-y bg-[var(--sl-bg)]"
          />

          {/* Dropzone */}
          <Dropzone
            accept="*"
            multiple={false}
            maxSizeMB={20}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="File yahan drop karke Base64 me badlo (Max 20MB)"
          />

          {/* Run button */}
          <Button
            type="button"
            onClick={handleRun}
            disabled={loading || !input.trim()}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Processing chal rahi hai..." : `${mode === "encode" ? "Encode Karo" : "Decode Karo"} (Ctrl + Enter)`}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-3">
            {stats && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[11px] font-mono text-[var(--sl-muted)]">
                <span>Mode: <strong className="text-[var(--sl-accent)] uppercase">{stats.mode}</strong></span>
                <span>•</span>
                <span>Input: <strong className="text-[var(--sl-text)]">{formatBytes(stats.inputBytes)}</strong></span>
                <span>•</span>
                <span>Output: <strong className="text-[var(--sl-text)]">{formatBytes(stats.outputBytes)}</strong></span>
                <span>•</span>
                <span>Ratio: <strong className="text-[var(--sl-warning)]">{stats.ratio}</strong></span>
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
