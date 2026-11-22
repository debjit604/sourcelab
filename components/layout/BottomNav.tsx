"use client";

import React from "react";
import Link from "next/link";
import { Home, Search, Star, Grid } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export function BottomNav() {
  const { favorites } = useFavorites();

  const handleOpenSearch = () => {
    window.dispatchEvent(new Event("sl:open-palette"));
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[rgba(18,24,40,0.95)] backdrop-blur-lg border-t border-[var(--sl-border)] flex items-center justify-around px-2"
    >
      <Link
        href="/"
        className="flex flex-col items-center justify-center w-14 h-12 text-[var(--sl-muted)] hover:text-[var(--sl-accent)] transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-1">Home</span>
      </Link>

      <button
        type="button"
        onClick={handleOpenSearch}
        className="flex flex-col items-center justify-center w-14 h-12 text-[var(--sl-muted)] hover:text-[var(--sl-accent)] transition-colors"
      >
        <Search className="w-5 h-5 text-[var(--sl-accent)]" />
        <span className="text-[10px] mt-1 text-[var(--sl-accent)]">Search</span>
      </button>

      <Link
        href="/#categories"
        className="flex flex-col items-center justify-center w-14 h-12 text-[var(--sl-muted)] hover:text-[var(--sl-text)] transition-colors"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] mt-1">Categories</span>
      </Link>

      <Link
        href="/#favorites"
        className="relative flex flex-col items-center justify-center w-14 h-12 text-[var(--sl-muted)] hover:text-[var(--sl-text)] transition-colors"
      >
        <Star className="w-5 h-5" />
        {favorites.length > 0 && (
          <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-[var(--sl-accent)] text-slate-950 text-[9px] font-bold flex items-center justify-center">
            {favorites.length}
          </span>
        )}
        <span className="text-[10px] mt-1">Starred</span>
      </Link>
    </nav>
  );
}
