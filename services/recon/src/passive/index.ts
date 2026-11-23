import { isAllowedRequest } from "../guard/url";
import { safeFetch } from "../guard/fetch";
import { resolveDnsRecords, checkEmailSecurity, checkCommonSubdomains, DnsRecordSet, EmailSecurityHints, SubdomainPresence } from "./dns";
import { inspectTlsCertificate, SslCertInfo } from "./ssl";
import { lookupRdap, WhoisResult } from "./whois";
import { auditSeo, SeoAuditResult } from "./seo";
import { extractContacts, extractPatterns, checkStandardReachability, ExtractedContacts, ExtractedPatterns, ReachabilityCheck } from "./extractors";

export interface PassiveReconResult {
  targetUrl: string;
  hostname: string;
  pinnedIp: string;
  dns: DnsRecordSet;
  emailSecurity: EmailSecurityHints;
  subdomains: SubdomainPresence[];
  ssl?: SslCertInfo;
  whois?: WhoisResult;
  seo?: SeoAuditResult;
  contacts?: ExtractedContacts;
  patterns?: ExtractedPatterns;
  reachability: ReachabilityCheck[];
  timestamp: string;
}

export async function runPassiveRecon(
  targetUrl: string,
  providedHtml?: string
): Promise<PassiveReconResult> {
  // 1. Initial SSRF check and IP resolution
  const guard = await isAllowedRequest(targetUrl);
  if (!guard.allowed || !guard.pinIp || !guard.parsedUrl) {
    throw new Error(`SSRF Guard Blocked [${targetUrl}]: ${guard.reason || "Forbidden"}`);
  }

  const hostname = guard.parsedUrl.hostname;
  const pinnedIp = guard.pinIp;
  const isHttps = guard.parsedUrl.protocol === "https:";
  const port = guard.parsedUrl.port ? parseInt(guard.parsedUrl.port, 10) : isHttps ? 443 : 80;

  // 2. Fetch raw HTML if not provided
  let html = providedHtml || "";
  if (!html) {
    try {
      const res = await safeFetch(targetUrl, { timeoutMs: 6_000, maxBytes: 2 * 1024 * 1024 });
      html = res.body.toString("utf-8");
    } catch {
      // Continue even if HTML fetch fails
    }
  }

  // 3. Parallel passive gathering
  const [dnsRecords, emailSec, subdomains, whois, reachability] = await Promise.all([
    resolveDnsRecords(hostname),
    checkEmailSecurity(hostname),
    checkCommonSubdomains(hostname),
    lookupRdap(hostname),
    checkStandardReachability(pinnedIp),
  ]);

  // 4. SSL certificate inspection if HTTPS or port 443/8443
  let ssl: SslCertInfo | undefined;
  if (isHttps || port === 443 || port === 8443) {
    try {
      ssl = await inspectTlsCertificate(hostname, pinnedIp, port);
    } catch {
      // Non-fatal if TLS cert retrieval fails
    }
  }

  // 5. SEO & content extraction
  const seo = html ? auditSeo(html, targetUrl) : undefined;
  const contacts = html ? extractContacts(html) : undefined;
  const patterns = html ? extractPatterns(html) : undefined;

  return {
    targetUrl,
    hostname,
    pinnedIp,
    dns: dnsRecords,
    emailSecurity: emailSec,
    subdomains,
    ssl,
    whois,
    seo,
    contacts,
    patterns,
    reachability,
    timestamp: new Date().toISOString(),
  };
}

export {
  resolveDnsRecords,
  checkEmailSecurity,
  checkCommonSubdomains,
  inspectTlsCertificate,
  lookupRdap,
  auditSeo,
  extractContacts,
  extractPatterns,
  checkStandardReachability,
};
