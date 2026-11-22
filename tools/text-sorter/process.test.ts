import { describe, it, expect } from "vitest";
import { sortTextLines } from "./process";

describe("text-sorter process", () => {
  it("sorts lines alphabetically A-Z and Z-A", () => {
    const input = "Banana\nApple\nCherry";
    expect(sortTextLines(input, { order: "az" })).toBe("Apple\nBanana\nCherry");
    expect(sortTextLines(input, { order: "za" })).toBe("Cherry\nBanana\nApple");
  });

  it("handles natural sorting with embedded numbers correctly", () => {
    const input = "file10.txt\nfile2.txt\nfile1.txt";
    expect(sortTextLines(input, { order: "natural" })).toBe("file1.txt\nfile2.txt\nfile10.txt");
  });

  it("sorts by line length ascending and descending", () => {
    const input = "Antigravity\nAI\nSourceLab";
    expect(sortTextLines(input, { order: "length-asc" })).toBe("AI\nSourceLab\nAntigravity");
    expect(sortTextLines(input, { order: "length-desc" })).toBe("Antigravity\nSourceLab\nAI");
  });

  it("deduplicates repeated lines case-insensitively", () => {
    const input = "apple\nBanana\nAPPLE\ncherry\nbanana";
    const res = sortTextLines(input, { order: "az", removeDuplicates: true, caseSensitive: false });
    expect(res).toBe("apple\nBanana\ncherry");
  });

  it("reverses line order and handles whitespace trimming", () => {
    const input = "  first  \n  second  \n  third  ";
    const res = sortTextLines(input, { order: "reverse", trimWhitespace: true });
    expect(res).toBe("third\nsecond\nfirst");
  });
});
