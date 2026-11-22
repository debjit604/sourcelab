import { describe, it, expect } from "vitest";
import {
  textToBinary,
  binaryToText,
  calculateBitStats,
  process,
} from "./process";

describe("Text to Binary Converter Process", () => {
  it("converts standard ASCII text to binary with various delimiters", () => {
    expect(textToBinary("Hi")).toBe("01001000 01101001");
    expect(textToBinary("Hi", "none")).toBe("0100100001101001");
    expect(textToBinary("Hi", "comma")).toBe("01001000, 01101001");
    expect(textToBinary("Hi", "hyphen")).toBe("01001000-01101001");
    expect(textToBinary("Hi", "space", "0b")).toBe("0b01001000 0b01101001");
  });

  it("decodes binary strings back to plain text", () => {
    expect(binaryToText("01001000 01101001")).toBe("Hi");
    expect(binaryToText("0100100001101001")).toBe("Hi");
    expect(binaryToText("0b01001000, 0b01101001")).toBe("Hi");
  });

  it("handles multi-byte UTF-8 characters seamlessly", () => {
    const text = "SourceLab 🚀";
    const bin = textToBinary(text);
    expect(binaryToText(bin)).toBe(text);
  });

  it("calculates accurate bit statistics", () => {
    // "Hi" = 01001000 01101001 (16 bits, 6 ones, 10 zeros)
    const stats = calculateBitStats("01001000 01101001");
    expect(stats.totalBits).toBe(16);
    expect(stats.onesCount).toBe(6);
    expect(stats.zerosCount).toBe(10);
    expect(stats.byteCount).toBe(2);
  });

  it("process function handles encode, decode, and throws on invalid input", async () => {
    const encodeRes = await process({
      text: "Code",
      mode: "text-to-binary",
    });
    expect(encodeRes.result).toBe("01000011 01101111 01100100 01100101");
    expect(encodeRes.hex).toBe("43 6f 64 65");

    const decodeRes = await process({
      text: "01000011 01101111 01100100 01100101",
      mode: "binary-to-text",
    });
    expect(decodeRes.result).toBe("Code");

    await expect(
      process({ text: "0102100", mode: "binary-to-text" })
    ).rejects.toThrow();

    await expect(
      process({ text: "", mode: "text-to-binary" })
    ).rejects.toThrow("Input text khali hai");
  });
});
