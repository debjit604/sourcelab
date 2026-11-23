import crypto from "crypto";

export interface BlocklistCheckResult {
  blocked: boolean;
  reason?: string;
}

// Built-in blocked government / military TLDs and second-level domains
const BLOCKED_SUFFIXES = [
  ".gov",
  ".mil",
  ".gov.in",
  ".mil.in",
  ".gov.uk",
  ".mod.uk",
  ".gov.au",
  ".defence.gov.au",
  ".gouv.fr",
  ".bund.de",
  ".gc.ca",
  ".gov.br",
  ".gov.ru",
  ".mil.ru",
  ".gov.cn",
  ".mil.cn",
];

// Target-owner opt-out blocklist (domain hashes or normalized domains)
export class OptOutBlocklist {
  private blockedDomains = new Set<string>();
  private blockedHashes = new Set<string>();

  constructor(initialDomains: string[] = []) {
    for (const d of initialDomains) {
      this.addDomain(d);
    }
  }

  public addDomain(domain: string): void {
    const norm = domain.trim().toLowerCase();
    if (!norm) return;
    this.blockedDomains.add(norm);
    const hash = crypto.createHash("sha256").update(norm).digest("hex");
    this.blockedHashes.add(hash);
  }

  public addHash(sha256Hex: string): void {
    const norm = sha256Hex.trim().toLowerCase();
    if (/^[a-f0-9]{64}$/.test(norm)) {
      this.blockedHashes.add(norm);
    }
  }

  public check(hostname: string): BlocklistCheckResult {
    const host = hostname.trim().toLowerCase().replace(/\.$/, "");

    // 1. Check government & military domains
    for (const suffix of BLOCKED_SUFFIXES) {
      if (host === suffix.slice(1) || host.endsWith(suffix)) {
        return {
          blocked: true,
          reason: "Government and military domains are restricted from automated scanning by policy.",
        };
      }
    }

    // 2. Direct domain block check
    if (this.blockedDomains.has(host)) {
      return {
        blocked: true,
        reason: "This domain has opted out of SourceLab automated scanning.",
      };
    }

    // 3. Parent domain check (e.g., if example.com opted out, sub.example.com is blocked)
    const parts = host.split(".");
    for (let i = 1; i < parts.length - 1; i++) {
      const parentDomain = parts.slice(i).join(".");
      if (this.blockedDomains.has(parentDomain)) {
        return {
          blocked: true,
          reason: "This root domain has opted out of SourceLab automated scanning.",
        };
      }
    }

    // 4. Hash-based check (for privacy-preserving blocklists)
    const hostHash = crypto.createHash("sha256").update(host).digest("hex");
    if (this.blockedHashes.has(hostHash)) {
      return {
        blocked: true,
        reason: "This domain has opted out of SourceLab automated scanning.",
      };
    }

    return { blocked: false };
  }
}

export const defaultBlocklist = new OptOutBlocklist([
  // Known opt-outs or sensitive platforms can be seeded here
]);
