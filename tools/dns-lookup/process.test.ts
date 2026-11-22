import { describe, it, expect } from "vitest";
import { cleanDomainInput, parseDohResponse } from "./process";

describe("DNS Lookup DoH Process", () => {
  it("cleans domain input stripping protocols, paths and ports", () => {
    expect(cleanDomainInput("https://example.com/path")).toBe("example.com");
    expect(cleanDomainInput("http://sub.domain.org:8080/")).toBe("sub.domain.org");
    expect(cleanDomainInput("  google.com  ")).toBe("google.com");
  });

  it("parses Cloudflare / Google DoH response accurately", () => {
    const mockDoh = {
      Status: 0,
      Answer: [
        { name: "example.com.", type: 1, TTL: 300, data: "93.184.216.34" },
        { name: "example.com.", type: 28, TTL: 300, data: "2606:2800:220:1:248:1893:25c8:1946" },
        { name: "example.com.", type: 15, TTL: 3600, data: "10 mail.example.com." },
      ],
    };

    const res = parseDohResponse(mockDoh, "example.com", "cloudflare");
    expect(res.records.length).toBe(3);
    expect(res.records[0].type).toBe("A");
    expect(res.records[0].data).toBe("93.184.216.34");
    expect(res.records[1].type).toBe("AAAA");
    expect(res.records[2].type).toBe("MX");
  });

  it("extracts SPF and DMARC policies from TXT answers", () => {
    const mockTxt = {
      Status: 0,
      Answer: [
        { name: "example.com.", type: 16, TTL: 300, data: '"v=spf1 include:_spf.google.com ~all"' },
        { name: "_dmarc.example.com.", type: 16, TTL: 300, data: '"v=DMARC1; p=reject; rua=mailto:dmarc@example.com"' },
      ],
    };

    const res = parseDohResponse(mockTxt, "example.com", "cloudflare");
    expect(res.spf).toBe("v=spf1 include:_spf.google.com ~all");
    expect(res.dmarc).toBe("v=DMARC1; p=reject; rua=mailto:dmarc@example.com");
  });
});
