import { describe, it, expect } from "vitest";
import { scanSource } from "./scanner";
import { calculateShannonEntropy, maskSecret } from "./entropy";

describe("Shared Secret & Endpoint Analyzer Engine", () => {
  it("calculates Shannon entropy correctly", () => {
    expect(calculateShannonEntropy("aaaa")).toBe(0);
    // Random high entropy hex
    expect(calculateShannonEntropy("a8f3b9c2e1d4")).toBeGreaterThan(3.0);
  });

  it("masks sensitive secret strings safely", () => {
    const raw = "AKIA" + "1122334455667788";
    const masked = maskSecret(raw);
    expect(masked.startsWith("AKIA")).toBe(true);
    expect(masked.endsWith("88")).toBe(true);
    expect(masked).toContain("****");
  });

  it("detects AWS Access Key ID assembled at runtime", () => {
    // Standard AWS key is 20 chars: 4 prefix + 16 chars
    const dummyAws = ["AKIA", "IOSFODNN7", "EXAMPLE"].join("");
    const source = `const aws_key = "${dummyAws}";`;
    const res = scanSource(source);
    expect(res.findings.length).toBe(1);
    expect(res.findings[0].ruleId).toBe("aws-access-key-id");
    expect(res.findings[0].severity).toBe("critical");
  });

  it("detects GitHub tokens and Stripe live keys assembled at runtime", () => {
    const dummyGh = ["ghp_", "11223344556677889900aabbccddeeff1122"].join("");
    const dummyStripe = ["sk_live_", "51AbCdEfGhIjKlMnOpQrStUvWxYz12"].join("");
    const source = `
      export const GH_AUTH = "${dummyGh}";
      const STRIPE = "${dummyStripe}";
    `;
    const res = scanSource(source);
    expect(res.findings.some((f) => f.ruleId === "github-personal-token")).toBe(true);
    expect(res.findings.some((f) => f.ruleId === "stripe-live-key")).toBe(true);
  });

  it("extracts LinkFinder style API endpoints and parameters", () => {
    const source = `
      fetch('/api/v1/users?role=admin&active=true');
      const authUrl = "https://auth.company.internal/oauth/token";
      const bucket = "https://company-assets.s3.amazonaws.com/logo.png";
    `;
    const res = scanSource(source);
    expect(res.endpoints.some((e) => e.url === "/api/v1/users?role=admin&active=true")).toBe(true);
    expect(res.endpoints.some((e) => e.url === "https://auth.company.internal/oauth/token")).toBe(true);
    expect(res.parameters.some((p) => p.name === "role")).toBe(true);
    expect(res.buckets.some((b) => b.name === "company-assets")).toBe(true);
  });

  it("detects exposed source maps and sensitive comments", () => {
    const sm = ["//#", " sourceMappingURL=bundle.js.map"].join("");
    const source = `
      // TODO: Remove test credentials before deployment
      console.log('App started');
      ${sm}
    `;
    const res = scanSource(source);
    expect(res.sourceMaps.length).toBe(1);
    expect(res.sourceMaps[0]).toBe("bundle.js.map");
    expect(res.comments.length).toBe(1);
    expect(res.comments[0].text).toContain("TODO");
  });
});
