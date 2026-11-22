import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--sl-border)] bg-[var(--sl-surface)] py-12 px-4 sm:px-6">
      <div className="max-w-[var(--max-w-home)] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--sl-border)]">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-[var(--sl-text)]">
                Source<span className="text-[var(--sl-accent)]">Lab</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[rgba(52,211,153,0.1)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.2)]">
                <ShieldCheck className="w-3 h-3" />
                Zero Uploads
              </span>
            </div>
            <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
              Tumhari file tumhare browser me hi process hoti hai — server pe kabhi nahi jaati.
              100% free, private, aur no-signup browser utilities.
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap gap-6 text-sm text-[var(--sl-muted)]">
            <Link href="/privacy" className="hover:text-[var(--sl-accent)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[var(--sl-accent)] transition-colors">
              About
            </Link>
            <Link href="/changelog" className="hover:text-[var(--sl-accent)] transition-colors">
              Changelog
            </Link>
            <Link href="/request-tool" className="hover:text-[var(--sl-accent)] transition-colors">
              Request a Tool
            </Link>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--sl-muted)]">
          <p>© {new Date().getFullYear()} SourceLab. Built for complete browser privacy.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> in Bharat
          </p>
        </div>
      </div>
    </footer>
  );
}
