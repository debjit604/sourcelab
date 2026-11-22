import { describe, it, expect } from "vitest";
import { parseRawHeaders, analyzeHeaders, process } from "./process";

describe("HTTP Header Analyzer Process", () => {
  it("parses raw HTTP header strings accurately", () => {
    const raw = `
      HTTP/1.1 200 OK
      Content-Type: text/html; charset=UTF-8
      Strict-Transport-Security: max-age=31536000; includeSubDomains
      X-Frame-Options: DENY
    `;
    const headers = parseRawHeaders(raw);
    expect(headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(headers["strict-transport-security"]).toContain("max-age=31536000");
    expect(headers["x-frame-options"]).toBe("DENY");
  });

  it("grades strong security headers as A or A+", () => {
    const raw = `
      Content-Security-Policy: default-src 'self'; object-src 'none';
      Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
      X-Frame-Options: DENY
      X-Content-Type-Options: nosniff
      Referrer-Policy: strict-origin-when-cross-origin
    `;
    const res = analyzeHeaders(raw);
    expect(res.grade).toBe("A+");
    expect(res.score).toBeGreaterThanOrEqual(95);
  });

  it("flags missing headers and info leaks (Server, X-Powered-By)", () => {
    const raw = `
      Server: Apache/2.4.41 (Ubuntu)
      X-Powered-By: PHP/7.4.3
    `;
    const res = analyzeHeaders(raw);
    expect(res.grade).toBe("F");
    expect(res.infoLeaks.length).toBe(2);
    expect(res.checks.some((c) => c.status === "fail")).toBe(true);
  });

  it("process function dispatches correctly and throws on empty input", async () => {
    const res = await process({
      headers: "Strict-Transport-Security: max-age=31536000\nX-Frame-Options: SAMEORIGIN",
    });
    expect(res.totalParsedHeaders).toBe(2);

    await expect(process({ headers: "" })).rejects.toThrow("HTTP response headers paste karo");
  });
});
