import React from "react";
import type { Metadata } from "next";
import { GitCommit, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog | SourceLab",
  description: "Track all recent updates, releases, and new tool additions in SourceLab.",
};

const RELEASES = [
  {
    version: "v0.2.0",
    date: "2026-11-22",
    title: "Phase 2: Discovery, Routing & Static SEO",
    changes: [
      "Home page server component with category grids, popular tools, and new tools",
      "Dynamic [category] and [tool] page routing with static export support",
      "Fuzzy search with Fuse.js and Ctrl+K Command Palette",
      "Sitemap.xml, robots.txt, and PWA Web Manifest integration",
      "Zero-upload privacy policy, about, and changelog pages",
    ],
  },
  {
    version: "v0.1.0",
    date: "2026-11-22",
    title: "Phase 0 & 1: Scaffold, Registry & ToolShell",
    changes: [
      "Next.js 15 App Router static export architecture initialized",
      "SourceLab dark design system (#0B0F1A, #121828, #22D3EE)",
      "Strict registry validator and auto-generation script",
      "ToolShell 2-column layout with Dropzone, copy/download, and FAQ schema",
      "Seed metadata added for JSON Formatter and Base64",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Release Updates</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Changelog & Updates
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          SourceLab me naye tools aur features ki tarakki yahan track hoti hai.
        </p>
      </div>

      <div className="space-y-8 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--sl-border)] pl-8">
        {RELEASES.map((rel) => (
          <div key={rel.version} className="relative space-y-3">
            <div className="absolute -left-[38px] top-1 w-5 h-5 rounded-full bg-[var(--sl-surface)] border-2 border-[var(--sl-accent)] flex items-center justify-center">
              <GitCommit className="w-2.5 h-2.5 text-[var(--sl-accent)]" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-mono text-xs font-bold text-[var(--sl-accent)] px-2 py-0.5 rounded bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.2)] w-fit">
                {rel.version}
              </span>
              <span className="text-xs font-mono text-[var(--sl-muted)]">{rel.date}</span>
            </div>

            <h2 className="text-base font-semibold text-[var(--sl-text)]">
              {rel.title}
            </h2>

            <ul className="space-y-1.5 list-disc list-inside text-xs md:text-sm text-[var(--sl-muted)]">
              {rel.changes.map((change, idx) => (
                <li key={idx} className="leading-relaxed">
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
