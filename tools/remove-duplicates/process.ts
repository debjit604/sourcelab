export interface DeduplicateOptions {
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
  sort?: "none" | "asc" | "desc";
}

export interface DeduplicateResult {
  result: string;
  uniqueCount: number;
  duplicateCount: number;
  totalCount: number;
  lines: string[];
}

export function deduplicateLines(
  text: string,
  options: DeduplicateOptions = {}
): DeduplicateResult {
  if (!text) {
    return {
      result: "",
      uniqueCount: 0,
      duplicateCount: 0,
      totalCount: 0,
      lines: [],
    };
  }

  const caseSensitive = !!options.caseSensitive;
  const trimWhitespace = options.trimWhitespace !== false;
  const removeEmptyLines = options.removeEmptyLines !== false;
  const sort = options.sort || "none";

  const rawLines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const uniqueLines: string[] = [];
  let duplicateCount = 0;
  let totalValidLines = 0;

  for (const rawLine of rawLines) {
    const line = trimWhitespace ? rawLine.trim() : rawLine;

    if (removeEmptyLines && !line) {
      continue;
    }

    totalValidLines++;
    const key = caseSensitive ? line : line.toLowerCase();

    if (seen.has(key)) {
      duplicateCount++;
    } else {
      seen.add(key);
      uniqueLines.push(line);
    }
  }

  if (sort === "asc") {
    uniqueLines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  } else if (sort === "desc") {
    uniqueLines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }));
  }

  return {
    result: uniqueLines.join("\n"),
    uniqueCount: uniqueLines.length,
    duplicateCount,
    totalCount: totalValidLines,
    lines: uniqueLines,
  };
}

export interface ProcessInput {
  text: string;
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
  sort?: "none" | "asc" | "desc";
}

export async function process(input: ProcessInput): Promise<DeduplicateResult> {
  const raw = input.text;
  if (!raw || !raw.trim()) {
    throw new Error("Input text khali hai");
  }

  return deduplicateLines(raw, {
    caseSensitive: input.caseSensitive,
    trimWhitespace: input.trimWhitespace,
    removeEmptyLines: input.removeEmptyLines,
    sort: input.sort,
  });
}
