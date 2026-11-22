export interface XorBruteCandidate {
  keyByte: number;
  keyHex: string;
  keyChar: string;
  plaintext: string;
  score: number;
}

export function hexToBytes(hex: string): Uint8Array | null {
  const clean = hex.trim().replace(/^0x/i, "").replace(/[\s-]/g, "");
  if (clean.length === 0 || clean.length % 2 !== 0) return null;
  if (!/^[0-9a-fA-F]+$/.test(clean)) return null;

  const len = clean.length / 2;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function bytesToString(bytes: Uint8Array): string {
  let res = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    // Printable ASCII or space, else dot
    res += b >= 32 && b <= 126 ? String.fromCharCode(b) : "·";
  }
  return res;
}

export function xorBytes(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (key.length === 0) return data;
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
}

export function scoreEnglishText(text: string): number {
  if (!text) return 0;
  const freqs: Record<string, number> = {
    e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3,
    h: 6.1, r: 6.0, d: 4.3, l: 4.0, c: 2.8, u: 2.8, m: 2.4,
    w: 2.4, f: 2.2, g: 2.0, y: 2.0, p: 1.9, b: 1.5, v: 1.0,
    k: 0.8, j: 0.15, x: 0.15, q: 0.1, z: 0.07, " ": 15.0,
  };

  let score = 0;
  const lower = text.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    if (freqs[ch]) {
      score += freqs[ch];
    } else if (ch === "·") {
      score -= 20; // heavy penalty for non-printable characters
    }
  }
  return Math.round(score * 10) / 10;
}

export function bruteForceSingleByteXor(
  input: string,
  isHex: boolean
): XorBruteCandidate[] {
  let bytes: Uint8Array | null = null;
  if (isHex) {
    bytes = hexToBytes(input);
  } else {
    bytes = stringToBytes(input);
  }

  if (!bytes || bytes.length === 0) return [];

  const candidates: XorBruteCandidate[] = [];

  for (let k = 0; k < 256; k++) {
    const keyArray = new Uint8Array([k]);
    const xored = xorBytes(bytes, keyArray);
    const plaintext = bytesToString(xored);
    const score = scoreEnglishText(plaintext);

    const charRep = k >= 32 && k <= 126 ? String.fromCharCode(k) : `0x${k.toString(16).padStart(2, "0")}`;

    candidates.push({
      keyByte: k,
      keyHex: `0x${k.toString(16).padStart(2, "0").toUpperCase()}`,
      keyChar: charRep,
      plaintext,
      score,
    });
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

export function executeKeyedXor(
  input: string,
  key: string,
  isInputHex: boolean,
  isKeyHex: boolean,
  outputAsHex: boolean
): { output: string; hexOutput: string; textOutput: string } {
  let dataBytes: Uint8Array | null = null;
  if (isInputHex) {
    dataBytes = hexToBytes(input);
  } else {
    dataBytes = stringToBytes(input);
  }

  let keyBytes: Uint8Array | null = null;
  if (isKeyHex) {
    keyBytes = hexToBytes(key);
  } else {
    keyBytes = stringToBytes(key);
  }

  if (!dataBytes) dataBytes = new Uint8Array(0);
  if (!keyBytes || keyBytes.length === 0) keyBytes = new Uint8Array([0]);

  const resultBytes = xorBytes(dataBytes, keyBytes);
  const hexOutput = bytesToHex(resultBytes);
  const textOutput = bytesToString(resultBytes);

  return {
    output: outputAsHex ? hexOutput : textOutput,
    hexOutput,
    textOutput,
  };
}
