export interface FindReplaceOptions {
  isRegex?: boolean;
  caseSensitive?: boolean;
  matchWholeWord?: boolean;
}

export interface FindReplaceResult {
  result: string;
  matchCount: number;
  original: string;
}

export function findAndReplace(
  text: string,
  find: string,
  replaceWith: string,
  options: FindReplaceOptions = {}
): FindReplaceResult {
  if (!text) {
    return { result: "", matchCount: 0, original: "" };
  }

  if (!find) {
    return { result: text, matchCount: 0, original: text };
  }

  const isRegex = !!options.isRegex;
  const caseSensitive = !!options.caseSensitive;
  const matchWholeWord = !!options.matchWholeWord;

  let patternStr = find;
  if (!isRegex) {
    // Escape special regex characters in plain text mode
    patternStr = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  if (matchWholeWord) {
    patternStr = `\\b${patternStr}\\b`;
  }

  let flags = "g";
  if (!caseSensitive) flags += "i";

  try {
    const regex = new RegExp(patternStr, flags);
    const matches = text.match(regex);
    const matchCount = matches ? matches.length : 0;
    const result = text.replace(regex, replaceWith);

    return { result, matchCount, original: text };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error ? `Regex Error: ${err.message}` : "Invalid regex pattern"
    );
  }
}

export interface ProcessInput {
  text: string;
  find: string;
  replaceWith: string;
  isRegex?: boolean;
  caseSensitive?: boolean;
  matchWholeWord?: boolean;
}

export async function process(input: ProcessInput): Promise<FindReplaceResult> {
  const raw = input.text;
  if (!raw || !raw.trim()) {
    throw new Error("Input text khali hai");
  }

  return findAndReplace(raw, input.find, input.replaceWith || "", {
    isRegex: input.isRegex,
    caseSensitive: input.caseSensitive,
    matchWholeWord: input.matchWholeWord,
  });
}
