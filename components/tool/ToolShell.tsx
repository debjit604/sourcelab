"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import Link from "next/link";
import { getToolById } from "@/registry";
import { getCategoryMeta } from "@/registry/categories";
import { useRecent } from "@/hooks/useRecent";
import { useFavorites } from "@/hooks/useFavorites";
import { copyToClipboard, downloadFile } from "@/lib/files";
import { ToolCard } from "@/components/ToolCard";
import {
  ShieldCheck,
  Star,
  Copy,
  Check,
  Download,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  RotateCw,
} from "lucide-react";

export interface ToolShellProps {
  toolId: string;
  input: ReactNode;
  output?: ReactNode;
  error?: string | null;
  loading?: boolean;
  progressPercent?: number; // 0-100 or undefined for indeterminate
  downloadFilename?: string;
  downloadMimeType?: string;
  onRunShortcut?: () => void;
  children?: ReactNode;
}

export function ToolShell({
  toolId,
  input,
  output,
  error,
  loading = false,
  progressPercent,
  downloadFilename,
  downloadMimeType,
  onRunShortcut,
}: ToolShellProps) {
  const tool = getToolById(toolId);
  const { push: pushRecent } = useRecent();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const hasTrackedRecent = useRef(false);

  // StrictMode double-fire fix for useRecent
  useEffect(() => {
    if (!hasTrackedRecent.current && toolId) {
      hasTrackedRecent.current = true;
      pushRecent(toolId);
    }
  }, [toolId, pushRecent]);

  // Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (onRunShortcut && !loading) {
          e.preventDefault();
          onRunShortcut();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRunShortcut, loading]);

  if (!tool) {
    return (
      <div className="max-w-[var(--max-w-tool)] mx-auto p-8 text-center text-[var(--sl-muted)]">
        Tool nahi mila: <code className="text-[var(--sl-accent)]">{toolId}</code>
      </div>
    );
  }

  const catMeta = getCategoryMeta(tool.category);
  const favActive = isFavorite(toolId);

  // Related tools lookup
  const relatedToolsList = (tool.related || [])
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // ChainTo tools lookup
  const chainToolsList = (tool.chainTo || [])
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const handleCopy = async () => {
    if (typeof output === "string") {
      const ok = await copyToClipboard(output);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDownload = () => {
    if (typeof output === "string") {
      downloadFile(
        output,
        downloadFilename || `${tool.id}-output.txt`,
        downloadMimeType || "text/plain"
      );
    }
  };

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="w-full max-w-[var(--max-w-tool)] mx-auto px-4 py-8 space-y-8">
      {/* JSON-LD for SEO FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--sl-muted)] font-mono">
        <Link href="/" className="hover:text-[var(--sl-accent)] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/${tool.category}`}
          className="hover:text-[var(--sl-accent)] transition-colors"
        >
          {catMeta.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--sl-text)] font-semibold">{tool.name}</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--sl-border)]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--sl-text)]">
              {tool.name}
            </h1>
            {tool.privacy === "client" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[rgba(52,211,153,0.1)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.2)]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Upload • 100% Client-Side
              </span>
            )}
          </div>
          <p className="text-sm md:text-base text-[var(--sl-muted)]">
            {tool.tagline}
          </p>
        </div>

        {/* Action button: Favorite star */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(toolId)}
            aria-label={favActive ? "Remove from favorites" : "Add to favorites"}
            className={`p-2.5 rounded-xl border transition-all ${
              favActive
                ? "bg-[rgba(251,191,36,0.15)] border-[var(--sl-warning)] text-[var(--sl-warning)]"
                : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
            }`}
          >
            <Star className={`w-4 h-4 ${favActive ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Input */}
        <div className="flex flex-col space-y-4 p-5 rounded-[16px] bg-[var(--sl-surface)] border border-[var(--sl-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--sl-muted)] font-mono">
              Input
            </h2>
            <span className="text-xs text-[var(--sl-muted)] font-mono">
              Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-[var(--sl-border)] text-[var(--sl-accent)]">Ctrl + Enter</kbd>
            </span>
          </div>
          <div>{input}</div>
        </div>

        {/* Right Column: Output */}
        <div
          aria-live="polite"
          className="flex flex-col space-y-4 p-5 rounded-[16px] bg-[var(--sl-surface)] border border-[var(--sl-border)] min-h-[300px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--sl-muted)] font-mono">
              Output
            </h2>
            {output && !loading && !error && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.2)] border border-[var(--sl-border)] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[var(--sl-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.05)] text-[var(--sl-text)] hover:bg-[rgba(255,255,255,0.1)] border border-[var(--sl-border)] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {/* State Handling */}
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
                <RotateCw className="w-8 h-8 text-[var(--sl-accent)] animate-spin" />
                <p className="text-sm text-[var(--sl-text)] font-medium">Processing chal rahi hai...</p>
                {typeof progressPercent === "number" && (
                  <div className="w-full max-w-xs bg-[var(--sl-border)] rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="bg-[var(--sl-accent)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.25)] text-[var(--sl-error)] text-sm space-y-1">
                <p className="font-semibold flex items-center gap-1.5">⚠️ Error aaya:</p>
                <p>{error}</p>
              </div>
            ) : output ? (
              typeof output === "string" ? (
                <pre className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-sm text-[var(--sl-text)] overflow-auto max-h-[450px] whitespace-pre-wrap break-all">
                  {output}
                </pre>
              ) : (
                <div className="p-2">{output}</div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--sl-muted)]">
                <p className="text-sm">Input enter karo aur Run dabao.</p>
                <p className="text-xs mt-1">Result yahan dikhayi dega.</p>
              </div>
            )}
          </div>

          {/* ChainTo tools */}
          {chainToolsList.length > 0 && output && !error && !loading && (
            <div className="pt-3 border-t border-[var(--sl-border)] flex items-center gap-2 flex-wrap text-xs text-[var(--sl-muted)]">
              <span>Is output ko bhejo:</span>
              {chainToolsList.map((target) => (
                <Link
                  key={target.id}
                  href={`${target.slug}?autoInput=true`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-accent)] hover:border-[var(--sl-accent)] transition-colors"
                >
                  <span>{target.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Tools Section */}
      {relatedToolsList.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-[var(--sl-border)]">
          <h2 className="text-lg font-bold font-heading text-[var(--sl-text)] flex items-center gap-2">
            <span>Related Tools</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedToolsList.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {tool.faq.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-[var(--sl-border)]">
          <h2 className="text-lg font-bold font-heading text-[var(--sl-text)] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--sl-accent)]" />
            <span>Aksar Pooche Jane Wale Sawal (FAQ)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.faq.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-1.5"
              >
                <h3 className="text-sm font-semibold text-[var(--sl-text)]">
                  {item.q}
                </h3>
                <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
