import { describe, it, expect } from "vitest";
import {
  numberToWordsIndian,
  numberToWordsInternational,
  convertNumber,
  process,
} from "./process";

describe("Number to Words Process", () => {
  it("converts numbers to Indian numbering format (Lakhs and Crores)", () => {
    expect(numberToWordsIndian("125000")).toBe(
      "One Lakh Twenty Five Thousand"
    );
    expect(numberToWordsIndian("15000000")).toBe("One Crore Fifty Lakh");
  });

  it("converts numbers to International format (Thousands and Millions)", () => {
    expect(numberToWordsInternational("125000")).toBe(
      "One Hundred and Twenty Five Thousand"
    );
    expect(numberToWordsInternational("15000000")).toBe("Fifteen Million");
  });

  it("handles decimal paise and cents formatting", () => {
    const res = convertNumber("1500.50");
    expect(res.indian).toContain("Fifty Paise");
    expect(res.chequeFormat).toBe(
      "Rupees One Thousand Five Hundred and Fifty Paise Only"
    );
  });

  it("handles zero and negative numbers", () => {
    expect(numberToWordsIndian("0")).toBe("Zero");
    expect(numberToWordsIndian("-500")).toBe("Minus Five Hundred");
  });

  it("process function handles full payload and throws on invalid number", async () => {
    const res = await process({ number: "50000" });
    expect(res.chequeFormat).toBe("Rupees Fifty Thousand Only");

    await expect(process({ number: "abc" })).rejects.toThrow("Valid number enter karo");
  });
});
