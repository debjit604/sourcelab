/**
 * Calculates Shannon entropy of a string (bits per symbol)
 */
export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const len = str.length;
  const freqs: Record<string, number> = {};

  for (let i = 0; i < len; i++) {
    const char = str[i];
    freqs[char] = (freqs[char] || 0) + 1;
  }

  let entropy = 0;
  for (const count of Object.values(freqs)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  return Math.round(entropy * 100) / 100;
}

/**
 * Masks a secret string showing only the first 4 and last 2 characters
 */
export function maskSecret(secret: string): string {
  if (!secret) return "";
  const len = secret.length;
  if (len <= 6) return "*".repeat(len);

  const prefix = secret.slice(0, 4);
  const suffix = secret.slice(-2);
  const stars = "*".repeat(Math.min(len - 6, 20));

  return `${prefix}${stars}${suffix}`;
}
