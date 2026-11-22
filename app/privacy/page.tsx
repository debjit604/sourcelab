import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, CheckCircle2, Lock, Terminal, Database } from "lucide-react";
import { PrivacyInspector } from "@/components/PrivacyInspector";

export const metadata: Metadata = {
  title: "Privacy Policy | SourceLab",
  description:
    "SourceLab is 100% client-side. Tumhari file tumhare browser me hi process hoti hai — server pe kabhi nahi jaati. Zero tracking, zero cookies.",
};

export default function PrivacyPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(52,211,153,0.1)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.2)]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Server Uploads Guarantee</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Privacy Policy: Tumhara Data Tumhara Hai
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          SourceLab ka fundamental principle simple hai: <strong className="text-[var(--sl-text)]">koi backend server nahi hai</strong>. Har file, image, PDF, code snippet, password ya hash tumhare apne device ki RAM me process hoti hai.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-[var(--sl-border)]">
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-text)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--sl-success)]" />
            <span>1. Client-Side Only Processing</span>
          </div>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed pl-6">
            Sabhi calculations Web Workers, HTML5 Canvas, pure JavaScript aur WebAssembly ke zariye browser me run hoti hain. Server par koi upload endpoint hi exist nahi karta.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-text)]">
            <Lock className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>2. Zero Cookies & No Analytics Tracking</span>
          </div>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed pl-6">
            Hum koi tracking cookies, Google Analytics, telemetry ya third-party trackers use nahi karte. Tumhare kisi bhi action ya input ka record humare paas nahi aata.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-text)]">
            <Database className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>3. LocalStorage Usage — Sirf UI State ke Liye</span>
          </div>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed pl-6">
            SourceLab sirf 3 keys tumhare browser ke local storage me store karta hai taaki tumhara user experience smooth rahe:
          </p>
          <div className="pl-6 space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]">
              <span className="text-[var(--sl-accent)] font-semibold">sl:favs</span>: Tumhare bookmarked tools ki ID list (e.g. `[&quot;json-formatter&quot;, &quot;base64&quot;]`).
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]">
              <span className="text-[var(--sl-accent)] font-semibold">sl:recent</span>: Haal hi me open kiye gaye tools ki temporary list.
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]">
              <span className="text-[var(--sl-accent)] font-semibold">sl:theme</span>: Tumhari theme preference (`&quot;dark&quot;` ya `&quot;light&quot;`).
            </div>
          </div>
        </div>

        {/* Live Network & Storage Inspector */}
        <div className="space-y-4 pt-4 border-t border-[var(--sl-border)]">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-heading text-[var(--sl-text)] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--sl-accent)]" />
              <span>Live Privacy Inspector & Network Verification</span>
            </h2>
            <p className="text-xs text-[var(--sl-muted)]">
              Baat karne se zyada proof zaroori hai. Neeche diye simulator aur storage inspector se tum khud verify kar sakte ho:
            </p>
          </div>

          <PrivacyInspector />
        </div>

        <div className="p-5 rounded-2xl bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.2)] space-y-2">
          <h3 className="text-sm font-semibold text-[var(--sl-accent)]">
            💡 Browser DevTools me khud verify kaise karein?
          </h3>
          <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
            1. Keyboard par <kbd className="px-1.5 py-0.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)] font-mono">F12</kbd> ya <kbd className="px-1.5 py-0.5 rounded bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-text)] font-mono">Ctrl + Shift + I</kbd> dabao.<br />
            2. <span className="font-mono text-[var(--sl-text)]">Network</span> tab me jao aur filter ko <span className="font-mono text-[var(--sl-text)]">Fetch/XHR</span> select karo.<br />
            3. Koi bhi tool (e.g. Image Compress, Hash Generator ya JSON Formatter) run karo.<br />
            4. Network tab me 0 outgoing requests dikhengi — koi data bahar nahi jata.
          </p>
        </div>
      </div>
    </main>
  );
}
