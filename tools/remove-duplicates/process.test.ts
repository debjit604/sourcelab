import { describe, it, expect } from "vitest";
import { deduplicateLines, process } from "./process";

describe("Remove Duplicates Process", () => {
  it("removes duplicate lines preserving original order", () => {
    const input = "apple\nbanana\napple\norange\nbanana";
    const res = deduplicateLines(input);
    expect(res.result).toBe("apple\nbanana\norange");
    expect(res.uniqueCount).toBe(3);
    expect(res.duplicateCount).toBe(2);
  });

  it("handles case-sensitive deduplication", () => {
    const input = "SourceLab\nsourcelab\nSOURCELAB";
    const caseInsensitive = deduplicateLines(input, { caseSensitive: false });
    expect(caseInsensitive.uniqueCount).toBe(1);

    const caseSensitive = deduplicateLines(input, { caseSensitive: true });
    expect(caseSensitive.uniqueCount).toBe(3);
  });

  it("trims whitespace from lines before comparison", () => {
    const input = "  apple  \napple\n  banana";
    const res = deduplicateLines(input, { trimWhitespace: true });
    expect(res.result).toBe("apple\nbanana");
    expect(res.uniqueCount).toBe(2);
  });

  it("sorts lines alphabetically in ascending or descending order", () => {
    const input = "cherry\nbanana\napple";
    const asc = deduplicateLines(input, { sort: "asc" });
    expect(asc.result).toBe("apple\nbanana\ncherry");

    const desc = deduplicateLines(input, { sort: "desc" });
    expect(desc.result).toBe("cherry\nbanana\napple");
  });

  it("process function handles full payload and throws on empty input", async () => {
    const res = await process({ text: "one\ntwo\none" });
    expect(res.uniqueCount).toBe(2);
    expect(res.duplicateCount).toBe(1);

    await expect(process({ text: "" })).rejects.toThrow("Input text khali hai");
  });
});
