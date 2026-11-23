import { describe, it, expect } from "vitest";
import {
  generateMarkdownReport,
  getScreenshotApiUrl,
  getFileApiUrl,
  getZipApiUrl,
  SnapshotManifest,
} from "./process";

describe("Website Snapshot Process Module", () => {
  const mockManifest: SnapshotManifest = {
    jobId: "test-job-123",
    targetUrl: "https://example.com",
    timestamp: "2026-11-23T12:00:00Z",
    pagesVisited: ["https://example.com"],
    filesCount: 12,
    files: [
      {
        id: "f1",
        filename: "index.html",
        folder: "html",
        size: 1024,
        url: "https://example.com",
      },
    ],
    screenshots: {
      hasDesktop: true,
      hasMobile: true,
    },
    seo: {
      score: 85,
      title: "Example Domain",
      description: "Example domain website",
      viewport: true,
      https: true,
    },
    emailSecurity: {
      spf: { present: true, raw: "v=spf1 -all", status: "Strict" },
      dmarc: { present: true, raw: "v=DMARC1; p=reject", status: "Strict Reject" },
    },
    ssl: {
      valid: true,
      subject: "example.com",
      issuer: "DigiCert",
      validTo: "2027-01-01",
      daysRemaining: 400,
    },
    hiddenPaths: [
      {
        path: "/robots.txt",
        status: 200,
        exposed: true,
        category: "Informational",
      },
    ],
    jsAnalysis: {
      findings: [
        {
          ruleId: "slack-webhook",
          ruleName: "Slack Webhook URL",
          severity: "high",
          maskedSnippet: "https://hooks.slack.com/services/...",
          line: 42,
        },
      ],
      endpoints: ["/api/v1/users"],
      parameters: ["token", "id"],
    },
  };

  it("generates formatted Markdown report with all sections", () => {
    const report = generateMarkdownReport(mockManifest);
    expect(report).toContain("# SourceLab Recon Audit Report: https://example.com");
    expect(report).toContain("**Job ID:** `test-job-123`");
    expect(report).toContain("SEO & Core Web Vitals Audit (Score: 85/100)");
    expect(report).toContain("SPF:** Strict");
    expect(report).toContain("SSL/TLS Certificate");
    expect(report).toContain("Exposed Sensitive Paths (1 discovered)");
    expect(report).toContain("`/robots.txt`");
    expect(report).toContain("JavaScript Security Findings (1)");
    expect(report).toContain("Slack Webhook URL");
  });

  it("constructs correct API endpoint URLs", () => {
    const base = "https://recon.sourcelab.io";
    const desktopUrl = getScreenshotApiUrl("job-abc", "desktop", base);
    expect(desktopUrl).toBe("https://recon.sourcelab.io/snapshot/job-abc/screenshot?view=desktop");

    const mobileUrl = getScreenshotApiUrl("job-abc", "mobile", base);
    expect(mobileUrl).toBe("https://recon.sourcelab.io/snapshot/job-abc/screenshot?view=mobile");

    const fileUrl = getFileApiUrl("job-abc", "file-xyz", base);
    expect(fileUrl).toBe("https://recon.sourcelab.io/snapshot/job-abc/file/file-xyz");

    const zipUrl = getZipApiUrl("job-abc", base);
    expect(zipUrl).toBe("https://recon.sourcelab.io/snapshot/job-abc/zip");
  });

  it("handles minimal manifest without optional blocks", () => {
    const minimal: SnapshotManifest = {
      jobId: "min-1",
      targetUrl: "https://min.example.com",
      timestamp: "2026-11-23T00:00:00Z",
      pagesVisited: ["https://min.example.com"],
      filesCount: 0,
      files: [],
      screenshots: { hasDesktop: false, hasMobile: false },
    };
    const report = generateMarkdownReport(minimal);
    expect(report).toContain("SourceLab Recon Audit Report: https://min.example.com");
    expect(report).not.toContain("SEO & Core Web Vitals");
    expect(report).not.toContain("SSL/TLS Certificate");
  });

  it("returns default fallback base URL", () => {
    expect(getScreenshotApiUrl("job-1")).toContain("/snapshot/job-1/screenshot");
  });
});
