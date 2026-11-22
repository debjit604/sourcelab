export interface RotAllShift {
  shift: number;
  result: string;
  score: number;
}

/**
 * Standard Caesar shift (A-Z, a-z)
 */
export function caesarShift(text: string, shift: number, decrypt = false): string {
  if (!text) return "";
  let effectiveShift = shift % 26;
  if (effectiveShift < 0) effectiveShift += 26;
  if (decrypt) effectiveShift = (26 - effectiveShift) % 26;

  return text.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char >= "A" && char <= "Z";
    const base = isUpper ? 65 : 97;
    const code = char.charCodeAt(0) - base;
    const shifted = (code + effectiveShift) % 26;
    return String.fromCharCode(base + shifted);
  });
}

/**
 * ROT47: Shifts ASCII printable characters from 33 (!) to 126 (~)
 */
export function rot47(text: string): string {
  if (!text) return "";
  return text.replace(/[\x21-\x7e]/g, (c) => {
    return String.fromCharCode(33 + ((c.charCodeAt(0) - 33 + 47) % 94));
  });
}

/**
 * Heuristic English score based on top letter frequencies
 */
export function calculateEnglishScore(text: string): number {
  if (!text) return 0;
  const commonLetters = new Set(["e", "t", "a", "o", "i", "n", "s", "h", "r", "d", "l", "u"]);
  let score = 0;
  const lower = text.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    if (commonLetters.has(ch)) score += 2;
    if (ch === " ") score += 3;
  }
  return score;
}

/**
 * Brute-forces all 25 possible shifts
 */
export function bruteForceAllShifts(ciphertext: string): RotAllShift[] {
  if (!ciphertext) return [];
  const results: RotAllShift[] = [];

  for (let s = 1; s <= 25; s++) {
    const candidate = caesarShift(ciphertext, s, true);
    const score = calculateEnglishScore(candidate);
    results.push({
      shift: s,
      result: candidate,
      score,
    });
  }

  return results;
}
