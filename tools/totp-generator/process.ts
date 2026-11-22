export interface TotpOptions {
  timestampMs?: number;
  period?: number;
  digits?: number;
  algorithm?: "SHA-1" | "SHA-256" | "SHA-512";
}

export interface TotpResult {
  token: string;
  secondsRemaining: number;
  nextToken: string;
  period: number;
  digits: number;
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32ToBytes(input: string): Uint8Array | null {
  const clean = input.toUpperCase().replace(/[\s-]/g, "").replace(/=+$/, "");
  if (!clean) return null;

  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) return null; // Invalid character

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

export async function computeHotp(
  keyBytes: Uint8Array,
  counter: number,
  digits = 6,
  algorithm: "SHA-1" | "SHA-256" | "SHA-512" = "SHA-1"
): Promise<string> {
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);
  // Big-endian 64-bit integer
  counterView.setUint32(0, Math.floor(counter / 0x100000000), false);
  counterView.setUint32(4, counter >>> 0, false);

  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    keyBytes as unknown as BufferSource,
    { name: "HMAC", hash: { name: algorithm } },
    false,
    ["sign"]
  );

  const signature = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
  const hashBytes = new Uint8Array(signature);

  // Dynamic truncation (RFC 4226 Section 5.4)
  const offset = hashBytes[hashBytes.length - 1] & 0x0f;
  const binary =
    ((hashBytes[offset] & 0x7f) << 24) |
    ((hashBytes[offset + 1] & 0xff) << 16) |
    ((hashBytes[offset + 2] & 0xff) << 8) |
    (hashBytes[offset + 3] & 0xff);

  const mod = Math.pow(10, digits);
  const otp = binary % mod;
  return otp.toString().padStart(digits, "0");
}

export async function generateTotp(
  secretBase32: string,
  options: TotpOptions = {}
): Promise<TotpResult> {
  const keyBytes = base32ToBytes(secretBase32);
  if (!keyBytes) {
    throw new Error("Invalid Base32 Secret Key. Kripya valid key enter karein.");
  }

  const period = options.period || 30;
  const digits = options.digits || 6;
  const algorithm = options.algorithm || "SHA-1";
  const nowMs = options.timestampMs !== undefined ? options.timestampMs : Date.now();

  const currentSeconds = Math.floor(nowMs / 1000);
  const counter = Math.floor(currentSeconds / period);
  const secondsRemaining = period - (currentSeconds % period);

  const token = await computeHotp(keyBytes, counter, digits, algorithm);
  const nextToken = await computeHotp(keyBytes, counter + 1, digits, algorithm);

  return {
    token,
    secondsRemaining,
    nextToken,
    period,
    digits,
  };
}
