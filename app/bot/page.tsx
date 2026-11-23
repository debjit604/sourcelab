import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Shield, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "SourceLabBot Disclosure & Webmaster Info | SourceLab",
  description:
    "Information regarding SourceLabBot, its automated crawling behavior, respect for robots.txt, and webmaster controls.",
};

export default function BotDisclosurePage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.2)]">
          <Bot className="w-3.5 h-3.5" />
          <span>User-Agent: SourceLabBot/1.0</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          SourceLabBot Disclosure
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          SourceLab operates an on-demand, user-initiated website snapshot and reconnaissance bot.
          This page provides transparent information for webmasters and network administrators.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-[var(--sl-border)]">
        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--sl-success)]" />
            <span>Behavior & Etiquette</span>
          </h2>
          <ul className="text-xs md:text-sm text-[var(--sl-muted)] space-y-2 pl-6 list-disc">
            <li><strong>On-Demand Only:</strong> SourceLabBot never crawls the web autonomously. It only accesses a target when an authorized user initiates a scan.</li>
            <li><strong>Shallow Scope:</strong> Crawls are limited to a maximum depth of 2 and capped at 25 pages per domain.</li>
            <li><strong>Polite Rate Limits:</strong> Delays are enforced between requests to avoid impacting origin server performance.</li>
            <li><strong>Safe Execution:</strong> Browser sandboxing is strictly enabled; no form submission, credential spraying, or vulnerability exploitation is ever conducted.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>How to Block SourceLabBot (robots.txt)</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
            SourceLabBot respects standard <code>robots.txt</code> directives by default. To disallow SourceLabBot from accessing your site, add the following to your domain&apos;s <code>robots.txt</code>:
          </p>
          <pre className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs text-[var(--sl-accent)]">
{`User-agent: SourceLabBot
Disallow: /`}
          </pre>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--sl-text)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--sl-accent)]" />
            <span>Opt-Out & Abuse Contact</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] leading-relaxed">
            If you wish to permanently block your domain from all SourceLab security scanning tools, or if you suspect abusive activity, please visit our <Link href="/abuse" className="text-[var(--sl-accent)] underline">Abuse & Opt-Out Portal</Link> or contact us directly at <span className="font-mono text-[var(--sl-text)]">abuse@sourcelab.io</span>.
          </p>
        </div>
      </div>
    </main>
  );
}
