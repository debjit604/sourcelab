"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processJwt, JwtProcessOutput } from "./process";
import { readFileAsText } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, ShieldAlert, ShieldCheck, Clock, KeyRound } from "lucide-react";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJhaHVsIFNoYXJtYSIsImFkbWluIjp0cnVlLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTgwMDAwMDAwMH0.s8hU-2Z_l1qjT1m9k5E_kL0vX8z5aB2c7d9eF1gH3jK";

export default function JwtDecoderToolComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<JwtProcessOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = () => {
    try {
      setLoading(true);
      setError(null);
      const res = processJwt({ token: input });
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      setOutput(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const text = await readFileAsText(files[0]);
      setInput(text);
      const res = processJwt({ token: text });
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_JWT);
    try {
      const res = processJwt({ token: SAMPLE_JWT });
      setOutput(res);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput(null);
    setError(null);
  };

  return (
    <ToolShell
      toolId="jwt-decoder"
      downloadFilename="decoded-jwt.json"
      downloadMimeType="application/json"
      onRunShortcut={handleRun}
      input={
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="text-xs font-mono text-[var(--sl-muted)] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
              <span>JSON Web Token Inspector</span>
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

          {/* Text input */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Yahan JWT token paste karo (e.g. eyJhbGci...)"
            rows={8}
            className="font-mono text-xs md:text-sm resize-y break-all bg-[var(--sl-bg)]"
          />

          {/* Dropzone */}
          <Dropzone
            accept=".txt,.jwt"
            multiple={false}
            maxSizeMB={2}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="JWT token file yahan drop karo (Max 2MB)"
          />

          {/* Run button */}
          <Button
            type="button"
            onClick={handleRun}
            disabled={loading || !input.trim()}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Decode ho raha hai..." : "Decode Token (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-4">
            {/* Status overview badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--sl-muted)]">Algorithm:</span>
                <span className="font-semibold text-[var(--sl-accent)]">
                  {output.algorithm || "None"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--sl-muted)]">Type:</span>
                <span className="font-semibold text-[var(--sl-text)]">
                  {output.tokenType || "JWT"}
                </span>
              </div>
            </div>

            {/* Expiry claim status */}
            {output.expiresAt && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono ${
                  output.isExpired
                    ? "bg-[rgba(248,113,113,0.1)] border-[rgba(248,113,113,0.3)] text-[var(--sl-error)]"
                    : "bg-[rgba(52,211,153,0.1)] border-[rgba(52,211,153,0.3)] text-[var(--sl-success)]"
                }`}
              >
                {output.isExpired ? (
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                )}
                <div className="flex-1 truncate">
                  <span className="font-semibold">{output.expiresAt.statusText}</span>
                  <span className="block text-[11px] opacity-80">{output.expiresAt.dateStr}</span>
                </div>
              </div>
            )}

            {/* Issued at claim */}
            {output.issuedAt && (
              <div className="p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex items-center gap-2 text-xs font-mono text-[var(--sl-muted)]">
                <Clock className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                <span>Issued At (iat):</span>
                <span className="text-[var(--sl-text)]">{output.issuedAt.dateStr}</span>
              </div>
            )}

            {/* Header section */}
            <div className="space-y-1.5">
              <div className="text-xs font-heading font-medium text-[var(--sl-accent)] flex items-center justify-between">
                <span>HEADER: Algorithm & Token Type</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs text-[var(--sl-text)] overflow-auto max-h-[160px] whitespace-pre-wrap break-all">
                {JSON.stringify(output.header, null, 2)}
              </pre>
            </div>

            {/* Payload section */}
            <div className="space-y-1.5">
              <div className="text-xs font-heading font-medium text-[#c084fc] flex items-center justify-between">
                <span>PAYLOAD: Data Claims</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs text-[var(--sl-text)] overflow-auto max-h-[260px] whitespace-pre-wrap break-all">
                {JSON.stringify(output.payload, null, 2)}
              </pre>
            </div>

            {/* Signature section */}
            <div className="space-y-1.5">
              <div className="text-xs font-heading font-medium text-[var(--sl-muted)]">
                <span>SIGNATURE: Verification Hash</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs text-[var(--sl-muted)] break-all select-all">
                {output.signature || "(No signature)"}
              </div>
            </div>
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
