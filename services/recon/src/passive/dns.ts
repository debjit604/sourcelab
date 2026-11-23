import dns from "dns/promises";

export interface DnsRecordSet {
  A?: string[];
  AAAA?: string[];
  MX?: Array<{ exchange: string; priority: number }>;
  TXT?: string[];
  NS?: string[];
  CNAME?: string[];
  CAA?: Array<{ critical: number; issue?: string; issuewild?: string; iodef?: string }>;
  SOA?: {
    nsname: string;
    hostmaster: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minttl: number;
  };
}

export interface EmailSecurityHints {
  spf: { exists: boolean; raw?: string; policy?: "reject" | "softfail" | "neutral" | "permissive"; warnings: string[] };
  dmarc: { exists: boolean; raw?: string; policy?: string; rua?: string; warnings: string[] };
  dkimHints: { checkedSelectors: string[]; found: string[] };
}

export interface SubdomainPresence {
  subdomain: string;
  fqdn: string;
  resolves: boolean;
  ip?: string;
}

const COMMON_SUBDOMAINS = ["www", "api", "admin", "mail", "dev", "staging", "app", "cdn", "static", "docs"];

export async function resolveDnsRecords(hostname: string): Promise<DnsRecordSet> {
  const result: DnsRecordSet = {};

  const safeResolve = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    try {
      return await fn();
    } catch {
      return undefined;
    }
  };

  const [a, aaaa, mx, txt, ns, cname, caa, soa] = await Promise.all([
    safeResolve(() => dns.resolve4(hostname)),
    safeResolve(() => dns.resolve6(hostname)),
    safeResolve(() => dns.resolveMx(hostname)),
    safeResolve(() => dns.resolveTxt(hostname)),
    safeResolve(() => dns.resolveNs(hostname)),
    safeResolve(() => dns.resolveCname(hostname)),
    safeResolve(() => dns.resolveCaa(hostname)),
    safeResolve(() => dns.resolveSoa(hostname)),
  ]);

  if (a) result.A = a;
  if (aaaa) result.AAAA = aaaa;
  if (mx) result.MX = mx;
  if (txt) result.TXT = txt.map((chunks) => chunks.join(""));
  if (ns) result.NS = ns;
  if (cname) result.CNAME = cname;
  if (caa) result.CAA = caa;
  if (soa) result.SOA = soa;

  return result;
}

export async function checkEmailSecurity(hostname: string, txtRecords?: string[]): Promise<EmailSecurityHints> {
  const texts = txtRecords || (await dns.resolveTxt(hostname).catch(() => [])).map((c) => c.join(""));

  // SPF check
  const spfRecord = texts.find((t) => t.toLowerCase().startsWith("v=spf1"));
  const spf: EmailSecurityHints["spf"] = { exists: !!spfRecord, warnings: [] };
  if (spfRecord) {
    spf.raw = spfRecord;
    const lower = spfRecord.toLowerCase();
    if (lower.includes("-all")) {
      spf.policy = "reject";
    } else if (lower.includes("~all")) {
      spf.policy = "softfail";
      spf.warnings.push("SPF uses ~all (softfail) instead of -all (hardfail).");
    } else if (lower.includes("+all")) {
      spf.policy = "permissive";
      spf.warnings.push("CRITICAL: SPF uses +all allowing any server to send mail.");
    } else {
      spf.policy = "neutral";
    }
  } else {
    spf.warnings.push("Missing SPF record. Domain vulnerable to email spoofing.");
  }

  // DMARC check at _dmarc.<hostname>
  const dmarcTexts = (await dns.resolveTxt(`_dmarc.${hostname}`).catch(() => [])).map((c) => c.join(""));
  const dmarcRecord = dmarcTexts.find((t) => t.toLowerCase().startsWith("v=dmarc1"));
  const dmarc: EmailSecurityHints["dmarc"] = { exists: !!dmarcRecord, warnings: [] };
  if (dmarcRecord) {
    dmarc.raw = dmarcRecord;
    const matchPolicy = dmarcRecord.match(/p=([^;\s]+)/i);
    const matchRua = dmarcRecord.match(/rua=([^;\s]+)/i);
    dmarc.policy = matchPolicy ? matchPolicy[1].toLowerCase() : "none";
    if (matchRua) dmarc.rua = matchRua[1];
    if (dmarc.policy === "none") {
      dmarc.warnings.push("DMARC policy is set to 'none' (monitoring only, no enforcement).");
    }
  } else {
    dmarc.warnings.push("Missing DMARC record. Email authentication cannot be enforced.");
  }

  // DKIM hints check for common selectors
  const selectors = ["default", "google", "k1", "mail", "s1"];
  const foundSelectors: string[] = [];
  await Promise.all(
    selectors.map(async (sel) => {
      const dkimTxt = await dns.resolveTxt(`${sel}._domainkey.${hostname}`).catch(() => null);
      if (dkimTxt && dkimTxt.length > 0) {
        foundSelectors.push(sel);
      }
    })
  );

  return { spf, dmarc, dkimHints: { checkedSelectors: selectors, found: foundSelectors } };
}

export async function checkCommonSubdomains(rootDomain: string): Promise<SubdomainPresence[]> {
  const results: SubdomainPresence[] = [];

  await Promise.all(
    COMMON_SUBDOMAINS.map(async (sub) => {
      const fqdn = `${sub}.${rootDomain}`;
      try {
        const addresses = await dns.resolve4(fqdn);
        if (addresses && addresses.length > 0) {
          results.push({ subdomain: sub, fqdn, resolves: true, ip: addresses[0] });
        } else {
          results.push({ subdomain: sub, fqdn, resolves: false });
        }
      } catch {
        results.push({ subdomain: sub, fqdn, resolves: false });
      }
    })
  );

  return results.sort((a, b) => (b.resolves ? 1 : 0) - (a.resolves ? 1 : 0));
}
