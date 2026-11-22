import { describe, it, expect } from "vitest";
import { caesarShift, rot47, bruteForceAllShifts } from "./process";

describe("caesar-rot process", () => {
  it("encodes and decodes standard Caesar shift 3 (ROT3)", () => {
    const original = "SourceLab";
    const encoded = caesarShift(original, 3, false);
    expect(encoded).toBe("VrxufhOde");
    const decoded = caesarShift(encoded, 3, true);
    expect(decoded).toBe("SourceLab");
  });

  it("handles ROT13 symmetric encoding", () => {
    const text = "Hello World";
    const rot = caesarShift(text, 13, false);
    expect(rot).toBe("Uryyb Jbeyq");
    expect(caesarShift(rot, 13, false)).toBe("Hello World");
  });

  it("preserves non-alphabet characters, punctuation, and spaces", () => {
    const text = "Secret 123! @#$";
    const encoded = caesarShift(text, 5);
    expect(encoded).toBe("Xjhwjy 123! @#$");
  });

  it("encodes and decodes ROT47 correctly", () => {
    const text = "The Quick Brown Fox";
    const r47 = rot47(text);
    expect(r47).not.toBe(text);
    expect(rot47(r47)).toBe(text);
  });

  it("brute forces all 25 shifts and ranks candidates", () => {
    // "Khoor Zruog" is "Hello World" shifted by 3
    const results = bruteForceAllShifts("Khoor Zruog");
    expect(results).toHaveLength(25);
    const match = results.find((r) => r.shift === 3);
    expect(match?.result).toBe("Hello World");
  });
});
