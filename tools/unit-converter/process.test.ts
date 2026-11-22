import { describe, it, expect } from "vitest";
import { convertUnits, process } from "./process";

describe("Unit Converter Process", () => {
  it("converts length units accurately (1 meter to cm, km, ft)", () => {
    const res = convertUnits(1, "m", "cm", "length");
    expect(res.convertedValue).toBe(100);

    const kmRes = convertUnits(1000, "m", "km", "length");
    expect(kmRes.convertedValue).toBe(1);

    const ftRes = convertUnits(1, "m", "ft", "length");
    expect(ftRes.convertedValue).toBeCloseTo(3.28084, 2);
  });

  it("converts weight units accurately (1 kg to g and lb)", () => {
    const gRes = convertUnits(1, "kg", "g", "weight");
    expect(gRes.convertedValue).toBe(1000);

    const lbRes = convertUnits(1, "kg", "lb", "weight");
    expect(lbRes.convertedValue).toBeCloseTo(2.20462, 2);
  });

  it("converts temperature accurately between Celsius, Fahrenheit and Kelvin", () => {
    const fRes = convertUnits(100, "C", "F", "temperature");
    expect(fRes.convertedValue).toBe(212);

    const kRes = convertUnits(0, "C", "K", "temperature");
    expect(kRes.convertedValue).toBe(273.15);
  });

  it("converts digital storage units on base 1024", () => {
    const mbRes = convertUnits(1024, "KB", "MB", "digital");
    expect(mbRes.convertedValue).toBe(1);

    const gbRes = convertUnits(1048576, "KB", "GB", "digital");
    expect(gbRes.convertedValue).toBe(1);
  });

  it("throws error for invalid units or categories", () => {
    expect(() =>
      convertUnits(10, "invalid", "m", "length")
    ).toThrow("Invalid unit selection");
  });

  it("process function dispatches accurately", async () => {
    const res = await process({
      value: 5,
      fromUnit: "km",
      toUnit: "m",
      category: "length",
    });
    expect(res.convertedValue).toBe(5000);
  });
});
