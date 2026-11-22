import { describe, it, expect } from "vitest";
import { generateLorem } from "./process";

describe("lorem-generator/process", () => {
  it("generates requested number of paragraphs starting with standard Lorem Ipsum", () => {
    const res = generateLorem({ count: 3, unit: "paragraphs", startWithLorem: true });
    expect(res.output).toContain("Lorem ipsum dolor sit amet");
    const paras = res.output.split("\n\n");
    expect(paras.length).toBe(3);
    expect(res.wordCount).toBeGreaterThan(50);
  });

  it("generates exact count in words mode", () => {
    const res20 = generateLorem({ count: 20, unit: "words", startWithLorem: true });
    const words = res20.output.split(" ");
    expect(words.length).toBe(20);
    expect(words[0].toLowerCase()).toBe("lorem");
    expect(words[1].toLowerCase()).toBe("ipsum");
  });

  it("generates sentences mode correctly", () => {
    const res = generateLorem({ count: 5, unit: "sentences", startWithLorem: false });
    expect(res.output.length).toBeGreaterThan(0);
    // Sentences end with periods
    const periods = (res.output.match(/\./g) || []).length;
    expect(periods).toBeGreaterThanOrEqual(4);
  });

  it("wraps in HTML <p> tags when asHtml is true", () => {
    const resHtml = generateLorem({ count: 2, unit: "paragraphs", asHtml: true });
    expect(resHtml.output).toContain("<p>");
    expect(resHtml.output).toContain("</p>");
  });

  it("safely clamps count boundaries between 1 and 100", () => {
    const minClamped = generateLorem({ count: -5 });
    expect(minClamped.output.split("\n\n").length).toBe(1);

    const maxClamped = generateLorem({ count: 500, unit: "paragraphs" });
    expect(maxClamped.output.split("\n\n").length).toBe(100);
  });
});
