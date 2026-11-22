"use client";

import React from "react";
import { Search } from "lucide-react";

export function SearchTrigger({ className }: { className?: string }) {
  const handleOpen = () => {
    window.dispatchEvent(new Event("sl:open-palette"));
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label="Search tools"
      className={`group relative flex items-center justify-between w-full max-w-2xl px-5 py-4 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] hover:border-[var(--sl-accent)] transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_35px_rgba(34,211,238,0.15)] text-left ${
        className || ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-2 rounded-xl bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] group-hover:scale-110 transition-transform">
          <Search className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm md:text-base font-medium text-[var(--sl-text)] truncate">
            Koi bhi tool search karo...
          </p>
          <p className="text-xs text-[var(--sl-muted)] truncate">
            JSON format, Base64, QR Code, Image compress, Password...
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-muted)] shrink-0">
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--sl-border)] text-[var(--sl-accent)] font-semibold">
          Ctrl K
        </kbd>
      </div>
    </button>
  );
}
