import { describe, it, expect } from "vitest";
import { parseCsp, evaluateCsp, process } from "./process";

describe("CSP Evaluator Process", () => {
  it("parses directives and source values accurately", () => {
    const raw = "default-src 'self'; script-src 'self' https://trusted.cdn; object-src 'none'";
    const dirs = parseCsp(raw);
    expect(dirs.length).toBe(3);
    expect(dirs[0].name).toBe("default-src");
    expect(dirs[1].values).toContain("https://trusted.cdn");
  });

  it("flags unsafe-inline and unsafe-eval in script-src as critical/high", () => {
    const weakCsp = "script-src 'self' 'unsafe-inline' 'unsafe-eval';";
    const res = evaluateCsp(weakCsp);
    expect(res.isEffectiveAgainstXss).toBe(false);
    expect(res.findings.some((f) => f.title.includes("unsafe-inline"))).toBe(true);
    expect(res.findings.some((f) => f.title.includes("unsafe-eval"))).toBe(true);
  });

  it("identifies wildcard sources and missing object-src", () => {
    const wildcardCsp = "default-src *; script-src https:;";
    const res = evaluateCsp(wildcardCsp);
    expect(res.findings.some((f) => f.title.includes("Wildcard"))).toBe(true);
    expect(res.findings.some((f) => f.title.includes("object-src"))).toBe(true);
  });

  it("approves strong strict CSP configurations", () => {
    const strongCsp =
      "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';";
    const res = evaluateCsp(strongCsp);
    expect(res.isEffectiveAgainstXss).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(90);
  });

  it("process function handles full payload", async () => {
    const res = await process({ csp: "default-src 'self';" });
    expect(res.directives.length).toBe(1);
  });
});
