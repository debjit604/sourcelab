import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About SourceLab | Free & Private Browser Utilities",
  description:
    "SourceLab is built with love in Bharat. 200+ browser tools that run 100% on your device with zero server uploads.",
};

export default function AboutPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.2)]">
          <Zap className="w-3.5 h-3.5" />
          <span>Made for Speed & Privacy</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Kyu banaya humne SourceLab?
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          Internet par chote-mote tools (PDF merge, image resize, JSON beautify) use karte waqt hum sab pareshan hote the — har jagah login maanga jata hai, 30 second ka timer lagaya jata hai, ya watermark daal diya jata hai. Sabse bada khatra: tumhari private file kisi anjaan server pe chali jati hai.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <ShieldCheck className="w-6 h-6 text-[var(--sl-success)]" />
          <h2 className="text-base font-semibold text-[var(--sl-text)]">Zero Uploads</h2>
          <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
            Tumhari file tumhare browser ki RAM me process hoti hai. Server par kabhi transmit nahi hoti.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2">
          <Zap className="w-6 h-6 text-[var(--sl-accent)]" />
          <h2 className="text-base font-semibold text-[var(--sl-text)]">No Signup, No Watermark</h2>
          <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
            Direct tool open karo aur kaam shuru karo. Koi email verification nahi, koi hidden fees nahi.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
        <h2 className="text-lg font-bold font-heading text-[var(--sl-text)]">
          Architecture & Technology
        </h2>
        <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
          SourceLab Next.js static export par chalta hai aur GitHub Pages par 100% free hosting use karta hai. Complex operations jaise audio/video rendering, PDF generation, aur image processing Web Workers aur WebAssembly ke zariye run hote hain.
        </p>
        <div className="pt-2">
          <Link
            href="/request-tool"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--sl-accent)] hover:underline font-medium"
          >
            <span>Naya tool suggest karo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <p className="text-xs text-[var(--sl-muted)] flex items-center gap-1.5">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
        <span>in Bharat. Dedicated to open web and digital privacy.</span>
      </p>
    </main>
  );
}
