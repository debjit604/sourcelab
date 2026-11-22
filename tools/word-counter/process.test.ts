import { describe, it, expect } from "vitest";
import { processWordCounter, computeKeywordDensity } from "./process";

describe("Word Counter Process", () => {
  it("counts words, characters, sentences and paragraphs accurately", () => {
    const text =
      "SourceLab ek badhiya tool hai. Tumhari file tumhare browser me hi rehti hai!\n\nKoi server nahi hai.";
    const res = processWordCounter({ text });

    expect(res.stats.words).toBe(17);
    expect(res.stats.characters).toBe(text.length);
    expect(res.stats.charactersNoSpaces).toBe(text.replace(/\s/g, "").length);
    expect(res.stats.paragraphs).toBe(2);
    expect(res.stats.sentences).toBe(3);
  });

  it("calculates reading time and speaking time estimates", () => {
    const words200 = new Array(200).fill("shabd").join(" ");
    const res = processWordCounter({ text: words200 });

    expect(res.stats.readingTime).toBe("1 min");
    expect(res.stats.speakingTime).toContain("min");
  });

  it("computes keyword frequency and density percentages", () => {
    const words = ["privacy", "privacy", "tool", "browser", "privacy", "tool"];
    const density = computeKeywordDensity(words);

    expect(density[0].word).toBe("privacy");
    expect(density[0].count).toBe(3);
    expect(density[0].percentage).toBe("50.0%");

    expect(density[1].word).toBe("tool");
    expect(density[1].count).toBe(2);
  });

  it("handles Hindi / Unicode words correctly", () => {
    const text = "नमस्ते भारत! यह एक सुरक्षित ब्राउज़र टूल है।";
    const res = processWordCounter({ text });

    expect(res.stats.words).toBe(8);
    expect(res.stats.charactersNoSpaces).toBeGreaterThan(0);
  });

  it("throws friendly Hinglish error on empty or whitespace input", () => {
    expect(() => processWordCounter({ text: "" })).toThrow("Text input khali hai");
    expect(() => processWordCounter({ text: "   \n\t  " })).toThrow("Text input khali hai");
  });
});
