import { describe, it, expect } from "vitest";
import {
  hexToBytes,
  bytesToHex,
  xorBytes,
  executeKeyedXor,
  bruteForceSingleByteXor,
} from "./process";

describe("xor-tool process", () => {
  it("converts hex to bytes and back accurately", () => {
    const hex = "1b373733";
    const bytes = hexToBytes(hex);
    expect(bytes).not.toBeNull();
    expect(bytesToHex(bytes!)).toBe("1b373733");
  });

  it("performs symmetric XOR encryption and decryption with key", () => {
    const text = "SourceLab2026";
    const key = "key123";

    // Encrypt
    const enc = executeKeyedXor(text, key, false, false, true);
    expect(enc.hexOutput).not.toBe(text);

    // Decrypt (using hex output and same key)
    const dec = executeKeyedXor(enc.hexOutput, key, true, false, false);
    expect(dec.textOutput).toBe(text);
  });

  it("handles single-byte XOR correctly", () => {
    const data = new Uint8Array([0x41, 0x42]); // "AB"
    const key = new Uint8Array([0x20]); // case-toggle mask
    const res = xorBytes(data, key);
    expect(res[0]).toBe(0x61); // 'a'
    expect(res[1]).toBe(0x62); // 'b'
  });

  it("brute forces Cryptopals Challenge 3 single-byte XOR cipher successfully", () => {
    // Famous Cryptopals Challenge 3 hex ciphertext:
    const hex = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";
    const candidates = bruteForceSingleByteXor(hex, true);
    expect(candidates.length).toBe(256);

    // Top match should be the decoded English message: "Cooking MC's like a pound of bacon"
    const top = candidates[0];
    expect(top.keyChar).toBe("X"); // Key is 'X' (88 / 0x58)
    expect(top.plaintext).toContain("Cooking MC's like a pound of bacon");
  });

  it("handles invalid hex input gracefully", () => {
    expect(hexToBytes("invalid-hex")).toBeNull();
    expect(hexToBytes("123")).toBeNull(); // odd length
  });
});
