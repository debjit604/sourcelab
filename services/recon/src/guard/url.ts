import dns from "dns/promises";
import { isForbiddenIp, normalizeIp } from "./ip";

export interface IsAllowedResult {
  allowed: boolean;
  reason?: string;
  resolvedIps?: string[];
  pinIp?: string;
  targetPort?: number;
  parsedUrl?: URL;
}

const ALLOWED_PORTS = new Set([80, 443, 8080, 8443]);
const FORBIDDEN_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "local",
  "broadcasthost",
]);

export function validateTargetUrl(rawUrl: string): { valid: boolean; error?: string; parsed?: URL } {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, error: "URL string is required" };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, error: "Invalid URL syntax" };
  }

  // 1. Protocol check: http/https only
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: `Disallowed protocol: ${parsed.protocol} (only http: and https: allowed)` };
  }

  // 2. Reject credentials in URL (user:pass@host)
  if (parsed.username || parsed.password) {
    return { valid: false, error: "Credentials in URL are strictly forbidden" };
  }

  // 3. Port check
  const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === "https:" ? 443 : 80;
  if (isNaN(port) || !ALLOWED_PORTS.has(port)) {
    return { valid: false, error: `Disallowed destination port: ${port} (only 80, 443, 8080, 8443 allowed)` };
  }

  // 4. Hostname checks
  const hostname = parsed.hostname.toLowerCase().trim();
  if (!hostname) {
    return { valid: false, error: "Missing or empty hostname" };
  }

  if (
    FORBIDDEN_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan") ||
    hostname.endsWith(".corp") ||
    hostname.endsWith(".home")
  ) {
    return { valid: false, error: `Forbidden local or internal hostname: ${hostname}` };
  }

  // If hostname is directly an IP literal or numeric representation
  const directIpNorm = normalizeIp(hostname);
  if (directIpNorm) {
    const check = isForbiddenIp(directIpNorm);
    if (check.forbidden) {
      return { valid: false, error: `Direct IP ${hostname} is forbidden: ${check.reason}` };
    }
  }

  return { valid: true, parsed };
}

export async function isAllowedRequest(rawUrl: string): Promise<IsAllowedResult> {
  const urlCheck = validateTargetUrl(rawUrl);
  if (!urlCheck.valid || !urlCheck.parsed) {
    return { allowed: false, reason: urlCheck.error };
  }

  const parsed = urlCheck.parsed;
  const hostname = parsed.hostname.toLowerCase();
  const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === "https:" ? 443 : 80;

  // Direct IP check
  const directIpNorm = normalizeIp(hostname);
  if (directIpNorm) {
    const ipCheck = isForbiddenIp(directIpNorm);
    if (ipCheck.forbidden) {
      return { allowed: false, reason: ipCheck.reason };
    }
    return {
      allowed: true,
      resolvedIps: [directIpNorm],
      pinIp: directIpNorm,
      targetPort: port,
      parsedUrl: parsed,
    };
  }

  // DNS Resolution check (resolves IPv4 and IPv6)
  let resolvedEntries: Array<{ address: string; family: number }>;
  try {
    resolvedEntries = await dns.lookup(hostname, { all: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DNS resolution failed";
    return { allowed: false, reason: `DNS resolution error for ${hostname}: ${msg}` };
  }

  if (!resolvedEntries || resolvedEntries.length === 0) {
    return { allowed: false, reason: `No DNS records found for ${hostname}` };
  }

  const resolvedIps = resolvedEntries.map((e) => e.address);

  // Validate EVERY resolved IP
  for (const entry of resolvedEntries) {
    const check = isForbiddenIp(entry.address);
    if (check.forbidden) {
      return {
        allowed: false,
        reason: `Hostname ${hostname} resolves to forbidden IP ${entry.address}: ${check.reason}`,
        resolvedIps,
      };
    }
  }

  // Return the first validated IP for IP pinning to fix TOCTOU DNS rebinding
  return {
    allowed: true,
    resolvedIps,
    pinIp: resolvedEntries[0].address,
    targetPort: port,
    parsedUrl: parsed,
  };
}
