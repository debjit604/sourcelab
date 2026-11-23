/**
 * SSRF IP Defense & Normalization Guard
 * Blocks private, loopback, link-local, multicast, reserved, and cloud metadata IPs.
 */

export interface IpValidationResult {
  forbidden: boolean;
  reason?: string;
  normalizedIp?: string;
}

// Convert numeric IPv4 to 32-bit unsigned integer
function ipv4ToLong(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;

  let acc = 0;
  for (let i = 0; i < 4; i++) {
    const raw = parts[i];
    let val: number;
    // Octal or Hex or Decimal
    if (raw.startsWith("0x") || raw.startsWith("0X")) {
      val = parseInt(raw, 16);
    } else if (raw.startsWith("0") && raw.length > 1 && /^[0-7]+$/.test(raw)) {
      val = parseInt(raw, 8);
    } else if (/^\d+$/.test(raw)) {
      val = parseInt(raw, 10);
    } else {
      return null;
    }
    if (isNaN(val) || val < 0 || val > 255) return null;
    acc = (acc << 8) | val;
  }
  return acc >>> 0;
}

// Normalizes decimal, octal, hex representations of IPv4
export function normalizeIp(raw: string): string | null {
  let cleaned = raw.trim().toLowerCase();
  if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
    cleaned = cleaned.slice(1, -1);
  }

  // Handle pure 32-bit integer decimal IP (e.g. 2130706433 = 127.0.0.1)
  if (/^\d+$/.test(cleaned)) {
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) {
      return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ].join(".");
    }
  }

  // Handle pure 32-bit hex integer (e.g. 0x7f000001)
  if (/^0x[0-9a-f]+$/i.test(cleaned)) {
    const num = parseInt(cleaned, 16);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) {
      return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ].join(".");
    }
  }

  // IPv4-mapped IPv6 (::ffff:127.0.0.1 or ::ffff:7f00:0001)
  if (cleaned.startsWith("::ffff:")) {
    const rest = cleaned.slice(7);
    if (rest.includes(".")) {
      return normalizeIp(rest);
    }
    const hexParts = rest.split(":");
    if (hexParts.length === 2) {
      const p1 = parseInt(hexParts[0], 16);
      const p2 = parseInt(hexParts[1], 16);
      if (!isNaN(p1) && !isNaN(p2)) {
        return [(p1 >> 8) & 255, p1 & 255, (p2 >> 8) & 255, p2 & 255].join(".");
      }
    }
  }

  // Dotted notation (might contain octal or hex components: 0177.0.0.1, 0x7f.0.0.1)
  if (cleaned.includes(".")) {
    const long = ipv4ToLong(cleaned);
    if (long !== null) {
      return [
        (long >>> 24) & 255,
        (long >>> 16) & 255,
        (long >>> 8) & 255,
        long & 255,
      ].join(".");
    }
  }

  return cleaned;
}

