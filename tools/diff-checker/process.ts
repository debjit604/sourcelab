import { diffLines, diffWords, diffChars, createPatch, Change } from "diff";

export type DiffMode = "lines" | "words" | "chars";

export interface DiffOptions {
  mode: DiffMode;
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

export interface DiffResult {
  parts: DiffPart[];
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
  unifiedPatch: string;
  hasDifferences: boolean;
  error?: string;
}

export function computeDiff(
  oldText: string,
  newText: string,
  options: DiffOptions = { mode: "lines" }
): DiffResult {
  if (oldText === "" && newText === "") {
    return {
      parts: [],
      addedCount: 0,
      removedCount: 0,
      unchangedCount: 0,
      unifiedPatch: "",
      hasDifferences: false,
    };
  }

  const diffOpts = {
    ignoreWhitespace: options.ignoreWhitespace ?? false,
    ignoreCase: options.ignoreCase ?? false,
  };

  let rawChanges: Change[] = [];
  switch (options.mode) {
    case "words":
      rawChanges = diffWords(oldText, newText, diffOpts);
      break;
    case "chars":
      rawChanges = diffChars(oldText, newText, diffOpts);
      break;
    case "lines":
    default:
      rawChanges = diffLines(oldText, newText, diffOpts);
      break;
  }

  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;
  let hasDifferences = false;

  const parts: DiffPart[] = rawChanges.map((change) => {
    const isAdded = Boolean(change.added);
    const isRemoved = Boolean(change.removed);

    if (isAdded) {
      addedCount += change.count || 1;
      hasDifferences = true;
    } else if (isRemoved) {
      removedCount += change.count || 1;
      hasDifferences = true;
    } else {
      unchangedCount += change.count || 1;
    }

    return {
      value: change.value,
      added: isAdded,
      removed: isRemoved,
      count: change.count,
    };
  });

  const unifiedPatch = createPatch("file.txt", oldText, newText, "Original", "Modified");

  return {
    parts,
    addedCount,
    removedCount,
    unchangedCount,
    unifiedPatch,
    hasDifferences,
  };
}
