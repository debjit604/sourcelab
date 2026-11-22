export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexTestResult {
  matches: RegexMatch[];
  error: string | null;
  totalMatches: number;
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  if (!pattern) {
    return { matches: [], error: null, totalMatches: 0 };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err: unknown) {
    return {
      matches: [],
      error: err instanceof Error ? err.message : "Invalid regular expression",
      totalMatches: 0,
    };
  }

  const matches: RegexMatch[] = [];

  if (flags.includes("g")) {
    let m: RegExpExecArray | null;
    let iterations = 0;
    while ((m = regex.exec(text)) !== null && iterations < 1000) {
      iterations++;
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
      });
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
  } else {
    const m = regex.exec(text);
    if (m) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
      });
    }
  }

  return {
    matches,
    error: null,
    totalMatches: matches.length,
  };
}
