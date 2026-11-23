import { describe, it, expect } from "vitest";
import { auditSeo } from "./seo";
import { extractContacts, extractPatterns } from "./extractors";
import { checkEmailSecurity } from "./dns";
import { runPassiveRecon } from "./index";

describe("Passive Recon Module (Task 3)", () => {
  describe("SEO Audit", () => {
    it("extracts title, meta description, and detects missing viewport and headings", () => {
      const sampleHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>SourceLab Test Title</title>
            <meta name="description" content="Test meta description for audit." />
          </head>
          <body>
            <h1>Main Heading</h1>
            <h2>Sub Heading</h2>
            <img src="/logo.png" />
          </body>
        </html>
      `;
      const seo = auditSeo(sampleHtml, "https://example.com");
      expect(seo.title).toBe("SourceLab Test Title");
      expect(seo.description).toBe("Test meta description for audit.");
      expect(seo.h1Count).toBe(1);
      expect(seo.h1Text).toBe("Main Heading");
      expect(seo.h2Count).toBe(1);
      expect(seo.imagesTotal).toBe(1);
      expect(seo.imagesMissingAlt).toBe(1);
      expect(seo.hasViewport).toBe(false);
      expect(seo.warnings.some((w) => w.includes("viewport"))).toBe(true);
    });
  });

  describe("Contact & Pattern Extractors", () => {
    it("extracts emails and phones labeled as unverified", () => {
      const sampleHtml = `
        <div>
          Contact us at support@sourcelab.dev or sales@domain.in.
          Call (555) 123-4567 or +91 98765 43210.
        </div>
      `;
      const contacts = extractContacts(sampleHtml);
      expect(contacts.emails.length).toBeGreaterThanOrEqual(1);
      expect(contacts.emails[0].label).toBe("found in page content (unverified)");
      expect(contacts.phones.length).toBeGreaterThanOrEqual(1);
      expect(contacts.phones[0].label).toBe("found in page content (unverified)");
    });

    it("extracts theme-color and API endpoint patterns", () => {
      const sampleHtml = `
        <head>
          <meta name="theme-color" content="#22D3EE" />
        </head>
        <script>
          fetch('/api/v1/users');
          axios.post('/graphql');
        </script>
      `;
      const patterns = extractPatterns(sampleHtml);
      expect(patterns.colors).toContain("#22d3ee");
      expect(patterns.endpoints).toContain("/api/v1/users");
      expect(patterns.endpoints).toContain("/graphql");
    });
  });

  describe("Email Security Hints (SPF & DMARC)", () => {
    it("detects softfail warning in SPF ~all", async () => {
      const hints = await checkEmailSecurity("example.com", ["v=spf1 include:_spf.google.com ~all"]);
      expect(hints.spf.exists).toBe(true);
      expect(hints.spf.policy).toBe("softfail");
      expect(hints.spf.warnings.some((w) => w.includes("~all"))).toBe(true);
    });

    it("detects hardfail in SPF -all", async () => {
      const hints = await checkEmailSecurity("example.com", ["v=spf1 ip4:192.0.2.1 -all"]);
      expect(hints.spf.policy).toBe("reject");
    });
  });

  describe("runPassiveRecon SSRF Guard Integration", () => {
    it("blocks passive recon against private loopback IP", async () => {
      await expect(runPassiveRecon("http://127.0.0.1")).rejects.toThrow(/SSRF Guard Blocked/i);
    });

    it("blocks passive recon against cloud metadata endpoint", async () => {
      await expect(runPassiveRecon("http://169.254.169.254")).rejects.toThrow(/SSRF Guard Blocked/i);
    });
  });
});
