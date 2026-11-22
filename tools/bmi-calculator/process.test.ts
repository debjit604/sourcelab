import { describe, it, expect } from "vitest";
import { calculateBmi, imperialToMetric, process } from "./process";

describe("BMI Calculator Process", () => {
  it("calculates normal BMI for standard weight and height", () => {
    // 65kg at 170cm -> 65 / (1.7^2) = 22.49 -> 22.5
    const res = calculateBmi(65, 170);
    expect(res.bmi).toBe(22.5);
    expect(res.category).toBe("Normal");
    expect(res.asianCategory).toBe("Normal");
    expect(res.color).toBe("#34D399");
  });

  it("differentiates Asian WHO overweight cutoff (23.0 - 24.9)", () => {
    // 70kg at 170cm -> 70 / 2.89 = 24.22 -> 24.2
    const res = calculateBmi(70, 170);
    expect(res.bmi).toBe(24.2);
    expect(res.category).toBe("Normal"); // Standard WHO considers < 25 Normal
    expect(res.asianCategory).toBe("Overweight"); // Asian WHO considers >= 23 Overweight
  });

  it("calculates underweight category for low weight", () => {
    const res = calculateBmi(45, 175);
    expect(res.bmi).toBe(14.7);
    expect(res.asianCategory).toBe("Underweight");
  });

  it("converts imperial units (lbs, ft, in) to metric accurately", () => {
    const { weightKg, heightCm } = imperialToMetric(154, 5, 9); // ~70kg, ~175cm
    expect(weightKg).toBeCloseTo(69.9, 0);
    expect(heightCm).toBeCloseTo(175.3, 0);
  });

  it("throws error for negative or zero weight/height", () => {
    expect(() => calculateBmi(-50, 170)).toThrow("Weight aur height positive number hone chahiye");
    expect(() => calculateBmi(60, 0)).toThrow();
  });

  it("process function dispatches accurately", async () => {
    const res = await process({ weightKg: 75, heightCm: 180 });
    expect(res.bmi).toBe(23.1);
  });
});
