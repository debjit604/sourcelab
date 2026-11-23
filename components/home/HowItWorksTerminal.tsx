"use client";

import React, { useState, useEffect } from "react";
import { MousePointerClick, Cpu, DownloadCloud, Terminal } from "lucide-react";

const TERMINAL_LOGS = [
  { text: "$ resolving target…", isOk: false },
  { text: "→ checking SSRF guard, DNS, headers…", isOk: false },
  { text: "✓ client-side tools: 0 bytes uploaded to any server", isOk: true },
  { text: "→ website-snapshot: server-assisted, auto-deletes in 10m", isOk: false },
];

export function HowItWorksTerminal() {
  const [displayedLogs, setDisplayedLogs] = useState<Array<{ text: string; isOk: boolean }>>([]);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < TERMINAL_LOGS.length) {
        const nextLog = TERMINAL_LOGS[currentIdx];
        setDisplayedLogs((prev) => [...prev, nextLog]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      num: "01",
      title: "Drop Your File or Input",
      desc: "Drag, paste ya device se file pick karo. Koi signup ya login zaroori nahi hai.",
      icon: MousePointerClick,
    },
    {
      num: "02",
      title: "Your Browser Computes",
      desc: "Web Workers, HTML5 Canvas, aur WASM ke through direct tumhare device RAM me calculation hoti hai.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Instant Private Output",
      desc: "Result copy ya download karo bina queue ya cloud upload latency ke.",
      icon: DownloadCloud,
    },
  ];

  return (
    <section id="how-it-works" className="space-y-8 pt-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--sl-accent)]">
          How It Works
        </span>
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--sl-text)]">
          Three steps. Zero uploads by default.
        </h2>
        <p className="text-xs md:text-sm text-[var(--sl-muted)]">
          Har file browser ke sandbox me compute hoti hai — server par kabhi nahi jaati.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-6 rounded-2xl glass-surface border border-[var(--sl-border)] relative overflow-hidden group hover:border-[var(--sl-accent)] transition-all"
            >
              <div className="text-4xl font-black font-mono text-[var(--sl-border)]/40 absolute top-4 right-5 group-hover:text-[var(--sl-accent)]/20 transition-colors">
                {step.num}
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[var(--sl-accent)] flex items-center justify-center mb-4 shadow-inner">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[var(--sl-text)] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Terminal Window */}
      <div className="max-w-2xl mx-auto rounded-2xl glass-surface border border-[var(--sl-border)] overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--sl-border)] bg-black/40">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="font-mono text-xs text-[var(--sl-muted)] mx-auto flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[var(--sl-accent)]" /> sourcelab-runtime-verifier
          </span>
        </div>

        <div className="p-4 sm:p-5 font-mono text-xs space-y-2 min-h-[140px] bg-[#070A12]/80">
          {displayedLogs.map((log, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${
                log.isOk ? "text-[var(--sl-success)] font-semibold" : "text-[#B6C2DA]"
              }`}
            >
              <span>{log.text}</span>
            </div>
          ))}
          <div className="inline-block w-2 h-4 bg-[var(--sl-accent)] animate-pulse align-middle" />
        </div>
      </div>

      {/* Glowing Zero Bytes Stat Banner */}
      <div className="text-center pt-2">
        <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[var(--sl-success)] drop-shadow-[0_0_24px_rgba(52,211,153,0.5)]">
          0 bytes uploaded for client-side tools
        </p>
      </div>
    </section>
  );
}
