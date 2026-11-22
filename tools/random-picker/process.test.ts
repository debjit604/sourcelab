import { describe, it, expect } from "vitest";
import {
  secureRandomInt,
  pickRandomItems,
  shuffleList,
  flipCoin,
  rollDice,
  process,
} from "./process";

describe("Random Picker Process", () => {
  it("generates integers strictly in range using Web Crypto CSPRNG", () => {
    for (let i = 0; i < 50; i++) {
      const val = secureRandomInt(1, 6);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(6);
    }
  });

  it("picks N random items without replacement", () => {
    const items = ["A", "B", "C", "D", "E"];
    const picked = pickRandomItems(items, 3, false);
    expect(picked.length).toBe(3);
    const unique = new Set(picked);
    expect(unique.size).toBe(3);
    picked.forEach((item) => expect(items).toContain(item));
  });

  it("shuffles list preserving all elements", () => {
    const items = ["One", "Two", "Three", "Four", "Five"];
    const shuffled = shuffleList(items);
    expect(shuffled.length).toBe(items.length);
    expect(shuffled.sort()).toEqual([...items].sort());
  });

  it("flips a coin returning Heads or Tails", () => {
    const res = flipCoin();
    expect(["Heads", "Tails"]).toContain(res);
  });

  it("rolls dice with valid face ranges", () => {
    const rolls = rollDice(20, 3);
    expect(rolls.length).toBe(3);
    rolls.forEach((r) => {
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(20);
    });
  });

  it("process function dispatches all modes and throws on empty list", async () => {
    const res = await process({ mode: "pick", items: ["Rahul", "Priya", "Amit"] });
    expect(res.result.length).toBe(1);

    await expect(process({ mode: "pick", items: [] })).rejects.toThrow("List me kam se kam ek item hona chahiye");
  });
});
