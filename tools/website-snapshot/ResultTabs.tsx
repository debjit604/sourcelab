"use client";

import React, { useState } from "react";
import {
  SnapshotManifest,
  getScreenshotApiUrl,
  getFileApiUrl,
  getZipApiUrl,
  generateMarkdownReport,
} from "./process";
import {
  Camera,
  Download,
  FileCode,
  ShieldAlert,
  Search,
  Globe,
  FileText,
  Copy,
} from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/files";

export interface ResultTabsProps {
  manifest: SnapshotManifest;
}

export function ResultTabs({ manifest }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<"screens" | "files" | "js" | "paths" | "passive" | "export">("screens");
  const [screenshotView, setScreenshotView] = useState<"desktop" | "mobile">("desktop");
  const [revealedSnippets, setRevealedSnippets] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab("screens")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "screens"
              ? "bg-[var(--sl-surface)] text-[var(--sl-accent)] font-semibold shadow-sm"
              : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> Screens
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("files")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "files"
              ? "bg-[var(--sl-surface)] text-[var(--sl-accent)] font-semibold shadow-sm"
              : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" /> Assets ({manifest.filesCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("js")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "js"
              ? "bg-[var(--sl-surface)] text-[var(--sl-accent)] font-semibold shadow-sm"
              : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Secrets ({manifest.jsAnalysis?.findings.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("paths")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "paths"
              ? "bg-[var(--sl-surface)] text-[var(--sl-accent)] font-semibold shadow-sm"
              : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Paths ({manifest.hiddenPaths?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("passive")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "passive"
              ? "bg-[var(--sl-surface)] text-[var(--sl-accent)] font-semibold shadow-sm"
              : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> DNS & SSL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("export")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "export"
              ? "bg-[var(--sl-surface)] text-[var(--sl-accent)] font-semibold shadow-sm"
              : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
          }`}
        >
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Tab 1: Screens */}
      {activeTab === "screens" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--sl-muted)]">Rendered Preview</span>
            <div className="flex gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setScreenshotView("desktop")}
                className={`px-2.5 py-1 rounded ${
                  screenshotView === "desktop"
                    ? "bg-[var(--sl-accent)] text-[#0B0F1A] font-semibold"
                    : "bg-[var(--sl-bg)] text-[var(--sl-muted)]"
                }`}
              >
                Desktop (1366px)
              </button>
              <button
                type="button"
                onClick={() => setScreenshotView("mobile")}
                className={`px-2.5 py-1 rounded ${
                  screenshotView === "mobile"
                    ? "bg-[var(--sl-accent)] text-[#0B0F1A] font-semibold"
                    : "bg-[var(--sl-bg)] text-[var(--sl-muted)]"
                }`}
              >
                Mobile (390px)
              </button>
            </div>
          </div>
          <div className="border border-[var(--sl-border)] rounded-xl overflow-hidden bg-[var(--sl-bg)] flex justify-center p-2">
            <img
              src={getScreenshotApiUrl(manifest.jobId, screenshotView)}
              alt={`Snapshot (${screenshotView})`}
              className="max-h-[500px] object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Assets */}
      {activeTab === "files" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--sl-muted)]">
              {manifest.filesCount} Mirrored Subresources
            </span>
            <a
              href={getZipApiUrl(manifest.jobId)}
              download={`sourcelab-snapshot-${manifest.jobId}.zip`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--sl-accent)] text-[#0B0F1A] font-semibold text-xs hover:brightness-110"
            >
              <Download className="w-3.5 h-3.5" /> Download All (.zip)
            </a>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
            {manifest.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
                    {file.folder}
                  </span>
                  <span className="truncate text-[var(--sl-text)]" title={file.filename}>
                    {file.filename}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[var(--sl-muted)]">{(file.size / 1024).toFixed(1)} KB</span>
                  <a
                    href={getFileApiUrl(manifest.jobId, file.id)}
                    download={file.filename}
                    className="p-1 rounded text-[var(--sl-muted)] hover:text-[var(--sl-accent)]"
                    title="Download asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Secrets */}
      {activeTab === "js" && (
        <div className="space-y-3 font-mono text-xs">
          <span className="text-xs text-[var(--sl-muted)]">
            Discovered Secrets: {manifest.jsAnalysis?.findings.length || 0}
          </span>
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
            {manifest.jsAnalysis?.findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[var(--sl-bg)] border border-[rgba(248,113,113,0.3)] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--sl-error)]">{finding.ruleName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[rgba(248,113,113,0.15)] text-[var(--sl-error)]">
                    {finding.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--sl-muted)]">
                  <span>Line: {finding.line}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRevealedSnippets((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="text-[var(--sl-accent)] underline text-[10px]"
                  >
                    {revealedSnippets[idx] ? "Mask" : "Reveal"}
                  </button>
                </div>
                <code className="block p-1.5 rounded bg-[var(--sl-surface)] text-[var(--sl-text)] overflow-x-auto text-[11px]">
                  {revealedSnippets[idx] ? finding.maskedSnippet : "••••••••••••••••••••"}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Paths */}
      {activeTab === "paths" && (
        <div className="space-y-2 font-mono text-xs max-h-[400px] overflow-y-auto pr-1">
          {manifest.hiddenPaths?.map((hp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]"
            >
              <span className="text-[var(--sl-text)]">{hp.path}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--sl-muted)]">{hp.category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    hp.status === 200
                      ? "bg-[rgba(52,211,153,0.15)] text-[var(--sl-success)]"
                      : "bg-[rgba(251,191,36,0.15)] text-[var(--sl-warning)]"
                  }`}
                >
                  HTTP {hp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Passive Recon */}
      {activeTab === "passive" && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-1">
            <span className="font-semibold text-[var(--sl-accent)]">SSL/TLS Certificate</span>
            <p className="text-[var(--sl-muted)]">
              Subject: {manifest.ssl?.subject || "N/A"} | Issuer: {manifest.ssl?.issuer || "N/A"}
            </p>
            <p className="text-[var(--sl-muted)]">
              Expires: {manifest.ssl?.validTo || "N/A"} ({manifest.ssl?.daysRemaining ?? 0} days left)
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-1">
            <span className="font-semibold text-[var(--sl-accent)]">Email Security</span>
            <p className="text-[var(--sl-muted)]">
              SPF: <span className="text-[var(--sl-text)]">{manifest.emailSecurity?.spf.status}</span>
            </p>
            <p className="text-[var(--sl-muted)]">
              DMARC: <span className="text-[var(--sl-text)]">{manifest.emailSecurity?.dmarc.status}</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-1">
            <span className="font-semibold text-[var(--sl-accent)]">
              SEO Audit (Score: {manifest.seo?.score ?? 0}/100)
            </span>
            <p className="text-[var(--sl-muted)]">Title: {manifest.seo?.title || "None"}</p>
            <p className="text-[var(--sl-muted)]">Description: {manifest.seo?.description || "None"}</p>
          </div>
        </div>
      )}

      {/* Tab 6: Export */}
      {activeTab === "export" && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--sl-muted)]">
            Scan results ko JSON format ya Markdown audit report ke roop mein save karein.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                downloadFile(
                  JSON.stringify(manifest, null, 2),
                  `sourcelab-recon-${manifest.jobId}.json`,
                  "application/json"
                )
              }
              className="px-3 py-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs text-[var(--sl-text)] hover:border-[var(--sl-accent)] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download JSON
            </button>
            <button
              type="button"
              onClick={() =>
                downloadFile(
                  generateMarkdownReport(manifest),
                  `sourcelab-recon-${manifest.jobId}.md`,
                  "text/markdown"
                )
              }
              className="px-3 py-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs text-[var(--sl-text)] hover:border-[var(--sl-accent)] flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Download Markdown
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(generateMarkdownReport(manifest))}
              className="px-3 py-2 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs text-[var(--sl-text)] hover:border-[var(--sl-accent)] flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
