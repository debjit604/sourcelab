"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processHash, HashProcessOutput } from "./process";
import { readFileAsArrayBuffer, formatBytes } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Copy, Check, FileCheck, Hash } from "lucide-react";

const SAMPLE_TEXT = "Tumhari file tumhare browser me hi process hoti hai — SourceLab";

export default function HashGeneratorToolComponent() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [output, setOutput] = useState<HashProcessOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRun = async (isUpper = uppercase) => {
    try {
      setLoading(true);
      setError(null);

      let res: HashProcessOutput;
      if (fileBuffer) {
        res = await processHash({ buffer: fileBuffer, uppercase: isUpper });
      } else {
        res = await processHash({ text: input, uppercase: isUpper });
      }

      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      setOutput(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCase = () => {
    const nextCase = !uppercase;
    setUppercase(nextCase);
    if (output) {
      handleRun(nextCase);
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const file = files[0];
      const buffer = await readFileAsArrayBuffer(file);
      setFileName(`${file.name} (${formatBytes(file.size)})`);
      setFileBuffer(buffer);
      setInput("");

      const res = await processHash({ buffer, uppercase });
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleSample = async () => {
    setFileName(null);
    setFileBuffer(null);
    setInput(SAMPLE_TEXT);
    try {
      setLoading(true);
      setError(null);
      const res = await processHash({ text: SAMPLE_TEXT, uppercase });
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setFileName(null);
    setFileBuffer(null);
    setOutput(null);
    setError(null);
  };

  const handleCopySingle = (hashText: string, id: string) => {
    navigator.clipboard.writeText(hashText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <ToolShell
      toolId="hash-generator"
      downloadFilename="checksums.txt"
      downloadMimeType="text/plain"
      onRunShortcut={() => handleRun()}
      input={
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleCase}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  uppercase
                    ? "bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                    : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                }`}
              >
                {uppercase ? "UPPERCASE (A-F)" : "lowercase (a-f)"}
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
              {(input || fileName) && (
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

          {/* Active file indicator if file is loaded */}
          {fileName ? (
            <div className="p-3 rounded-xl bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.25)] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 truncate text-[var(--sl-accent)]">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-[var(--sl-muted)] hover:text-[var(--sl-error)] text-xs ml-2 shrink-0"
              >
                Hatao
              </button>
            </div>
          ) : (
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Yahan text type karo jiska hash calculate karna hai..."
              rows={7}
              className="font-mono text-xs md:text-sm resize-y bg-[var(--sl-bg)]"
            />
          )}

          {/* Dropzone */}
          <Dropzone
            accept="*"
            multiple={false}
            maxSizeMB={50}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="File yahan drop karke checksum verify karo (Max 50MB)"
          />

          {/* Run button */}
          <Button
            type="button"
            onClick={() => handleRun()}
            disabled={loading || (!input.trim() && !fileBuffer)}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Hash calculate ho raha hai..." : "Calculate Hashes (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-3">
            {/* Input stats badge */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs font-mono text-[var(--sl-muted)]">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                <span>Computed {output.list.length} Hashes</span>
              </div>
              <span className="text-[var(--sl-text)] font-semibold">
                Input: {formatBytes(output.inputBytes)}
              </span>
            </div>

            {/* List of hashes */}
            <div className="space-y-2.5">
              {output.list.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-1.5 transition-all hover:border-[rgba(34,211,238,0.4)]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-heading font-semibold text-[var(--sl-text)]">
                      <span>{item.name}</span>
                      <span className="text-[10px] font-mono text-[var(--sl-muted)] px-1.5 py-0.5 rounded bg-[var(--sl-surface)]">
                        {item.bits}-bit
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(item.hash, item.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.1)] transition-colors"
                      title={`Copy ${item.name}`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--sl-success)]" />
                          <span className="text-[var(--sl-success)]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[var(--sl-muted)] break-all select-all leading-relaxed">
                    {item.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
