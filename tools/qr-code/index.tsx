"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processQrCode, QrProcessOutput, QrErrorCorrection } from "./process";
import { readFileAsText, downloadFile } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Download, Copy, Check, QrCode as QrIcon } from "lucide-react";

const SAMPLE_LINK = "https://sourcelab.app?ref=qr-generator";

export default function QrCodeToolComponent() {
  const [input, setInput] = useState("");
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrection>("M");
  const [size, setSize] = useState(320);
  const [colorTheme, setColorTheme] = useState<"standard" | "cyan">("standard");

  const [output, setOutput] = useState<QrProcessOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getColors = (theme: "standard" | "cyan") =>
    theme === "cyan"
      ? { darkColor: "#22D3EE", lightColor: "#0B0F1A" }
      : { darkColor: "#000000", lightColor: "#FFFFFF" };

  const handleGenerate = async (
    textVal = input,
    ec = errorCorrection,
    sz = size,
    theme = colorTheme
  ) => {
    try {
      setLoading(true);
      setError(null);
      const colors = getColors(theme);
      const res = await processQrCode({
        text: textVal,
        options: {
          errorCorrectionLevel: ec,
          width: sz,
          darkColor: colors.darkColor,
          lightColor: colors.lightColor,
        },
      });
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
      handleGenerate(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me dikkat aayi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPng = () => {
    if (!output) return;
    const a = document.createElement("a");
    a.href = output.dataUrl;
    a.download = "sourcelab-qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const presets = [
    { label: "Website URL", val: "https://sourcelab.app" },
    { label: "UPI Pay", val: "upi://pay?pa=demo@upi&pn=SourceLab&am=100" },
    { label: "WiFi", val: "WIFI:S:MyHomeWiFi;T:WPA;P:SecretKey123;;" },
  ];

  return (
    <ToolShell
      toolId="qr-code"
      downloadFilename="qrcode.svg"
      downloadMimeType="image/svg+xml"
      onRunShortcut={() => handleGenerate()}
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--sl-muted)]">
              <QrIcon className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
              <span>QR Code Studio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => { setInput(SAMPLE_LINK); handleGenerate(SAMPLE_LINK); }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.1)] transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Sample</span>
              </button>
              {input && (
                <button
                  type="button"
                  onClick={() => { setInput(""); setOutput(null); setError(null); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-muted)] hover:text-[var(--sl-error)] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[var(--sl-muted)] text-[11px] mr-1">Presets:</span>
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setInput(p.val); handleGenerate(p.val); }}
                className="px-2 py-0.5 rounded bg-[var(--sl-surface)] hover:text-[var(--sl-accent)] border border-[var(--sl-border)] text-[11px] text-[var(--sl-muted)] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Yahan link, UPI ID, WiFi credentials ya koi bhi text paste karo..."
            rows={4}
            className="font-mono text-xs md:text-sm resize-y bg-[var(--sl-bg)]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs font-mono">
            <div>
              <span className="text-[var(--sl-muted)] block text-[10px] mb-1">Error Correction</span>
              <select
                value={errorCorrection}
                onChange={(e) => {
                  const val = e.target.value as QrErrorCorrection;
                  setErrorCorrection(val);
                  if (input) handleGenerate(input, val, size, colorTheme);
                }}
                className="w-full p-1.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)]"
              >
                <option value="L">L - Low (7%)</option>
                <option value="M">M - Medium (15%)</option>
                <option value="Q">Q - High (25%)</option>
                <option value="H">H - Maximum (30%)</option>
              </select>
            </div>
            <div>
              <span className="text-[var(--sl-muted)] block text-[10px] mb-1">Resolution</span>
              <select
                value={size}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSize(val);
                  if (input) handleGenerate(input, errorCorrection, val, colorTheme);
                }}
                className="w-full p-1.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)]"
              >
                <option value={256}>256 x 256 px</option>
                <option value={320}>320 x 320 px</option>
                <option value={512}>512 x 512 px</option>
              </select>
            </div>
            <div>
              <span className="text-[var(--sl-muted)] block text-[10px] mb-1">Color Palette</span>
              <select
                value={colorTheme}
                onChange={(e) => {
                  const val = e.target.value as "standard" | "cyan";
                  setColorTheme(val);
                  if (input) handleGenerate(input, errorCorrection, size, val);
                }}
                className="w-full p-1.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)]"
              >
                <option value="standard">Classic (B & W)</option>
                <option value="cyan">Neon Cyan Dark</option>
              </select>
            </div>
          </div>

          <Dropzone
            accept=".txt,.url"
            multiple={false}
            maxSizeMB={2}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="Text file drop karke direct QR banao (Max 2MB)"
          />

          <Button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading || !input.trim()}
            className="w-full font-heading font-semibold"
          >
            {loading ? "QR code ban raha hai..." : "Generate QR Code (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex flex-col items-center justify-center space-y-4">
              <div
                className="p-4 rounded-xl shadow-lg inline-block transition-transform hover:scale-105 duration-200"
                style={{ backgroundColor: colorTheme === "cyan" ? "#0B0F1A" : "#FFFFFF" }}
                dangerouslySetInnerHTML={{ __html: output.svg }}
              />
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[var(--sl-muted)]">
                <span>Correction: <strong className="text-[var(--sl-accent)]">{output.stats.errorCorrection}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-[var(--sl-text)]">{output.stats.width}px</strong></span>
                <span>•</span>
                <span>Length: <strong className="text-[var(--sl-text)]">{output.stats.textLength} chars</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--sl-accent)] text-[#0B0F1A] font-heading font-bold text-xs hover:opacity-90 transition-opacity"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={() => downloadFile(output.svg, "sourcelab-qrcode.svg", "image/svg+xml")}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)] font-heading font-semibold text-xs hover:border-[var(--sl-accent)] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </button>
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(output.svg); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)] font-heading font-medium text-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--sl-success)]" />
                    <span className="text-[var(--sl-success)]">SVG Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SVG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
