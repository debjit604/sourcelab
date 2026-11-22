import Papa from "papaparse";

export interface CsvToJsonOptions {
  header?: boolean;
  delimiter?: string;
  dynamicTyping?: boolean;
  skipEmptyLines?: boolean;
}

export interface JsonToCsvOptions {
  delimiter?: string;
  quotes?: boolean;
}

export interface CsvConvertResult {
  output: string;
  rowCount: number;
  colCount: number;
  error?: string;
}

export function convertCsvToJson(
  csvText: string,
  options: CsvToJsonOptions = {}
): CsvConvertResult {
  if (!csvText || !csvText.trim()) {
    return { output: "", rowCount: 0, colCount: 0 };
  }

  try {
    const parsed = Papa.parse(csvText, {
      header: options.header ?? true,
      delimiter: options.delimiter || "",
      dynamicTyping: options.dynamicTyping ?? true,
      skipEmptyLines: options.skipEmptyLines ?? true,
    });

    if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
      return {
        output: "",
        rowCount: 0,
        colCount: 0,
        error: `CSV parse karne me error: ${parsed.errors[0].message}`,
      };
    }

    const jsonStr = JSON.stringify(parsed.data, null, 2);
    const cols = parsed.meta.fields ? parsed.meta.fields.length : 0;

    return {
      output: jsonStr,
      rowCount: parsed.data.length,
      colCount: cols,
    };
  } catch (err: unknown) {
    return {
      output: "",
      rowCount: 0,
      colCount: 0,
      error: err instanceof Error ? err.message : "CSV parse nahi ho paya.",
    };
  }
}

export function convertJsonToCsv(
  jsonText: string,
  options: JsonToCsvOptions = {}
): CsvConvertResult {
  if (!jsonText || !jsonText.trim()) {
    return { output: "", rowCount: 0, colCount: 0 };
  }

  try {
    const parsedJson = JSON.parse(jsonText);

    if (!Array.isArray(parsedJson)) {
      return {
        output: "",
        rowCount: 0,
        colCount: 0,
        error: "JSON ek array hona chahiye (e.g. [ { \"name\": \"...\" } ]).",
      };
    }

    if (parsedJson.length === 0) {
      return { output: "", rowCount: 0, colCount: 0 };
    }

    const csvOutput = Papa.unparse(parsedJson, {
      delimiter: options.delimiter || ",",
      quotes: options.quotes ?? false,
      newline: "\n",
    });

    const firstItem = parsedJson[0];
    const colCount = typeof firstItem === "object" && firstItem !== null ? Object.keys(firstItem).length : 1;

    return {
      output: csvOutput,
      rowCount: parsedJson.length,
      colCount,
    };
  } catch (err: unknown) {
    return {
      output: "",
      rowCount: 0,
      colCount: 0,
      error: err instanceof Error ? `Invalid JSON: ${err.message}` : "JSON parse nahi ho paya.",
    };
  }
}
