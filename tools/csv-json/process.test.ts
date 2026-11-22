import { describe, it, expect } from "vitest";
import { convertCsvToJson, convertJsonToCsv } from "./process";

describe("csv-json/process", () => {
  it("converts CSV to JSON with headers and types accurately", () => {
    const csv = `id,name,active,score\n1,Alice,true,95.5\n2,Bob,false,88`;
    const res = convertCsvToJson(csv, { header: true, dynamicTyping: true });

    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(2);
    expect(res.colCount).toBe(4);

    const parsed = JSON.parse(res.output);
    expect(parsed[0].id).toBe(1);
    expect(parsed[0].name).toBe("Alice");
    expect(parsed[0].active).toBe(true);
    expect(parsed[0].score).toBe(95.5);
  });

  it("converts JSON array to CSV accurately", () => {
    const json = JSON.stringify([
      { id: 101, city: "Mumbai", tier: 1 },
      { id: 102, city: "Bengaluru", tier: 1 },
    ]);

    const res = convertJsonToCsv(json);
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(2);
    expect(res.output).toContain("id,city,tier");
    expect(res.output).toContain("101,Mumbai,1");
    expect(res.output).toContain("102,Bengaluru,1");
  });

  it("handles custom delimiters like semicolons (;)", () => {
    const csvSemi = "item;price;qty\nPen;10;5\nBook;150;2";
    const resJson = convertCsvToJson(csvSemi, { delimiter: ";" });
    expect(resJson.rowCount).toBe(2);

    const json = JSON.stringify([{ a: 1, b: 2 }]);
    const resCsv = convertJsonToCsv(json, { delimiter: ";" });
    expect(resCsv.output).toBe("a;b\n1;2");
  });

  it("handles empty and whitespace input gracefully", () => {
    expect(convertCsvToJson("")).toEqual({ output: "", rowCount: 0, colCount: 0 });
    expect(convertCsvToJson("   ")).toEqual({ output: "", rowCount: 0, colCount: 0 });
    expect(convertJsonToCsv("")).toEqual({ output: "", rowCount: 0, colCount: 0 });
  });

  it("returns descriptive Hinglish errors on invalid non-array JSON", () => {
    const objectJson = JSON.stringify({ key: "value" });
    const res = convertJsonToCsv(objectJson);
    expect(res.error).toBe("JSON ek array hona chahiye (e.g. [ { \"name\": \"...\" } ]).");

    const malformed = convertJsonToCsv("{ not valid json }");
    expect(res.error).toBeDefined();
    expect(malformed.error).toContain("Invalid JSON");
  });
});
