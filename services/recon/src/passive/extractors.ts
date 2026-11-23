import net from "net";

export interface ExtractedContacts {
  emails: Array<{ value: string; label: string }>;
  phones: Array<{ value: string; label: string }>;
}

export interface ExtractedPatterns {
  endpoints: string[];
  colors: string[];
}

export interface ReachabilityCheck {
  port: number;
  open: boolean;
  service: string;
  note: string;
}

const REACHABILITY_PORTS = [
  { port: 80, service: "http" },
  { port: 443, service: "https" },
  { port: 8080, service: "http-alt" },
  { port: 8443, service: "https-alt" },
];

export function extractContacts(html: string): ExtractedContacts {
  const emails = new Set<string>();
  const phones = new Set<string>();

  // Strict email regex (avoids common image/asset extension false positives)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  let match: RegExpExecArray | null;
  while ((match = emailRegex.exec(html)) !== null) {
    const email = match[0].toLowerCase();
    // Exclude dummy example / schema domains
    if (!email.endsWith("@example.com") && !email.endsWith("@schema.org") && !email.endsWith(".png") && !email.endsWith(".jpg")) {
      emails.add(email);
    }
  }

  // Common international and local phone numbers (+91..., +1..., (123) 456-7890)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  while ((match = phoneRegex.exec(html)) !== null) {
    const raw = match[0].trim();
    if (raw.replace(/\D/g, "").length >= 10 && raw.replace(/\D/g, "").length <= 15) {
      phones.add(raw);
    }
  }

  return {
    emails: Array.from(emails).slice(0, 20).map((e) => ({
      value: e,
      label: "found in page content (unverified)",
    })),
    phones: Array.from(phones).slice(0, 20).map((p) => ({
      value: p,
      label: "found in page content (unverified)",
    })),
  };
}

export function extractPatterns(html: string): ExtractedPatterns {
  const endpoints = new Set<string>();
  const colors = new Set<string>();

  // 1. Dominant / Theme Colors
  const themeMatch = html.match(/<meta\s+name=["']theme-color["']\s+content=["']([^"']+)["']/i);
  if (themeMatch && themeMatch[1]) {
    colors.add(themeMatch[1].trim());
  }

  // Hex colors from style attributes or inline tags
  const hexMatches = html.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g);
  for (const h of hexMatches) {
    colors.add(h[0].toLowerCase());
    if (colors.size >= 12) break;
  }

  // 2. API Endpoint pattern extraction (/api/v1..., /graphql, /rest/...)
  const endpointRegex = /["'](\/(?:api|v[0-9]+|rest|graphql|oauth|auth|user|webhook)[a-zA-Z0-9_\-\/]*)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = endpointRegex.exec(html)) !== null) {
    endpoints.add(match[1]);
    if (endpoints.size >= 50) break;
  }

  return {
    endpoints: Array.from(endpoints),
    colors: Array.from(colors),
  };
}

export async function checkStandardReachability(pinnedIp: string, timeoutMs = 2_000): Promise<ReachabilityCheck[]> {
  return Promise.all(
    REACHABILITY_PORTS.map(
      ({ port, service }) =>
        new Promise<ReachabilityCheck>((resolve) => {
          const socket = new net.Socket();
          let settled = false;

          socket.setTimeout(timeoutMs);

          socket.connect(port, pinnedIp, () => {
            if (!settled) {
              settled = true;
              socket.destroy();
              resolve({
                port,
                open: true,
                service,
                note: "Confirmed responsive (reachability check only, not a port scanner)",
              });
            }
          });

          const onFailed = () => {
            if (!settled) {
              settled = true;
              socket.destroy();
              resolve({
                port,
                open: false,
                service,
                note: "Port not reachable (reachability check only, not a port scanner)",
              });
            }
          };

          socket.on("timeout", onFailed);
          socket.on("error", onFailed);
        })
    )
  );
}