export function isForbiddenIp(rawIp: string): IpValidationResult {
  const norm = normalizeIp(rawIp);
  if (!norm) {
    return { forbidden: true, reason: "Malformed or unrecognized IP format" };
  }

  // 1. IPv4 checks
  const ipv4Long = ipv4ToLong(norm);
  if (ipv4Long !== null) {
    // 0.0.0.0/8 (Current network)
    if (((ipv4Long & 0xff000000) >>> 0) === 0x00000000) {
      return { forbidden: true, reason: "0.0.0.0/8 current network is forbidden", normalizedIp: norm };
    }
    // 127.0.0.0/8 (Loopback)
    if (((ipv4Long & 0xff000000) >>> 0) === 0x7f000000) {
      return { forbidden: true, reason: "127.0.0.0/8 loopback is forbidden", normalizedIp: norm };
    }
    // 10.0.0.0/8 (Private RFC 1918)
    if (((ipv4Long & 0xff000000) >>> 0) === 0x0a000000) {
      return { forbidden: true, reason: "10.0.0.0/8 private network is forbidden", normalizedIp: norm };
    }
    // 100.64.0.0/10 (Carrier-Grade NAT)
    if (((ipv4Long & 0xffc00000) >>> 0) === 0x64400000) {
      return { forbidden: true, reason: "100.64.0.0/10 CGNAT is forbidden", normalizedIp: norm };
    }
    // 169.254.0.0/16 (Link-local & Cloud Metadata 169.254.169.254)
    if (((ipv4Long & 0xffff0000) >>> 0) === 0xa9fe0000) {
      return { forbidden: true, reason: "169.254.0.0/16 link-local/cloud metadata is forbidden", normalizedIp: norm };
    }
    // 172.16.0.0/12 (Private RFC 1918)
    if (((ipv4Long & 0xfff00000) >>> 0) === 0xac100000) {
      return { forbidden: true, reason: "172.16.0.0/12 private network is forbidden", normalizedIp: norm };
    }
    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (((ipv4Long & 0xffffff00) >>> 0) === 0xc0000000) {
      return { forbidden: true, reason: "192.0.0.0/24 IETF reserved is forbidden", normalizedIp: norm };
    }
    // 192.0.2.0/24 (TEST-NET-1)
    if (((ipv4Long & 0xffffff00) >>> 0) === 0xc0000200) {
      return { forbidden: true, reason: "192.0.2.0/24 TEST-NET is forbidden", normalizedIp: norm };
    }
    // 192.168.0.0/16 (Private RFC 1918)
    if (((ipv4Long & 0xffff0000) >>> 0) === 0xc0a80000) {
      return { forbidden: true, reason: "192.168.0.0/16 private network is forbidden", normalizedIp: norm };
    }
    // 198.51.100.0/24 (TEST-NET-2)
    if (((ipv4Long & 0xffffff00) >>> 0) === 0xc6336400) {
      return { forbidden: true, reason: "198.51.100.0/24 TEST-NET is forbidden", normalizedIp: norm };
    }
    // 203.0.113.0/24 (TEST-NET-3)
    if (((ipv4Long & 0xffffff00) >>> 0) === 0xcb007100) {
      return { forbidden: true, reason: "203.0.113.0/24 TEST-NET is forbidden", normalizedIp: norm };
    }
    // 224.0.0.0/4 (Multicast)
    if (((ipv4Long & 0xf0000000) >>> 0) === 0xe0000000) {
      return { forbidden: true, reason: "224.0.0.0/4 multicast is forbidden", normalizedIp: norm };
    }
    // 240.0.0.0/4 (Reserved / Future use)
    if (((ipv4Long & 0xf0000000) >>> 0) === 0xf0000000) {
      return { forbidden: true, reason: "240.0.0.0/4 reserved range is forbidden", normalizedIp: norm };
    }
    // 255.255.255.255 (Broadcast)
    if (ipv4Long === 0xffffffff) {
      return { forbidden: true, reason: "Broadcast address is forbidden", normalizedIp: norm };
    }

    return { forbidden: false, normalizedIp: norm };
  }

  // 2. IPv6 checks
  const low6 = norm.toLowerCase();
  if (low6 === "::" || low6 === "0:0:0:0:0:0:0:0") {
    return { forbidden: true, reason: "IPv6 unspecified address :: is forbidden", normalizedIp: norm };
  }
  if (low6 === "::1" || low6 === "0:0:0:0:0:0:0:1") {
    return { forbidden: true, reason: "IPv6 loopback ::1 is forbidden", normalizedIp: norm };
  }
  // Link-local: fe80::/10
  if (low6.startsWith("fe8") || low6.startsWith("fe9") || low6.startsWith("fea") || low6.startsWith("feb")) {
    return { forbidden: true, reason: "IPv6 link-local fe80::/10 is forbidden", normalizedIp: norm };
  }
  // Unique local: fc00::/7 (fc00... or fd00...)
  if (low6.startsWith("fc") || low6.startsWith("fd")) {
    return { forbidden: true, reason: "IPv6 unique local fc00::/7 is forbidden", normalizedIp: norm };
  }
  // Multicast: ff00::/8
  if (low6.startsWith("ff")) {
    return { forbidden: true, reason: "IPv6 multicast ff00::/8 is forbidden", normalizedIp: norm };
  }
  // Documentation: 2001:db8::/32
  if (low6.startsWith("2001:db8:") || low6.startsWith("2001:0db8:")) {
    return { forbidden: true, reason: "IPv6 documentation 2001:db8::/32 is forbidden", normalizedIp: norm };
  }

  return { forbidden: false, normalizedIp: norm };
}
