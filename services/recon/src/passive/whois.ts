import { safeFetch } from "../guard/fetch";

export interface WhoisResult {
  domain: string;
  registrar?: string;
  createdDate?: string;
  expiresDate?: string;
  updatedDate?: string;
  nameServers: string[];
  status: string[];
  raw?: unknown;
}

export async function lookupRdap(domain: string, timeoutMs = 6_000): Promise<WhoisResult> {
  const result: WhoisResult = {
    domain,
    nameServers: [],
    status: [],
  };

  try {
    const rdapUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
    const res = await safeFetch(rdapUrl, {
      timeoutMs,
      maxBytes: 1024 * 1024,
      allowedContentTypes: ["application/json", "application/rdap+json"],
    });

    const parsed = JSON.parse(res.body.toString("utf-8"));
    result.raw = parsed;

    // Events (registration, expiration, last changed)
    if (Array.isArray(parsed.events)) {
      for (const ev of parsed.events) {
        if (ev.eventAction === "registration") result.createdDate = ev.eventDate;
        if (ev.eventAction === "expiration") result.expiresDate = ev.eventDate;
        if (ev.eventAction === "last changed") result.updatedDate = ev.eventDate;
      }
    }

    // Entities (Registrar)
    if (Array.isArray(parsed.entities)) {
      for (const entity of parsed.entities) {
        if (Array.isArray(entity.roles) && entity.roles.includes("registrar")) {
          if (Array.isArray(entity.vcardArray) && Array.isArray(entity.vcardArray[1])) {
            const fnEntry = entity.vcardArray[1].find((prop: unknown[]) => prop[0] === "fn");
            if (fnEntry && typeof fnEntry[3] === "string") {
              result.registrar = fnEntry[3];
            }
          }
        }
      }
    }

    // Nameservers
    if (Array.isArray(parsed.nameservers)) {
      for (const ns of parsed.nameservers) {
        if (ns.ldhName) result.nameServers.push(ns.ldhName);
      }
    }

    // Status
    if (Array.isArray(parsed.status)) {
      result.status = parsed.status;
    }
  } catch {
    // Non-fatal if RDAP server times out or domain is unsupported
  }

  return result;
}
