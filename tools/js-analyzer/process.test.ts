import { describe, it, expect } from "vitest";
import { process, exportToJson, exportToCsv, exportToMarkdown } from "./process";

describe("JS Analyzer Tool Process", () => {
  it("scans JS source and returns findings with masked snippets", async () => {
    const dummyKey = ["AKIA", "IOSFODNN7", "EXAMPLE"].join("");
    const source = `
      const config = {
        key: "${dummyKey}",
        endpoint: "/api/v2/payments"
      };
    `;
    const res = await process({ content: source, filename: "test.js" });
    expect(res.summary.findings.length).toBe(1);
    expect(res.summary.findings[0].ruleId).toBe("aws-access-key-id");
    expect(res.summary.endpoints.length).toBe(1);
  });

  it("exports scan results to JSON, CSV, and Markdown cleanly", async () => {
    const dummyToken = ["ghp_", "11223344556677889900aabbccddeeff1122"].join("");
    const source = `const token = "${dummyToken}";\nfetch("/api/health");`;
    const res = await process({ content: source, filename: "bundle.js" });

    const json = exportToJson(res.summary);
    expect(JSON.parse(json).findings.length).toBeGreaterThanOrEqual(1);

    const csv = exportToCsv(res.summary.findings);
    expect(csv).toContain("github-personal-token");

    const md = exportToMarkdown(res.summary, "bundle.js");
    expect(md).toContain("# Security Analysis Report for `bundle.js`");
    expect(md).toContain("/api/health");
  });

  it("throws error for empty input", async () => {
    await expect(process({ content: "" })).rejects.toThrow(
      "Input JavaScript/Source file khali hai"
    );
  });
});
