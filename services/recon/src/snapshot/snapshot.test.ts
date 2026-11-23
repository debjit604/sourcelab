import { describe, it, expect } from "vitest";
import { categorizeAsset, sanitizeFilename, extractSourceMapUrl } from "./classifier";
import { runSnapshot } from "./engine";

describe("Snapshot Engine & Asset Classifier (Task 2)", () => {
  describe("categorizeAsset", () => {
    it("categorizes HTML files properly", () => {
      expect(categorizeAsset("https://example.com/index.html").folder).toBe("html");
      expect(categorizeAsset("https://example.com/about", "text/html").folder).toBe("html");
    });

    it("categorizes CSS files properly", () => {
      expect(categorizeAsset("https://example.com/style.css").folder).toBe("css");
    });

    it("categorizes JavaScript and Source Maps properly", () => {
      expect(categorizeAsset("https://example.com/app.js").folder).toBe("js");
      expect(categorizeAsset("https://example.com/bundle.min.js.map").folder).toBe("js");
    });

    it("categorizes Images properly", () => {
      expect(categorizeAsset("https://example.com/logo.png").folder).toBe("images");
      expect(categorizeAsset("https://example.com/vector.svg").folder).toBe("images");
    });

    it("categorizes Fonts properly", () => {
      expect(categorizeAsset("https://example.com/font.woff2").folder).toBe("fonts");
    });

    it("categorizes Docs and Archives properly", () => {
      expect(categorizeAsset("https://example.com/whitepaper.pdf").folder).toBe("docs");
      expect(categorizeAsset("https://example.com/backup.zip").folder).toBe("archives");
    });

    it("falls back to other for unknown types", () => {
      expect(categorizeAsset("https://example.com/binary.dat").folder).toBe("other");
    });
  });

  describe("sanitizeFilename", () => {
    it("strips path traversal patterns", () => {
      expect(sanitizeFilename("../../etc/passwd")).toBe("passwd");
      expect(sanitizeFilename("..\\..\\windows\\system32\\cmd.exe")).toBe("cmd.exe");
    });

    it("strips query params and hashes", () => {
      expect(sanitizeFilename("bundle.js?v=2.1.0&t=498")).toBe("bundle.js");
      expect(sanitizeFilename("style.css#main")).toBe("style.css");
    });
  });

  describe("extractSourceMapUrl", () => {
    it("extracts //# sourceMappingURL comment and resolves relative URL", () => {
      const js = "var x = 1;\n" + ["//#", " sourceMappingURL=app.js.map"].join("");
      const map = extractSourceMapUrl(js, "https://example.com/static/app.js");
      expect(map).toBe("https://example.com/static/app.js.map");
    });

    it("extracts //@ sourceMappingURL comment", () => {
      const js = "console.log('hi');\n" + ["//@", " sourceMappingURL=vendor.map"].join("");
      const map = extractSourceMapUrl(js, "https://example.com/js/vendor.js");
      expect(map).toBe("https://example.com/js/vendor.map");
    });

    it("ignores data: URI source maps", () => {
      const js = "var y = 2;\n" + ["//#", " sourceMappingURL=data:application/json;base64,eyJ2...="].join("");
      const map = extractSourceMapUrl(js, "https://example.com/app.js");
      expect(map).toBeNull();
    });
  });

  describe("runSnapshot SSRF Guard Integration", () => {
    it("blocks snapshot against private IP before running browser", async () => {
      await expect(runSnapshot({ url: "http://127.0.0.1" })).rejects.toThrow(/SSRF Guard Blocked/i);
    });

    it("blocks snapshot against metadata endpoint", async () => {
      await expect(runSnapshot({ url: "http://169.254.169.254" })).rejects.toThrow(/SSRF Guard Blocked/i);
    });
  });
});
