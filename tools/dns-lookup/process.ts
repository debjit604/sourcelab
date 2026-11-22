export type DnsRecordType = "A" | "AAAA" | "MX" | "TXT" | "NS" | "CNAME" | "CAA" | "SOA";

export interface DnsAnswerRecord {
  name: string;
  type: string;
  typeId: number;
  ttl: number;
  data: string;
}

export interface DnsLookupResult {
  domain: string;
  resolver: "cloudflare" | "google";
  records: DnsAnswerRecord[];
  spf?: string;
  dmarc?: string;
  status: number; // 0 is NOERROR
}

export const DNS_TYPE_MAP: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  257: "CAA",
};

export const REVERSE_TYPE_MAP: Record<string, number> = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  CAA: 257,
};

export function cleanDomainInput(input: string): string {
  let cleaned = input.trim().toLowerCase();
  // Strip protocol if user pasted a URL
  cleaned = cleaned.replace(/^https?:\/\//, "");
  // Strip path or port
  cleaned = cleaned.split("/")[0].split(":")[0];
  return cleaned;
}

export function parseDohResponse(
  json: { Status?: number; Answer?: { name: string; type: number; TTL: number; data: string }[] },
  domain: string,
  resolver: "cloudflare" | "google"
): DnsLookupResult {
  const records: DnsAnswerRecord[] = [];
  let spf: string | undefined = undefined;
  let dmarc: string | undefined = undefined;

  if (Array.isArray(json.Answer)) {
    for (const ans of json.Answer) {
      const typeStr = DNS_TYPE_MAP[ans.type] || `TYPE_${ans.type}`;
      const cleanData = ans.data.replace(/^"|"$/g, "").replace(/\\"/g, '"');

      records.push({
        name: ans.name,
        type: typeStr,
        typeId: ans.type,
        ttl: ans.TTL,
        data: cleanData,
      });

      // Check for SPF policy
      if (ans.type === 16 && cleanData.startsWith("v=spf1")) {
        spf = cleanData;
      }
      // Check for DMARC policy
      if (ans.type === 16 && cleanData.startsWith("v=DMARC1")) {
        dmarc = cleanData;
      }
    }
  }

  return {
    domain,
    resolver,
    records,
    spf,
    dmarc,
    status: json.Status ?? 0,
  };
}

export async function fetchDohRecords(
  domain: string,
  type: DnsRecordType | "ALL" = "ALL",
  resolver: "cloudflare" | "google" = "cloudflare"
): Promise<DnsLookupResult> {
  const cleanDomain = cleanDomainInput(domain);
  if (!cleanDomain) {
    throw new Error("Valid domain name enter karo (jaise example.com)");
  }

  const typesToQuery =
    type === "ALL" ? ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "CAA", "SOA"] : [type];

  const allRecords: DnsAnswerRecord[] = [];
  let spf: string | undefined = undefined;
  let dmarc: string | undefined = undefined;

  for (const t of typesToQuery) {
    try {
      let endpoint = "";
      let headers: HeadersInit = {};

      if (resolver === "google") {
        endpoint = `https://dns.google/resolve?name=${encodeURIComponent(
          cleanDomain
        )}&type=${encodeURIComponent(t)}`;
      } else {
        endpoint = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
          cleanDomain
        )}&type=${encodeURIComponent(t)}`;
        headers = { Accept: "application/dns-json" };
      }

      const res = await fetch(endpoint, { headers });
      if (!res.ok) continue;
      const data = await res.json();
      const parsed = parseDohResponse(data, cleanDomain, resolver);

      allRecords.push(...parsed.records);
      if (parsed.spf) spf = parsed.spf;
    } catch {
      // Ignore single record lookup network failures
    }
  }

  // Also query _dmarc.<domain> for DMARC
  try {
    const dmarcDomain = `_dmarc.${cleanDomain}`;
    const dmarcUrl =
      resolver === "google"
        ? `https://dns.google/resolve?name=${encodeURIComponent(dmarcDomain)}&type=TXT`
        : `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(dmarcDomain)}&type=TXT`;
    const res = await fetch(dmarcUrl, { headers: { Accept: "application/dns-json" } });
    if (res.ok) {
      const data = await res.json();
      const parsed = parseDohResponse(data, dmarcDomain, resolver);
      if (parsed.dmarc) dmarc = parsed.dmarc;
    }
  } catch {
    // Ignore DMARC lookup failure
  }

  return {
    domain: cleanDomain,
    resolver,
    records: allRecords,
    spf,
    dmarc,
    status: 0,
  };
}

export interface ProcessInput {
  domain: string;
  type?: DnsRecordType | "ALL";
  resolver?: "cloudflare" | "google";
}

export async function process(input: ProcessInput): Promise<DnsLookupResult> {
  return fetchDohRecords(input.domain, input.type || "ALL", input.resolver || "cloudflare");
}
