import { describe, it, expect } from "vitest";
import { processUrl, extractQueryParams } from "./process";

describe("URL Encoder / Decoder Process", () => {
  it("encodes URI components completely including delimiters", () => {
    const input = "?key=value&name=Rahul Sharma/test";
    const res = processUrl({ text: input, mode: "encode_component" });
    expect(res.result).toBe("%3Fkey%3Dvalue%26name%3DRahul%20Sharma%2Ftest");
    expect(res.stats.mode).toBe("encode_component");
    expect(res.stats.outputLength).toBe(res.result.length);
  });

  it("encodes full URI preserving protocol and query separators", () => {
    const input = "https://sourcelab.app/path with spaces?name=Source Lab&tag=privacy#hash link";
    const res = processUrl({ text: input, mode: "encode_full" });
    expect(res.result).toBe("https://sourcelab.app/path%20with%20spaces?name=Source%20Lab&tag=privacy#hash%20link");
    expect(res.params).toHaveLength(2);
    expect(res.params?.[0]).toEqual({ key: "name", value: "Source Lab" });
  });

  it("decodes percent-encoded UTF-8 and Unicode characters correctly", () => {
    const input = "%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20SourceLab%21";
    const res = processUrl({ text: input, mode: "decode" });
    expect(res.result).toBe("नमस्ते SourceLab!");
  });

  it("extracts query parameters into structured key-value pairs", () => {
    const params = extractQueryParams("https://api.sourcelab.app/v1/search?category=pdf&size=10mb&filter=fast#top");
    expect(params).toEqual([
      { key: "category", value: "pdf" },
      { key: "size", value: "10mb" },
      { key: "filter", value: "fast" },
    ]);
  });

  it("throws friendly Hinglish error on empty input or invalid percent sequences", () => {
    expect(() => processUrl({ text: "" })).toThrow("URL input khali hai");
    expect(() => processUrl({ text: "   " })).toThrow("URL input khali hai");
    expect(() => processUrl({ text: "https://example.com/%E0%A4%ZZ", mode: "decode" })).toThrow(
      "Invalid percent-encoded string mila"
    );
  });
});
