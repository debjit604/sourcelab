import { describe, it, expect } from "vitest";
import { calculateAge, getZodiacSign } from "./process";

describe("age-calculator process", () => {
  it("calculates exact years, months and days accurately", () => {
    // Born 2000-01-15, tested as of 2026-11-23
    const asOf = new Date(2026, 10, 23); // month is 0-indexed: 10 = Nov
    const res = calculateAge("2000-01-15", asOf);
    expect(res).not.toBeNull();
    expect(res?.years).toBe(26);
    expect(res?.months).toBe(10);
    expect(res?.days).toBe(8);
  });

  it("calculates total days, weeks and hours", () => {
    const asOf = new Date(2026, 0, 11);
    const res = calculateAge("2026-01-01", asOf);
    expect(res?.totalDays).toBe(10);
    expect(res?.totalHours).toBe(240);
  });

  it("calculates next birthday countdown accurately", () => {
    // Born June 1, tested on May 1
    const asOf = new Date(2026, 4, 1); // May 1
    const res = calculateAge("2000-06-01", asOf);
    expect(res?.nextBirthdayDays).toBe(31);
  });

  it("determines correct Zodiac astrological signs", () => {
    expect(getZodiacSign(3, 25)).toBe("Aries"); // March 25
    expect(getZodiacSign(7, 25)).toBe("Leo"); // July 25
    expect(getZodiacSign(11, 23)).toBe("Sagittarius"); // Nov 23
  });

  it("handles future dates and invalid inputs safely", () => {
    const future = calculateAge("2099-01-01");
    expect(future).toBeNull();
    const invalid = calculateAge("not-a-valid-date");
    expect(invalid).toBeNull();
  });
});
