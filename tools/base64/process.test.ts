import { describe, it, expect } from "vitest";
import { processBase64, encodeBase64, decodeBase64 } from "./process";

describe("Base64 Process", () => {
  it("encodes and decodes standard ASCII string correctly", () => {
    const text = "SourceLab Privacy First";
    const encoded = encodeBase64(text);
    expect(encoded).toBe("U291cmNlTGFiIFByaXZhY3kgRmlyc3Q=");
    expect(decodeBase64(encoded)).toBe(text);
  });

  it("handles multi-byte UTF-8 characters and emojis safely", () => {
    const text = "नमस्ते SourceLab 🚀 Bharat";
    const encoded = encodeBase64(text);
    expect(decodeBase64(encoded)).toBe(text);
  });

  it("encodes to URL-safe format and decodes back", () => {
    const text = "hello?query=true&token=xyz+123==";
    const output = processBase64({ text, mode: "encode", urlSafe: true });
    expect(output.result).not.toContain("+");
    expect(output.result).not.toContain("/");
    expect(decodeBase64(output.result)).toBe(text);
  });

  it("strips data URI prefix automatically during decode", () => {
    const dataUri = "data:text/plain;base64,U291cmNlTGFi";
    const decoded = decodeBase64(dataUri);
    expect(decoded).toBe("SourceLab");
  });

  it("throws clear error on malformed Base64 or empty string", () => {
    expect(() => encodeBase64("")).toThrow("Input khali hai");
    expect(() => decodeBase64("")).toThrow("Base64 input khali hai");
    expect(() => decodeBase64("###NotBase64@@@")).toThrow("Invalid Base64 string");
  });
});
