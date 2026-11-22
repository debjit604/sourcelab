import { describe, it, expect } from "vitest";
import { calculateCompoundInterest, process } from "./process";

describe("Compound Interest Process", () => {
  it("calculates annual compounding accurately (P=10000, r=10%, t=2)", () => {
    // 10000 * (1 + 0.1)^2 = 12100
    const res = calculateCompoundInterest(10000, 10, 2, 1);
    expect(res.finalAmount).toBe(12100);
    expect(res.totalInterest).toBe(2100);
    expect(res.breakdown.length).toBe(2);
    expect(res.breakdown[0].closingBalance).toBe(11000);
    expect(res.breakdown[1].closingBalance).toBe(12100);
  });

  it("calculates quarterly compounding correctly", () => {
    // 50000 at 8% for 1 year, quarterly: 50000 * (1 + 0.08/4)^4 = 50000 * (1.02)^4 = 54121.6 -> 54122
    const res = calculateCompoundInterest(50000, 8, 1, 4);
    expect(res.finalAmount).toBe(54122);
    expect(res.totalInterest).toBe(4122);
  });

  it("calculates monthly compounding accurately", () => {
    // 100000 at 12% for 1 year, monthly: 100000 * (1 + 0.01)^12 = 112683
    const res = calculateCompoundInterest(100000, 12, 1, 12);
    expect(res.finalAmount).toBe(112683);
    expect(res.totalInterest).toBe(12683);
  });

  it("throws validation error for invalid principal or years", () => {
    expect(() => calculateCompoundInterest(-1000, 10, 5)).toThrow();
    expect(() => calculateCompoundInterest(1000, 10, 0)).toThrow();
  });

  it("process function handles full input payload", async () => {
    const res = await process({ principal: 25000, ratePct: 7, years: 3 });
    expect(res.finalAmount).toBeGreaterThan(25000);
    expect(res.totalInterest).toBeGreaterThan(0);
  });
});
