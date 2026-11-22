"use client";

import React from "react";
import Link from "next/link";
import { Search, Star, ShieldCheck } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { favorites } = useFavorites();

  const handleOpenSearch = () => {
    window.dispatchEvent(new Event("sl:open-palette"));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--sl-border)] bg-[rgba(11,15,26,0.85)] backdrop-blur-md">
      <div className="max-w-[var(--max-w-home)] mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--sl-accent)] to-blue-600 flex items-center justify-center text-slate-950 font-bold font-heading text-lg shadow-[0_0_12px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-[var(--sl-text)] tracking-tight">
              Source<span className="text-[var(--sl-accent)]">Lab</span>
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[rgba(52,211,153,0.1)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.2)] ml-2">
            <ShieldCheck className="w-3 h-3" />
            100% Client-Side
          </span>
        </Link>

        {/* Center: Search Trigger */}
        <button
          type="button"
          onClick={handleOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)] hover:border-[var(--sl-accent)] transition-all text-xs md:text-sm shadow-sm"
          aria-label="Search tools with Ctrl+K"
        >
          <Search className="w-4 h-4 text-[var(--sl-accent)]" />
          <span className="hidden sm:inline">Search tools...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--sl-border)] text-[10px] font-mono text-[var(--sl-muted)] ml-2">
            Ctrl K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#favorites"
            className="relative p-2 rounded-xl text-[var(--sl-muted)] hover:text-[var(--sl-text)] hover:bg-[var(--sl-surface)] border border-transparent hover:border-[var(--sl-border)] transition-colors"
            aria-label="Favorites"
          >
            <Star className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--sl-accent)] text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
