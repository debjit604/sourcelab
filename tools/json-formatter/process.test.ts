import { describe, it, expect } from "vitest";
import { processJson } from "./process";

describe("JSON Formatter Process", () => {
  it("beautifies standard JSON with 2-space indentation", () => {
    const raw = '{"name":"SourceLab","private":true}';
    const output = processJson({ text: raw, mode: "beautify_2" });
    expect(output.result).toBe(
      '{\n  "name": "SourceLab",\n  "private": true\n}'
    );
    expect(output.stats.type).toBe("object");
  });

  it("minifies formatted JSON", () => {
    const raw = '{\n  "key": "value",\n  "count": 42\n}';
    const output = processJson({ text: raw, mode: "minify" });
    expect(output.result).toBe('{"key":"value","count":42}');
    expect(output.stats.savedBytes).toBeGreaterThan(0);
  });

  it("sorts keys alphabetically when requested", () => {
    const raw = '{"z": 1, "a": 2, "m": {"y": 10, "b": 20}}';
    const output = processJson({ text: raw, mode: "minify", sortKeys: true });
    expect(output.result).toBe('{"a":2,"m":{"b":20,"y":10},"z":1}');
  });

  it("throws Hinglish error on empty input", () => {
    expect(() => processJson({ text: "" })).toThrow("JSON khali hai");
    expect(() => processJson({ text: "   " })).toThrow("JSON khali hai");
  });

  it("returns line and column information for syntax errors", () => {
    const broken = '{\n  "name": "Debjit",\n  "invalid": ,\n}';
    expect(() => processJson({ text: broken })).toThrow(/Line 3/);
  });
});
