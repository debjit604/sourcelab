import { describe, it, expect } from "vitest";
import { processEmi, formatInr } from "./process";

describe("EMI Calculator Process", () => {
  it("calculates standard loan EMI and total interest accurately", () => {
    // ₹10,00,000 at 8.5% for 5 years (60 months)
    const res = processEmi({
      principal: 1000000,
      annualRate: 8.5,
      tenureYears: 5,
    });

    expect(res.monthlyEmi).toBe(20517);
    expect(res.totalInterest).toBe(230992);
    expect(res.totalPayment).toBe(1230992);
    expect(res.schedule).toHaveLength(5);
    expect(res.schedule[4].balance).toBe(0);
  });

  it("handles zero percent interest rate (0% EMI)", () => {
    const res = processEmi({
      principal: 120000,
      annualRate: 0,
      tenureYears: 1,
    });

    expect(res.monthlyEmi).toBe(10000);
    expect(res.totalInterest).toBe(0);
    expect(res.totalPayment).toBe(120000);
    expect(res.principalRatio).toBe(100);
  });

  it("generates complete 20-year home loan amortization schedule", () => {
    const res = processEmi({
      principal: 5000000,
      annualRate: 9,
      tenureYears: 20,
    });

    expect(res.schedule).toHaveLength(20);
    expect(res.schedule[19].balance).toBe(0);
    expect(res.tenureMonths).toBe(240);
  });

  it("formats currency in Indian Rupees format", () => {
    const formatted = formatInr(1250000);
    expect(formatted).toContain("12,50,000");
  });

  it("throws friendly Hinglish error on invalid loan parameters", () => {
    expect(() => processEmi({ principal: 0, annualRate: 10, tenureYears: 5 })).toThrow(
      "Loan amount (Principal) 0 se zyada hona chahiye"
    );
    expect(() => processEmi({ principal: 100000, annualRate: -5, tenureYears: 5 })).toThrow(
      "Interest rate 0% se 100% ke beech"
    );
    expect(() => processEmi({ principal: 100000, annualRate: 10, tenureYears: 0 })).toThrow(
      "Loan tenure 1 se 40 saal ke beech"
    );
  });
});
