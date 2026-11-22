import { describe, it, expect } from "vitest";
import {
  calculateCvss,
  parseVectorString,
  roundUp,
  process,
} from "./process";

describe("CVSS v3.1 Calculator", () => {
  it("calculates Log4Shell (CVE-2021-44228) as 10.0 Critical", () => {
    const metrics = parseVectorString("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H");
    expect(metrics).not.toBeNull();
    const result = calculateCvss(metrics!);
    expect(result.score).toBe(10.0);
    expect(result.severity).toBe("Critical");
    expect(result.vectorString).toBe("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H");
  });

  it("calculates Stored XSS as 5.4 Medium with Scope Changed", () => {
    const metrics = parseVectorString("CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N");
    expect(metrics).not.toBeNull();
    const result = calculateCvss(metrics!);
    expect(result.score).toBe(5.4);
    expect(result.severity).toBe("Medium");
  });

  it("calculates standard SQL Injection as 9.8 Critical with Scope Unchanged", () => {
    const metrics = parseVectorString("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H");
    expect(metrics).not.toBeNull();
    const result = calculateCvss(metrics!);
    expect(result.score).toBe(9.8);
    expect(result.severity).toBe("Critical");
  });

  it("calculates zero impact vulnerability as 0.0 None", () => {
    const metrics = parseVectorString("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N");
    expect(metrics).not.toBeNull();
    const result = calculateCvss(metrics!);
    expect(result.score).toBe(0.0);
    expect(result.severity).toBe("None");
  });

  it("handles FIRST CVSS v3.1 RoundUp edge cases correctly", () => {
    expect(roundUp(4.0)).toBe(4.0);
    expect(roundUp(4.01)).toBe(4.1);
    expect(roundUp(4.0001)).toBe(4.1);
  });

  it("process function handles default and custom vector strings", async () => {
    const defaultRes = await process({});
    expect(defaultRes.score).toBe(9.8);

    const customRes = await process({ vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N" });
    expect(customRes.score).toBe(5.4);

    await expect(process({ vector: "invalid-vector" })).rejects.toThrow("Invalid CVSS v3.1 vector string");
  });
});
