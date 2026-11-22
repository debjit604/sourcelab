import { describe, it, expect } from "vitest";
import { identifyHash } from "./process";

describe("hash-identifier process", () => {
  it("identifies standard 32-char hex as MD5 and NTLM", () => {
    // MD5 of "test"
    const res = identifyHash("098f6bcd4621d373cade4e832627b4f6");
    expect(res.length).toBe(32);
    expect(res.charset).toContain("Hexadecimal");
    expect(res.matches.some((m) => m.name === "MD5")).toBe(true);
    expect(res.matches.some((m) => m.name === "NTLM")).toBe(true);
  });

  it("identifies 64-char hex as SHA-256", () => {
    const sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const res = identifyHash(sha256);
    expect(res.length).toBe(64);
    expect(res.matches[0].name).toBe("SHA-256");
    expect(res.matches[0].hashcat).toBe("-m 1400");
  });

  it("identifies bcrypt password hashes with high confidence", () => {
    const bcrypt = "$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW";
    const res = identifyHash(bcrypt);
    expect(res.matches.some((m) => m.name === "bcrypt")).toBe(true);
    expect(res.matches[0].confidence).toBe("High");
    expect(res.matches[0].hashcat).toBe("-m 3200");
  });

  it("identifies SHA-512-Crypt format correctly", () => {
    const sha512crypt = "$6$salt$qF35Mz5e/...";
    const res = identifyHash(sha512crypt);
    expect(res.matches.some((m) => m.name === "SHA-512-Crypt")).toBe(true);
    expect(res.matches[0].hashcat).toBe("-m 1800");
  });

  it("handles empty and unknown length strings safely", () => {
    const empty = identifyHash("");
    expect(empty.matches).toHaveLength(0);

    const unknown = identifyHash("abcdef123");
    expect(unknown.length).toBe(9);
    expect(unknown.matches).toHaveLength(0);
  });
});
