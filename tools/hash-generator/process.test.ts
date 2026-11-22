import { describe, it, expect } from "vitest";
import { processHash } from "./process";

describe("Hash Generator Process", () => {
  it("generates correct hashes for standard text input (known vectors)", async () => {
    const res = await processHash({ text: "hello world" });

    expect(res.md5).toBe("5eb63bbbe01eeed093cb22bb8f5acdc3");
    expect(res.sha1).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
    expect(res.sha256).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    expect(res.list).toHaveLength(5);
    expect(res.inputBytes).toBe(11);
  });

  it("handles uppercase formatting option correctly", async () => {
    const res = await processHash({ text: "hello world", uppercase: true });

    expect(res.md5).toBe("5EB63BBBE01EEED093CB22BB8F5ACDC3");
    expect(res.sha256).toBe("B94D27B9934D3E08A52E52D7DA7DABFAC484EFE37A5380EE9088F7ACE2EFCDE9");
  });

  it("processes binary ArrayBuffer data correctly", async () => {
    const encoder = new TextEncoder();
    const buffer = encoder.encode("hello world").buffer;
    const res = await processHash({ buffer });

    expect(res.md5).toBe("5eb63bbbe01eeed093cb22bb8f5acdc3");
    expect(res.sha256).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    expect(res.inputBytes).toBe(11);
  });

  it("correctly hashes multi-byte UTF-8 Unicode characters", async () => {
    const res = await processHash({ text: "नमस्ते" });
    expect(res.inputBytes).toBe(18); // 6 devanagari code units * 3 bytes
    expect(res.md5).toBeDefined();
    expect(res.sha256).toHaveLength(64);
  });

  it("throws friendly Hinglish error on empty input", async () => {
    await expect(processHash({ text: "" })).rejects.toThrow("Text input khali hai");
    await expect(processHash({ text: "   " })).rejects.toThrow("Text input khali hai");
    await expect(processHash({})).rejects.toThrow("Kuch text enter karo ya file drop karo");
  });
});
