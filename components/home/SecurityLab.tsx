import React from "react";
import Link from "next/link";
import { Shield, Lock, FileCode, Terminal, Globe, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export function SecurityLab() {
  const securityTools = [
    {
      id: "js-analyzer",
      slug: "/security/js-analyzer",
      name: "JS Secret & Endpoint Analyzer",
      description: "Paste ya drop karo .js, .html, .map ya .har file. 14+ secret categories aur endpoints Web Worker me scan karo.",
      icon: FileCode,
      tag: "Zero Upload (Worker)",
      tagColor: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
    },
    {
      id: "header-analyzer",
      slug: "/security/header-analyzer",
      name: "Security Header Grader",
      description: "Raw HTTP response headers inspect karo. HSTS, X-Frame-Options, aur Permissions-Policy ka score aur suggestions dekho.",
      icon: Terminal,
      tag: "Zero Upload (100% Local)",
      tagColor: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
    },
    {
      id: "csp-evaluator",
      slug: "/security/csp-evaluator",
      name: "CSP Evaluator",
      description: "Content-Security-Policy audit karo. unsafe-inline, unsafe-eval, missing object-src aur wildcard injection risks check karo.",
      icon: Shield,
      tag: "Zero Upload (100% Local)",
      tagColor: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
    },
    {
      id: "cookie-analyzer",
      slug: "/security/cookie-analyzer",
      name: "Cookie Security Auditor",
      description: "Set-Cookie headers parse karo. Secure, HttpOnly, SameSite, aur __Secure-/__Host- prefix hygiene verify karo.",
      icon: Lock,
      tag: "Zero Upload (100% Local)",
      tagColor: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
    },
    {
      id: "dns-lookup",
      slug: "/security/dns-lookup",
      name: "DNS over HTTPS (DoH) Lookup",
      description: "A, AAAA, MX, TXT, NS, CAA, SOA lookup aur SPF/DMARC security validation directly Cloudflare ya Google DoH se.",
      icon: Globe,
      tag: "Third-party DoH (Cloudflare / Google)",
      tagColor: "text-amber-400 bg-amber-950/30 border-amber-800/40",
      honestNotice: "Direct DoH query from browser to resolver",
    },
    {
      id: "website-snapshot",
      slug: "/security/website-snapshot",
      name: "Website Snapshot & Recon",
      description: "Headless browser snapshot, asset mirroring, screenshots, DNS, SSL, aur hidden sensitive paths check.",
      icon: Globe,
      tag: "Server-assisted · 10m TTL",
      tagColor: "text-amber-400 bg-amber-950/30 border-amber-800/40",
      honestNotice: "Target URL fetched by recon service with strict SSRF guard; auto-deletes in 10 minutes",
    },
  ];

  return (
    <section id="security-lab" className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--sl-border)] pb-4 gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/40 text-[11px] font-mono text-[var(--sl-accent)] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Recon & Defensive Suite</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--sl-text)] flex items-center gap-2">
            Security Lab
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] mt-1 max-w-2xl">
            Privacy-first recon aur defensive security auditing. Client-side tools browser me chalte hain, aur server-assisted snapshot 10m TTL ke saath auto-wipe hota hai.
          </p>
        </div>
        <div className="text-[11px] text-[var(--sl-muted)] font-mono">
          Authorized auditing & defensive use only.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col justify-between p-5 rounded-2xl glass-surface border border-[var(--sl-border)] hover:border-[var(--sl-accent)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(34,211,238,0.12)] overflow-hidden"
            >
              {/* Scanline Effect */}
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--sl-accent)] to-transparent animate-scanline pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/30 text-[var(--sl-accent)] border border-cyan-800/30">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tool.tagColor}`}>
                    {tool.tag}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[var(--sl-text)] group-hover:text-[var(--sl-accent)] transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--sl-muted)] line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--sl-border)] flex items-center justify-between text-xs text-[var(--sl-accent)]">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}

        {/* Info card */}
        <div className="p-5 rounded-[14px] bg-gradient-to-br from-[var(--sl-surface)] to-[var(--sl-bg)] border border-[var(--sl-border)] flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--sl-text)]">
              Defensive & Ethical Tooling
            </h4>
            <p className="mt-1 text-xs text-[var(--sl-muted)] leading-relaxed">
              No port scanning, no brute force, no server-side arbitrary fetching. Discovered credentials are never validated or tested against live services.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--sl-border)] flex items-center gap-1.5 text-[11px] text-[var(--sl-muted)]">
            <ExternalLink className="w-3 h-3 text-[var(--sl-accent)]" />
            <span>Client-side Web Workers + DoH</span>
          </div>
        </div>
      </div>
    </section>
  );
}
