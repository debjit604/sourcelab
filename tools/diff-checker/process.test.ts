import { describe, it, expect } from "vitest";
import { computeDiff } from "./process";

describe("diff-checker/process", () => {
  it("computes line diff accurately", () => {
    const original = "apple\nbanana\ncherry\n";
    const modified = "apple\nblueberry\ncherry\ndate\n";

    const res = computeDiff(original, modified, { mode: "lines" });
    expect(res.hasDifferences).toBe(true);
    expect(res.addedCount).toBeGreaterThan(0);
    expect(res.removedCount).toBeGreaterThan(0);
    expect(res.unifiedPatch).toContain("+blueberry");
    expect(res.unifiedPatch).toContain("-banana");
  });

  it("computes word diff accurately", () => {
    const original = "The quick brown fox";
    const modified = "The fast brown fox";

    const res = computeDiff(original, modified, { mode: "words" });
    expect(res.hasDifferences).toBe(true);
    const removedPart = res.parts.find((p) => p.removed);
    const addedPart = res.parts.find((p) => p.added);

    expect(removedPart?.value).toBe("quick");
    expect(addedPart?.value).toBe("fast");
  });

  it("computes char diff accurately", () => {
    const original = "SourceLab";
    const modified = "SourceApp";

    const res = computeDiff(original, modified, { mode: "chars" });
    expect(res.hasDifferences).toBe(true);
    const removedPart = res.parts.find((p) => p.removed);
    const addedPart = res.parts.find((p) => p.added);

    expect(removedPart?.value).toBe("Lab");
    expect(addedPart?.value).toBe("App");
  });

  it("handles ignoreWhitespace option correctly", () => {
    const original = "hello   world";
    const modified = "hello world";

    const withWs = computeDiff(original, modified, { mode: "words", ignoreWhitespace: false });
    expect(withWs.hasDifferences).toBe(true);

    const ignoreWs = computeDiff(original, modified, { mode: "words", ignoreWhitespace: true });
    expect(ignoreWs.hasDifferences).toBe(false);
  });

  it("handles identical and empty inputs gracefully", () => {
    const identical = computeDiff("same text", "same text", { mode: "lines" });
    expect(identical.hasDifferences).toBe(false);
    expect(identical.addedCount).toBe(0);
    expect(identical.removedCount).toBe(0);

    const empty = computeDiff("", "", { mode: "lines" });
    expect(empty.hasDifferences).toBe(false);
    expect(empty.parts.length).toBe(0);
  });
});
