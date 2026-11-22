import { describe, it, expect } from "vitest";
import { parseCookieString, analyzeCookies, process } from "./process";

describe("HTTP Cookie Security Analyzer Process", () => {
  it("parses Set-Cookie headers with all security flags", () => {
    const raw = "Set-Cookie: session_id=abc123xyz; Secure; HttpOnly; SameSite=Strict; Path=/; Domain=example.com";
    const cookies = parseCookieString(raw);
    expect(cookies.length).toBe(1);
    expect(cookies[0].name).toBe("session_id");
    expect(cookies[0].secure).toBe(true);
    expect(cookies[0].httpOnly).toBe(true);
    expect(cookies[0].sameSite).toBe("Strict");
    expect(cookies[0].issues.length).toBe(0);
  });

  it("flags missing HttpOnly on sensitive session cookies as critical", () => {
    const raw = "Set-Cookie: auth_token=jwt_token_here; Secure; Path=/";
    const cookies = parseCookieString(raw);
    expect(cookies[0].isSensitive).toBe(true);
    expect(cookies[0].issues.some((i) => i.severity === "critical")).toBe(true);
  });

  it("flags missing Secure flag and calculates accurate security score", () => {
    const raw = "Set-Cookie: preferences=theme_dark; Path=/";
    const res = analyzeCookies(raw);
    expect(res.secureCount).toBe(0);
    expect(res.score).toBeLessThan(100);
  });

  it("process function dispatches correctly and throws on empty input", async () => {
    const res = await process({
      raw: "sid=123; Secure; HttpOnly",
    });
    expect(res.totalCookies).toBe(1);

    await expect(process({ raw: "" })).rejects.toThrow("Set-Cookie headers paste karo");
  });
});
