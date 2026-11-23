"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeroComparison } from "./HeroComparison";
import { Search } from "lucide-react";

interface HeroSpatialProps {
  totalTools: number;
}

const SEARCH_PROMPTS = [
  "compress an image…",
  "analyze JS for secrets…",
  "merge multiple PDFs…",
  "check DNS over HTTPS…",
  "audit security headers…",
  "decode JWT tokens…",
  "calculate monthly EMI…",
];

export function HeroSpatial({ totalTools }: HeroSpatialProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [typewriterText, setTypewriterText] = useState("");
  const [mousePos, setMousePos] = useState({ x: 300, y: 200 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      const currentWord = SEARCH_PROMPTS[wordIdx];
      if (isDeleting) {
        charIdx--;
        setTypewriterText(currentWord.substring(0, charIdx));
      } else {
        charIdx++;
        setTypewriterText(currentWord.substring(0, charIdx));
      }

      let speed = isDeleting ? 30 : 65;
      if (!isDeleting && charIdx === currentWord.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % SEARCH_PROMPTS.length;
        speed = 400;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  // Mouse spotlight tracker
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "all") {
      const el = document.getElementById("categories");
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const card = document.querySelector(`[data-cat-card="${cat}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.remove("category-matched");
      void (card as HTMLElement).offsetWidth;
      card.classList.add("category-matched");
    } else {
      const el = document.getElementById("categories");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("sl:open-palette"));
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden pt-6 pb-12 rounded-3xl"
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 z-0"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34,211,238,0.14), transparent 65%)`,
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Spatial Typography & Controls */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-xs font-mono text-[var(--sl-accent)]">
            <span className="w-2 h-2 rounded-full bg-[var(--sl-success)] animate-ping" />
            <span>{totalTools} tools, one dedicated Security Lab</span>
          </div>

          {/* 3D Character Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-[var(--sl-text)] leading-[1.1]">
            <span className="block">
              Your <span className="text-shimmer">files.</span>
            </span>
            <span className="block">
              Your <span className="text-shimmer">browser.</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--sl-muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Zero cloud uploads for client-side tools. A dedicated Security Lab for deep recon, when you need it. Fast, private, aur no-signup.
          </p>

          {/* Search Trigger with Typewriter */}
          <div className="pt-2 flex justify-center lg:justify-start">
            <button
              type="button"
              onClick={openPalette}
              className="w-full max-w-md flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl glass-surface hover:border-cyan-400/50 transition-all shadow-lg group text-left"
              aria-label="Open Command Palette"
            >
              <div className="flex items-center gap-3 overflow-hidden text-sm">
                <Search className="w-4 h-4 text-[var(--sl-accent)] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[var(--sl-muted)] truncate">
                  {typewriterText}
                  <span className="inline-block w-0.5 h-4 ml-0.5 bg-[var(--sl-accent)] animate-pulse align-middle" />
                </span>
              </div>
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-mono rounded bg-white/5 border border-white/10 text-[var(--sl-muted)]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("categories");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl bg-[var(--sl-accent)] text-[#0B0F1A] font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-cyan-500/20"
            >
              Browse all {totalTools}+ tools
            </button>
            <Link
              href="#security-lab"
              className="px-6 py-3 rounded-xl glass-surface text-[var(--sl-text)] font-semibold text-sm hover:border-[var(--sl-accent)] hover:text-[var(--sl-accent)] transition-all"
            >
              Security Lab →
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-full glass-surface text-[var(--sl-success)] border-emerald-500/20">
              🔒 Zero upload
            </span>
            <span className="px-3 py-1 rounded-full glass-surface text-cyan-300 border-cyan-500/20">
              ✓ No signup
            </span>
            <span className="px-3 py-1 rounded-full glass-surface text-amber-300 border-amber-500/20">
              ⚡ 100% free
            </span>
          </div>

          {/* Category Quick Jump Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs font-mono">
            <span className="text-[var(--sl-muted)] mr-1">Jump to:</span>
            {[
              { id: "all", label: "All" },
              { id: "security", label: "Security" },
              { id: "dev", label: "Dev" },
              { id: "pdf", label: "PDF" },
              { id: "image", label: "Image" },
              { id: "calc", label: "Calc" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategoryClick(tab.id)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  activeCategory === tab.id
                    ? "bg-[var(--sl-accent)] text-[#0B0F1A] font-bold border-[var(--sl-accent)]"
                    : "glass-surface text-[var(--sl-muted)] hover:text-[var(--sl-text)] hover:border-cyan-500/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Comparison Slider */}
        <div className="lg:col-span-5 flex justify-center">
          <HeroComparison />
        </div>
      </div>
    </section>
  );
}
