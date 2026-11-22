import { describe, it, expect } from "vitest";
import {
  calculateSip,
  formatINR,
  formatCompactINR,
} from "./process";

describe("sip-calculator process", () => {
  it("calculates standard monthly SIP correctly for 10 years at 12%", () => {
    const result = calculateSip({
      monthlyInvestment: 10000,
      expectedReturnRate: 12,
      timePeriodYears: 10,
    });

    // 10,000 * 12 * 10 = 12,00,000
    expect(result.investedAmount).toBe(1200000);
    // Standard annuity due formula yields approx 23,23,391
    expect(result.totalValue).toBeGreaterThan(2300000);
    expect(result.totalValue).toBeLessThan(2350000);
    expect(result.estimatedReturns).toBe(result.totalValue - result.investedAmount);
    expect(result.yearlyBreakdown).toHaveLength(10);
    expect(result.yearlyBreakdown[9].totalValue).toBe(result.totalValue);
  });

  it("handles 0% return rate gracefully without errors", () => {
    const result = calculateSip({
      monthlyInvestment: 5000,
      expectedReturnRate: 0,
      timePeriodYears: 5,
    });

    // 5000 * 12 * 5 = 3,00,000
    expect(result.investedAmount).toBe(300000);
    expect(result.totalValue).toBe(300000);
    expect(result.estimatedReturns).toBe(0);
    expect(result.yearlyBreakdown).toHaveLength(5);
  });

  it("calculates lumpsum one-time investment correctly", () => {
    const result = calculateSip({
      monthlyInvestment: 100000, // used as lumpsum principal
      expectedReturnRate: 10,
      timePeriodYears: 5,
      mode: "lumpsum",
    });

    // 1,00,000 * (1.10)^5 = 1,61,051
    expect(result.investedAmount).toBe(100000);
    expect(result.totalValue).toBe(161051);
    expect(result.estimatedReturns).toBe(61051);
    expect(result.yearlyBreakdown).toHaveLength(5);
    expect(result.yearlyBreakdown[4].totalValue).toBe(161051);
  });

  it("supports annual step-up SIP calculation", () => {
    const withoutStepUp = calculateSip({
      monthlyInvestment: 10000,
      expectedReturnRate: 12,
      timePeriodYears: 5,
      stepUpPercent: 0,
    });

    const withStepUp = calculateSip({
      monthlyInvestment: 10000,
      expectedReturnRate: 12,
      timePeriodYears: 5,
      stepUpPercent: 10,
    });

    expect(withStepUp.investedAmount).toBeGreaterThan(withoutStepUp.investedAmount);
    expect(withStepUp.totalValue).toBeGreaterThan(withoutStepUp.totalValue);
    expect(withStepUp.yearlyBreakdown).toHaveLength(5);
  });

  it("formats Indian rupees correctly in standard and compact modes", () => {
    expect(formatINR(1234567)).toBe("₹12,34,567");
    expect(formatINR(0)).toBe("₹0");
    expect(formatCompactINR(15000000)).toBe("₹1.50 Cr");
    expect(formatCompactINR(250000)).toBe("₹2.50 L");
    expect(formatCompactINR(5000)).toBe("₹5.0 K");
  });
});
