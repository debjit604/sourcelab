import { describe, it, expect } from "vitest";
import {
  tryBase64,
  tryHex,
  tryUrl,
  tryBinary,
  tryRot13,
  autoMagicDecode,
} from "./process";

describe("magic-decoder process", () => {
  it("decodes single layer Base64", () => {
    // "U291cmNlTGFi" -> "SourceLab"
    const res = tryBase64("U291cmNlTGFi");
    expect(res).toBe("SourceLab");
    expect(tryUrl("Hello%20World")).toBe("Hello World");
  });

  it("decodes hexadecimal string to text", () => {
    // 536f757263654c6162 -> "SourceLab"
    const res = tryHex("536f757263654c6162");
    expect(res).toBe("SourceLab");
  });

  it("decodes 8-bit binary string", () => {
    // 'S' (83) = 01010011, 'L' (76) = 01001100
    const bin = "01010011 01001100";
    expect(tryBinary(bin)).toBe("SL");
  });

  it("performs ROT13 substitution cipher", () => {
    expect(tryRot13("Hello")).toBe("Uryyb");
    expect(tryRot13("Uryyb")).toBe("Hello");
  });

  it("recursively unwraps multi-layer nested encodings (Hex in Base64 in URL)", () => {
    // "SourceLab" -> Hex "536f757263654c6162" -> Base64 "NTM2Zjc1NzI2MzY1NGM2MTYy"
    const nested = "NTM2Zjc1NzI2MzY1NGM2MTYy";
    const res = autoMagicDecode(nested);
    expect(res.isDecoded).toBe(true);
    expect(res.layers.length).toBeGreaterThanOrEqual(2);
    expect(res.decoded).toBe("SourceLab");
  });
});
