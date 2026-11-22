import { describe, it, expect } from "vitest";
import { encodeHtmlEntities, decodeHtmlEntities } from "./process";

describe("html-entity process", () => {
  it("encodes standard characters to named entities", () => {
    const raw = '<div class="alert">Source & Lab</div>';
    const encoded = encodeHtmlEntities(raw, "named");
    expect(encoded).toBe('&lt;div class=&quot;alert&quot;&gt;Source &amp; Lab&lt;/div&gt;');
  });

  it("encodes text to decimal and hex entities", () => {
    const raw = "A&B";
    const dec = encodeHtmlEntities(raw, "decimal");
    expect(dec).toBe("&#65;&#38;&#66;");
    const hex = encodeHtmlEntities(raw, "hex");
    expect(hex).toBe("&#x41;&#x26;&#x42;");
  });

  it("decodes named entities correctly", () => {
    const input = "&lt;h1&gt;Copyright &copy; 2026&lt;/h1&gt;";
    const decoded = decodeHtmlEntities(input);
    expect(decoded).toBe("<h1>Copyright © 2026</h1>");
  });

  it("decodes decimal and hex entities properly", () => {
    const decInput = "&#60;hello&#62; &#169;";
    expect(decodeHtmlEntities(decInput)).toBe("<hello> ©");
    const hexInput = "&#x3C;world&#x3E; &#xA9;";
    expect(decodeHtmlEntities(hexInput)).toBe("<world> ©");
  });

  it("handles empty strings and preserves unmapped characters", () => {
    expect(encodeHtmlEntities("")).toBe("");
    expect(decodeHtmlEntities("")).toBe("");
    expect(decodeHtmlEntities("Plain normal text")).toBe("Plain normal text");
  });
});
