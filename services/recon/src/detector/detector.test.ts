import { describe, it, expect, vi } from "vitest";
import { SENSITIVE_PATHS } from "./config";
import { detectHiddenPaths } from "./detector";
import { SafeFetchResponse } from "../guard/fetch";

describe("Hidden Path & Sensitive File Detector (Task 4)", () => {
  it("contains curated list of between 40 and 60 sensitive paths", () => {
    expect(SENSITIVE_PATHS.length).toBeGreaterThanOrEqual(40);
    expect(SENSITIVE_PATHS.length).toBeLessThanOrEqual(60);
  });

  it("classifies HTTP 200 with text/plain on .env as exposed", async () => {
    const mockFetcher = vi.fn().mockResolvedValue({
      status: 200,
      contentType: "text/plain",
      contentLength: 140,
      body: Buffer.from("KEY=VALUE"),
      headers: {},
      url: "https://example.com/.env",
      statusText: "OK",
      redirects: [],
      pinnedIp: "93.184.216.34",
    } as unknown as SafeFetchResponse);

    const results = await detectHiddenPaths("https://example.com", {
      paths: [{ path: "/.env", category: "env", isSensitive: true, description: "Env file" }],
      fetchFn: mockFetcher,
      delayMs: 0,
    });

    expect(results.length).toBe(1);
    expect(results[0].exposed).toBe(true);
    expect(results[0].status).toBe(200);
    expect(results[0].sizeBytes).toBe(140);
    expect(results[0].isSensitive).toBe(true);
  });

  it("rejects soft-404 SPA fallbacks returning 200 with text/html", async () => {
    const mockFetcher = vi.fn().mockResolvedValue({
      status: 200,
      contentType: "text/html; charset=utf-8",
      contentLength: 12000,
      body: Buffer.from("<!DOCTYPE html><html><body>Page Not Found</body></html>"),
      headers: {},
      url: "https://example.com/.env",
      statusText: "OK",
      redirects: [],
      pinnedIp: "93.184.216.34",
    } as unknown as SafeFetchResponse);

    const results = await detectHiddenPaths("https://example.com", {
      paths: [{ path: "/.env", category: "env", isSensitive: true, description: "Env file" }],
      fetchFn: mockFetcher,
      delayMs: 0,
    });

    expect(results[0].exposed).toBe(false);
    expect(results[0].note).toMatch(/likely SPA or custom 404/i);
  });

  it("blocks hidden path detection against private IP addresses", async () => {
    await expect(detectHiddenPaths("http://127.0.0.1")).rejects.toThrow(/SSRF Guard Blocked/i);
    await expect(detectHiddenPaths("http://169.254.169.254")).rejects.toThrow(/SSRF Guard Blocked/i);
  });
});
