import { describe, it, expect } from "vitest";
import { testRegex } from "./process";

describe("regex-tester process", () => {
  it("matches multiple occurrences with global flag 'g'", () => {
    const text = "apple 123 banana 456 cherry 789";
    const res = testRegex("\\d+", "g", text);
    expect(res.error).toBeNull();
    expect(res.totalMatches).toBe(3);
    expect(res.matches[0].match).toBe("123");
    expect(res.matches[1].match).toBe("456");
    expect(res.matches[2].match).toBe("789");
  });

  it("extracts capture groups accurately", () => {
    const text = "user@example.com";
    const res = testRegex("(\\w+)@(\\w+\\.\\w+)", "", text);
    expect(res.error).toBeNull();
    expect(res.totalMatches).toBe(1);
    expect(res.matches[0].groups).toEqual(["user", "example.com"]);
  });

  it("respects case insensitive flag 'i'", () => {
    const text = "SourceLab sourcelab SOURCELAB";
    const res = testRegex("sourcelab", "gi", text);
    expect(res.totalMatches).toBe(3);
  });

  it("returns syntax error on malformed regex pattern", () => {
    const res = testRegex("([a-z", "", "hello");
    expect(res.error).not.toBeNull();
    expect(res.totalMatches).toBe(0);
  });

  it("handles zero matches and empty strings safely", () => {
    const res = testRegex("zebra", "g", "hello world");
    expect(res.totalMatches).toBe(0);
    expect(res.matches).toEqual([]);
    const empty = testRegex("", "g", "hello world");
    expect(empty.matches).toEqual([]);
  });
});
