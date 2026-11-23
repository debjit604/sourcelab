import React from "react";
import { MousePointerClick, Cpu, DownloadCloud } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Tool Select Karo",
      desc: "55+ private tools me se apna tool chuno ya Ctrl+K dabakar instant search karo. Koi login ya payment wall nahi hai.",
      icon: MousePointerClick,
    },
    {
      num: "02",
      title: "Local Processing",
      desc: "Files aur code Web Workers, HTML5 Canvas, aur WASM ke through direct tumhare computer/phone me process hote hain.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Zero-Upload Export",
      desc: "Hasil hua output turant copy ya download karo. Tumhara data kisi server par store nahi hota — 100% private.",
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="space-y-6 pt-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--sl-text)]">
          Kaise Kaam Karta Hai?
        </h2>
        <p className="text-xs md:text-sm text-[var(--sl-muted)]">
          Cloud upload ke bina browser me full compute power
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-6 rounded-[14px] bg-[var(--sl-surface)] border border-[var(--sl-border)] relative overflow-hidden"
            >
              <div className="text-3xl font-black font-mono text-[var(--sl-border)]/60 absolute top-4 right-5">
                {step.num}
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-950/30 text-[var(--sl-accent)] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
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
    </section>
  );
}
