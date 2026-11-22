import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SourceLab",
  description:
    "SourceLab is 100% client-side. Tumhari file tumhare browser me hi process hoti hai — server pe kabhi nahi jaati.",
};

export default function PrivacyPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(52,211,153,0.1)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.2)]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Server Uploads Guarantee</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Privacy Policy: Tumhara Data Tumhara Hai
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          SourceLab ka fundamental rule: koi backend server nahi hai. Har file, image, PDF, code aur calculation tumhare apne device ki RAM me process hoti hai.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-[var(--sl-border)]">
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-text)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--sl-success)]" />
            <span>1. Client-Side Processing</span>
          </div>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed pl-6">
            Sabhi calculations Web Workers, HTML5 Canvas, aur WebAssembly (WASM) ke zariye browser me run hoti hain. Koi file hamare paas transmit nahi hoti.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-text)]">
            <Lock className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>2. Zero Cookies & No Tracking</span>
          </div>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed pl-6">
            Hum koi tracking cookies ya intrusive tracking scripts use nahi karte. Koi account creation ya login required nahi hai.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-text)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--sl-success)]" />
            <span>3. Local Storage ka Use</span>
          </div>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed pl-6">
            Browser ka `localStorage` sirf tumhare favorite tools aur recent tools yaad rakhne ke liye use hota hai. Ye data sirf tumhare phone ya laptop me save rehta hai.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.2)] space-y-2">
          <h3 className="text-sm font-semibold text-[var(--sl-accent)]">
            💡 Khud verify kaise karein?
          </h3>
          <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
            Browser me `F12` dabao, <span className="font-mono text-[var(--sl-text)]">Network</span> tab kholo, aur koi bhi tool run karo. Tumhe dikhega ki 0 bytes data kisi server ko nahi gaya.
          </p>
        </div>
      </div>
    </main>
  );
}
