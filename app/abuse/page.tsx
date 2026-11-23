import React from "react";
import type { Metadata } from "next";
import { AlertTriangle, ShieldCheck, Mail, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Report Abuse & Domain Opt-Out | SourceLab",
  description:
    "Report automated abuse or request permanent opt-out for your domain from SourceLab's security reconnaissance tools.",
};

export default function AbusePortalPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(248,113,113,0.1)] text-[var(--sl-error)] border border-[rgba(248,113,113,0.2)]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Security & Trust Center</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Abuse Reporting & Domain Opt-Out
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          SourceLab is committed to ethical, defensive security tooling. We actively enforce strict rate limits, SSRF boundaries, and respects webmaster rights.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-[var(--sl-border)]">
        {/* Opt-Out Policy */}
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>Permanent Domain Opt-Out</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
            As a domain owner or administrator, you have the unilateral right to block SourceLab from auditing your website.
            Once added to our blocklist, any attempt by any user to scan your domain or subdomains will immediately fail with an HTTP 403 response.
          </p>
          <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs text-[var(--sl-muted)] space-y-1">
            <span className="font-semibold text-[var(--sl-accent)]">Quick Verification Method:</span>
            <p>
              To expedite domain opt-out, add a DNS TXT record: <code>sourcelab-opt-out=true</code> or email from an authorized domain address (e.g., <code>security@yourdomain.com</code>) to <span className="font-mono text-[var(--sl-text)]">abuse@sourcelab.io</span>.
            </p>
          </div>
        </div>

        {/* Reporting Misuse */}
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--sl-warning)]" />
            <span>Reporting Abusive Activity</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
            If you observe unauthorized traffic originating from SourceLab IP addresses, please include the following details in your report:
          </p>
          <ul className="text-xs md:text-sm text-[var(--sl-muted)] space-y-1 pl-6 list-disc">
            <li>Target URL and timestamp (UTC)</li>
            <li>Originating IP address and User-Agent string</li>
            <li>Server access log excerpts demonstrating the issue</li>
          </ul>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] pt-2">
            Direct urgent inquiries to: <a href="mailto:abuse@sourcelab.io" className="text-[var(--sl-accent)] font-mono underline">abuse@sourcelab.io</a>. We review reports within 24 hours.
          </p>
        </div>

        {/* Defense in depth summary */}
        <div className="p-5 rounded-2xl bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.2)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sl-success)]">
            <ShieldCheck className="w-4 h-4 text-[var(--sl-success)]" />
            <span>Built-in Restrictions Active</span>
          </div>
          <p className="text-xs text-[var(--sl-muted)] leading-relaxed">
            SourceLab automatically blocks all government (.gov) and military (.mil) domains globally, forbids internal IP ranges (RFC1918), and requires Cloudflare Turnstile token validation on all automated scan requests.
          </p>
        </div>
      </div>
    </main>
  );
}
