import React from "react";
import type { Metadata } from "next";
import { Shield, FileCheck, AlertCircle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Recon & Security Tools Terms of Use | SourceLab",
  description:
    "Acceptable use policy and authorized testing agreement for SourceLab security reconnaissance and website snapshot utilities.",
};

export default function ReconTermsPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.2)]">
          <Scale className="w-3.5 h-3.5" />
          <span>Acceptable Use Policy</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Recon & Security Tools Terms of Use
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          SourceLab provides security analysis tools (such as Website Snapshot, JS Analyzer, DNS Lookup, CSP Evaluator) strictly for defensive, educational, and authorized audit purposes.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-[var(--sl-border)]">
        {/* Requirement 1: Authorization */}
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>1. Mandatory Authorization</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
            You represent and warrant that you own or possess explicit written authorization from the owner of any target domain you submit to SourceLab tools.
            Scanning targets without prior authorization may violate applicable regional cyber laws (e.g., CFAA, IT Act 2000).
          </p>
        </div>

        {/* Requirement 2: Prohibited Actions */}
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[var(--sl-error)]" />
            <span>2. Strictly Prohibited Conduct</span>
          </h2>
          <ul className="text-xs md:text-sm text-[var(--sl-muted)] space-y-2 pl-6 list-disc">
            <li>Attempting to probe internal infrastructure, loopback addresses, or private cloud metadata.</li>
            <li>Conducting denial-of-service (DoS), brute force, credential spraying, or high-frequency fuzzing.</li>
            <li>Using discovered sensitive tokens or credentials to access remote systems or exfiltrate private data.</li>
            <li>Circumventing rate limits, Captchas, or geographic blocklists.</li>
          </ul>
        </div>

        {/* Requirement 3: Passive Nature */}
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--sl-success)]" />
            <span>3. Defensive & Passive Nature</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
            SourceLab tools are passive or shallow observational tools. They do not inject exploits, bypass access controls, or manipulate target application state. All discovered findings are intended solely to help developers secure their digital footprint.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs text-[var(--sl-muted)] leading-relaxed">
          <strong>Disclaimer:</strong> SourceLab is provided &quot;as is&quot; without warranty of any kind. You assume full legal responsibility for any actions undertaken using this platform.
        </div>
      </div>
    </main>
  );
}
