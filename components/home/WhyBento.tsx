"use client";

import React from "react";
import { Shield, Zap, ShieldAlert, Check } from "lucide-react";

export function WhyBento() {
  return (
    <section className="space-y-8 pt-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--sl-accent)]">
          Why SourceLab
        </span>
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--sl-text)]">
          Built different, on purpose
        </h2>
        <p className="text-xs md:text-sm text-[var(--sl-muted)]">
          Zero data harvesting. Engineered for speed, privacy, aur security researchers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        {/* Bento 1: Privacy First with Radar Waves (Span 4) */}
        <div className="md:col-span-4 p-6 sm:p-8 rounded-3xl glass-surface border border-[var(--sl-border)] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Concentric Radar Rings */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none hidden sm:flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-radar" style={{ animationDelay: "0s" }} />
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-radar" style={{ animationDelay: "1s" }} />
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-radar" style={{ animationDelay: "2s" }} />
            <div className="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-2xl shadow-xl shadow-cyan-500/20">
              🛡️
            </div>
          </div>

          <div className="space-y-2 max-w-md z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/30 text-[var(--sl-accent)] border border-cyan-800/40 mb-2">
              <Shield className="w-3.5 h-3.5" /> Privacy-First Architecture
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-[var(--sl-text)]">
              Client-Side Processing Sandbox
            </h3>
            <p className="text-xs sm:text-sm text-[var(--sl-muted)] leading-relaxed">
              Files are processed in your browser memory. We can&apos;t see them because they never touch our servers. Server-assisted tools are explicitly labelled and ephemeral.
            </p>
          </div>
        </div>

        {/* Bento 2: Fast by Design (Span 2) */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl glass-surface border border-[var(--sl-border)] flex flex-col justify-between space-y-4 min-h-[220px]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-950/30 text-[var(--sl-warning)] border border-amber-800/40 mb-2">
              <Zap className="w-3.5 h-3.5" /> Instant Compute
            </div>
            <h3 className="text-lg font-bold font-heading text-[var(--sl-text)]">
              Fast by Design
            </h3>
            <p className="text-xs text-[var(--sl-muted)]">
              No upload queues, no server lag.
            </p>
          </div>

          {/* Speed Bars */}
          <div className="space-y-2 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-[var(--sl-muted)] mb-1">
                <span>Typical cloud tool</span>
                <span>~8.0s</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-400/60 rounded-full w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[var(--sl-accent)] font-semibold mb-1">
                <span>SourceLab local</span>
                <span>~0.2s</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--sl-accent)] rounded-full w-[12%] shadow-[0_0_8px_var(--sl-accent)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bento 3: Red Team Built (Span 6) */}
        <div className="md:col-span-6 p-6 sm:p-8 rounded-3xl glass-surface border border-[var(--sl-border)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/30 text-[var(--sl-success)] border border-emerald-800/40 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Defensive Engineering
              </div>
              <h3 className="text-xl font-bold font-heading text-[var(--sl-text)]">
                Security-Minded Engineering
              </h3>
              <p className="text-xs sm:text-sm text-[var(--sl-muted)]">
                Built by a Red Team Operator, with defensive safety as a primary feature.
              </p>
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {[
              "Strict CSP Enforced",
              "Zero Telemetry Trackers",
              "Automated Bot Verification",
              "Clearly Labelled Server Tools",
              "Multi-Layer SSRF & DNS Pinning",
              "Ephemeral 10m TTL Deletion",
            ].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-emerald-500/30 text-[var(--sl-success)]"
              >
                <Check className="w-3.5 h-3.5" /> {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
