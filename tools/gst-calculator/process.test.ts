import { describe, it, expect } from "vitest";
import { calculateGst } from "./process";

describe("gst-calculator/process", () => {
  it("calculates Exclusive GST accurately (18% on ₹10,000)", () => {
    const res = calculateGst({ amount: 10000, rate: 18, type: "exclusive" });
    expect(res.error).toBeUndefined();
    expect(res.netAmount).toBe(10000);
    expect(res.gstAmount).toBe(1800);
    expect(res.grossAmount).toBe(11800);
    expect(res.cgst).toBe(900);
    expect(res.sgst).toBe(900);
    expect(res.igst).toBe(1800);
  });

  it("calculates Inclusive GST accurately (extracting 18% from ₹11,800)", () => {
    const res = calculateGst({ amount: 11800, rate: 18, type: "inclusive" });
    expect(res.error).toBeUndefined();
    expect(res.netAmount).toBe(10000);
    expect(res.gstAmount).toBe(1800);
    expect(res.grossAmount).toBe(11800);
    expect(res.cgst).toBe(900);
    expect(res.sgst).toBe(900);
  });

  it("handles 0% GST rate accurately", () => {
    const res = calculateGst({ amount: 5000, rate: 0, type: "exclusive" });
    expect(res.netAmount).toBe(5000);
    expect(res.gstAmount).toBe(0);
    expect(res.grossAmount).toBe(5000);
    expect(res.cgst).toBe(0);
    expect(res.sgst).toBe(0);
  });

  it("calculates standard Indian tax slabs (5%, 12%, 28%)", () => {
    // 5% slab
    const res5 = calculateGst({ amount: 1000, rate: 5, type: "exclusive" });
    expect(res5.gstAmount).toBe(50);
    expect(res5.grossAmount).toBe(1050);

    // 12% slab
    const res12 = calculateGst({ amount: 1000, rate: 12, type: "exclusive" });
    expect(res12.gstAmount).toBe(120);

    // 28% slab
    const res28 = calculateGst({ amount: 1000, rate: 28, type: "exclusive" });
    expect(res28.gstAmount).toBe(280);
    expect(res28.grossAmount).toBe(1280);
  });

  it("validates input amounts and tax rates with descriptive Hinglish errors", () => {
    const negativeAmount = calculateGst({ amount: -100, rate: 18, type: "exclusive" });
    expect(negativeAmount.error).toBe("Amount zero ya positive hona chahiye.");

    const invalidRate = calculateGst({ amount: 1000, rate: 105, type: "exclusive" });
    expect(invalidRate.error).toBe("GST rate 0% se 100% ke beech honi chahiye.");

    const nanCheck = calculateGst({ amount: NaN, rate: 18, type: "exclusive" });
    expect(nanCheck.error).toBe("Kripya valid numbers enter karo.");
  });
});
