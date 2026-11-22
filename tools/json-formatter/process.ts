export type FormatMode = "beautify_2" | "beautify_4" | "minify";

export interface JsonProcessInput {
  text: string;
  mode?: FormatMode;
  sortKeys?: boolean;
}

export interface JsonProcessOutput {
  result: string;
  stats: {
    originalSize: number;
    resultSize: number;
    savedBytes: number;
    type: "object" | "array" | "primitive";
    lineCount: number;
  };
}

/**
 * Extracts line and column from JSON error or calculates from position/snippet
 */
function getErrorLineAndColumn(
  raw: string,
  error: Error
): { line: number; column: number; snippet: string } {
  let line = 1;
  let column = 1;
  let snippet = "";

  // Strategy 1: Check for explicit "at position X"
  const posMatch = error.message.match(/at position (\d+)/i);
  if (posMatch && posMatch[1]) {
    const position = parseInt(posMatch[1], 10);
    const textBefore = raw.slice(0, position);
    const lines = textBefore.split("\n");
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
    const allLines = raw.split("\n");
    snippet = (allLines[line - 1] || "").trim().slice(0, 80);
    return { line, column, snippet };
  }

  // Strategy 2: Check for explicit "line X column Y"
  const lineColMatch = error.message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
    const allLines = raw.split("\n");
    snippet = (allLines[line - 1] || "").trim().slice(0, 80);
    return { line, column, snippet };
  }

  // Strategy 3: Modern V8 snippet extraction (e.g. `..."invalid": ,\n}` is not valid JSON)
  const snippetMatch = error.message.match(/\.\.\.(.+?)(?:\s+is not valid JSON|\n|$)/);
  if (snippetMatch && snippetMatch[1]) {
    // Strip trailing braces or whitespace if any
    const rawSnippet = snippetMatch[1].replace(/[\n}]+$/, "").trim();
    const idx = raw.indexOf(rawSnippet);
    if (idx !== -1) {
      const textBefore = raw.slice(0, idx);
      const lines = textBefore.split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
      const allLines = raw.split("\n");
      snippet = (allLines[line - 1] || "").trim().slice(0, 80);
      return { line, column, snippet };
    }
  }

  // Fallback: character-by-character validation to locate the exact error line
  const lines = raw.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const tokenMatch = error.message.match(/Unexpected token '([^']+)'/);
    if (tokenMatch && tokenMatch[1] && lines[i].includes(tokenMatch[1])) {
      line = i + 1;
      column = lines[i].indexOf(tokenMatch[1]) + 1;
      snippet = lines[i].trim().slice(0, 80);
      return { line, column, snippet };
    }
  }

  const allLines = raw.split("\n");
  snippet = (allLines[0] || "").trim().slice(0, 80);
  return { line, column, snippet };
}

function deepSortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(deepSortKeys);
  }
  if (value !== null && typeof value === "object") {
    const sortedObj: Record<string, unknown> = {};
    const keys = Object.keys(value as Record<string, unknown>).sort();
    for (const key of keys) {
      sortedObj[key] = deepSortKeys((value as Record<string, unknown>)[key]);
    }
    return sortedObj;
  }
  return value;
}

export function processJson(input: JsonProcessInput): JsonProcessOutput {
  const raw = input.text ?? "";
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error("JSON khali hai. Kripya pehle text ya file daalein.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    const { line, column, snippet } = getErrorLineAndColumn(raw, error);
    const details = snippet ? ` near "${snippet}"` : "";
    throw new Error(
      `Invalid JSON mila (Line ${line}, Column ${column}): ${error.message}${details}. Kripya syntax check karein.`
    );
  }

  if (input.sortKeys) {
    parsed = deepSortKeys(parsed);
  }

  let result = "";
  const mode = input.mode || "beautify_2";

  if (mode === "minify") {
    result = JSON.stringify(parsed);
  } else if (mode === "beautify_4") {
    result = JSON.stringify(parsed, null, 4);
  } else {
    result = JSON.stringify(parsed, null, 2);
  }

  const originalSize = new TextEncoder().encode(raw).length;
  const resultSize = new TextEncoder().encode(result).length;
  const savedBytes = originalSize - resultSize;

  let type: "object" | "array" | "primitive" = "primitive";
  if (Array.isArray(parsed)) {
    type = "array";
  } else if (parsed !== null && typeof parsed === "object") {
    type = "object";
  }

  return {
    result,
    stats: {
      originalSize,
      resultSize,
      savedBytes,
      type,
      lineCount: result.split("\n").length,
    },
  };
}
