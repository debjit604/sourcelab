import { describe, it, expect } from "vitest";
import { generateSlug, process } from "./process";

describe("Slug Generator Process", () => {
  it("converts regular headline to clean kebab-case slug", () => {
    expect(generateSlug("How to Build a Privacy First App in 2026?")).toBe(
      "how-to-build-a-privacy-first-app-in-2026"
    );
  });

  it("normalizes foreign accents and diacritics", () => {
    expect(generateSlug("Déjà Vu & Café au Lait!")).toBe("deja-vu-cafe-au-lait");
  });

  it("supports custom separators like underscores and dots", () => {
    expect(generateSlug("SourceLab Privacy Suite", { separator: "_" })).toBe(
      "sourcelab_privacy_suite"
    );
    expect(generateSlug("SourceLab Privacy Suite", { separator: "." })).toBe(
      "sourcelab.privacy.suite"
    );
  });

  it("removes common stop words when requested", () => {
    expect(
      generateSlug("The Complete Guide for Next.js Developers", {
        removeStopWords: true,
      })
    ).toBe("complete-guide-next-js-developers");
  });

  it("process function handles full payload and throws on empty input", async () => {
    const res = await process({ text: "Hello World!" });
    expect(res.slug).toBe("hello-world");
    expect(res.wordCount).toBe(2);

    await expect(process({ text: "" })).rejects.toThrow("Input text khali hai");
  });
});
