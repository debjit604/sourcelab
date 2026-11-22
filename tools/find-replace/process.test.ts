import { describe, it, expect } from "vitest";
import { findAndReplace, process } from "./process";

describe("Find and Replace Process", () => {
  it("replaces simple plain text matches globally", () => {
    const input = "The quick brown fox jumps over the lazy dog";
    const res = findAndReplace(input, "the", "a", { caseSensitive: false });
    expect(res.result).toBe("a quick brown fox jumps over a lazy dog");
    expect(res.matchCount).toBe(2);
  });

  it("respects case sensitivity toggle", () => {
    const input = "Apple apple APPLE";
    const res = findAndReplace(input, "apple", "orange", { caseSensitive: true });
    expect(res.result).toBe("Apple orange APPLE");
    expect(res.matchCount).toBe(1);
  });

  it("matches whole words only when enabled", () => {
    const input = "cat concatenate catch scatter cat";
    const res = findAndReplace(input, "cat", "dog", { matchWholeWord: true });
    expect(res.result).toBe("dog concatenate catch scatter dog");
    expect(res.matchCount).toBe(2);
  });

  it("supports regular expressions with capture groups", () => {
    const input = "User: Alice, User: Bob, User: Charlie";
    const res = findAndReplace(input, "User: (\\w+)", "Member: $1", { isRegex: true });
    expect(res.result).toBe("Member: Alice, Member: Bob, Member: Charlie");
    expect(res.matchCount).toBe(3);
  });

  it("throws descriptive error on invalid regex pattern", () => {
    expect(() =>
      findAndReplace("test", "[a-z", "x", { isRegex: true })
    ).toThrow(/Regex Error/);
  });

  it("process function handles full payload", async () => {
    const res = await process({
      text: "hello world",
      find: "world",
      replaceWith: "SourceLab",
    });
    expect(res.result).toBe("hello SourceLab");
    expect(res.matchCount).toBe(1);
  });
});
