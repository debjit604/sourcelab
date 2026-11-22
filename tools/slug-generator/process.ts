export interface SlugOptions {
  separator?: "-" | "_" | ".";
  lowercase?: boolean;
  removeStopWords?: boolean;
}

export const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "up", "about", "into", "over", "after",
  "is", "are", "was", "were", "be", "this", "that"
]);

export function generateSlug(text: string, options: SlugOptions = {}): string {
  if (!text || !text.trim()) return "";

  const separator = options.separator || "-";
  const lowercase = options.lowercase !== false;
  const removeStopWords = !!options.removeStopWords;

  // 1. Normalize and strip diacritics/accents (e.g. café -> cafe)
  let cleaned = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (lowercase) {
    cleaned = cleaned.toLowerCase();
  }

  // 2. Tokenize words (replace any non-alphanumeric char with space, preserving chosen separator)
  const validChars =
    separator === "_"
      ? "[^a-zA-Z0-9\\s_]"
      : separator === "."
      ? "[^a-zA-Z0-9\\s.]"
      : "[^a-zA-Z0-9\\s-]";
  let words = cleaned
    .replace(new RegExp(validChars, "g"), " ")
    .trim()
    .split(/\s+/);

  if (removeStopWords) {
    words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    if (words.length === 0) {
      // If all words were stop words, keep original tokens
      words = cleaned.trim().split(/\s+/);
    }
  }

  // 3. Join with chosen separator and collapse multiples
  const joined = words.join(separator);
  const escapedSep = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedSep})+`, "g");

  return joined.replace(regex, separator).replace(new RegExp(`^${escapedSep}+|${escapedSep}+$`, "g"), "");
}

export interface SlugProcessInput {
  text: string;
  separator?: "-" | "_" | ".";
  lowercase?: boolean;
  removeStopWords?: boolean;
}

export interface SlugProcessResult {
  result: string;
  slug: string;
  original: string;
  length: number;
  wordCount: number;
}

export async function process(input: SlugProcessInput): Promise<SlugProcessResult> {
  const raw = input.text.trim();
  if (!raw) {
    throw new Error("Input text khali hai");
  }

  const slug = generateSlug(raw, {
    separator: input.separator,
    lowercase: input.lowercase,
    removeStopWords: input.removeStopWords,
  });

  return {
    result: slug,
    slug,
    original: raw,
    length: slug.length,
    wordCount: raw.split(/\s+/).filter(Boolean).length,
  };
}
