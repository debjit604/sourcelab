export type SortOrder =
  | "az"
  | "za"
  | "natural"
  | "length-asc"
  | "length-desc"
  | "numeric"
  | "reverse";

export interface SortOptions {
  order: SortOrder;
  removeDuplicates?: boolean;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
  caseSensitive?: boolean;
}

export function sortTextLines(text: string, options: SortOptions): string {
  if (!text) return "";

  let lines = text.split("\n");

  if (options.trimWhitespace) {
    lines = lines.map((l) => l.trim());
  }

  if (options.removeEmptyLines) {
    lines = lines.filter((l) => l.length > 0);
  }

  if (options.removeDuplicates) {
    if (options.caseSensitive) {
      lines = Array.from(new Set(lines));
    } else {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const lower = l.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });
    }
  }

  switch (options.order) {
    case "az":
      lines.sort((a, b) =>
        options.caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase())
      );
      break;
    case "za":
      lines.sort((a, b) =>
        options.caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase())
      );
      break;
    case "natural":
      lines.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: options.caseSensitive ? "variant" : "base" })
      );
      break;
    case "length-asc":
      lines.sort((a, b) => a.length - b.length || a.localeCompare(b));
      break;
    case "length-desc":
      lines.sort((a, b) => b.length - a.length || a.localeCompare(b));
      break;
    case "numeric":
      lines.sort((a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA - numB;
      });
      break;
    case "reverse":
      lines.reverse();
      break;
  }

  return lines.join("\n");
}
