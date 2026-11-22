import { describe, it, expect } from "vitest";
import { maskAadhaarString, isValidAadhaarNumber, getDefaultAadhaarMask } from "./process";

describe("aadhaar-masker process", () => {
  it("masks a 12-digit Aadhaar string correctly", () => {
    expect(maskAadhaarString("234567890123")).toBe("XXXX XXXX 0123");
    expect(maskAadhaarString("2345 6789 0123")).toBe("XXXX XXXX 0123");
    expect(maskAadhaarString("2345-6789-0123")).toBe("XXXX XXXX 0123");
  });

  it("masks Aadhaar numbers embedded in sentences", () => {
    const text = "Mera Aadhaar number 9876 5432 1098 hai verification ke liye.";
    const masked = maskAadhaarString(text);
    expect(masked).toBe("Mera Aadhaar number XXXX XXXX 1098 hai verification ke liye.");
  });

  it("validates 12-digit Aadhaar number rules", () => {
    expect(isValidAadhaarNumber("2345 6789 0123")).toBe(true);
    expect(isValidAadhaarNumber("9999 8888 7777")).toBe(true);
    // Invalid: starts with 0 or 1
    expect(isValidAadhaarNumber("0123 4567 8901")).toBe(false);
    expect(isValidAadhaarNumber("1234 5678 9012")).toBe(false);
    // Invalid length
    expect(isValidAadhaarNumber("12345")).toBe(false);
  });

  it("returns default mask coordinates", () => {
    const mask = getDefaultAadhaarMask();
    expect(mask.x).toBeGreaterThan(0);
    expect(mask.width).toBeGreaterThan(0);
    expect(mask.height).toBeGreaterThan(0);
  });

  it("handles empty or non-numeric input gracefully", () => {
    expect(maskAadhaarString("")).toBe("");
    expect(maskAadhaarString("No numbers here")).toBe("No numbers here");
  });
});
