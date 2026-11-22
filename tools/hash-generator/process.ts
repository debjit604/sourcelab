import SparkMD5 from "spark-md5";

export interface HashItem {
  id: string;
  name: string;
  hash: string;
  bits: number;
}

export interface HashProcessInput {
  text?: string;
  buffer?: ArrayBuffer;
  uppercase?: boolean;
}

export interface HashProcessOutput {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
  list: HashItem[];
  inputBytes: number;
  result: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < byteArray.length; i++) {
    hex += byteArray[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function computeSubtleHash(
  algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512",
  data: Uint8Array
): Promise<string> {
  const copy = data.slice().buffer;
  const hashBuffer = await crypto.subtle.digest(algo, copy);
  return bufferToHex(hashBuffer);
}

export async function processHash(input: HashProcessInput): Promise<HashProcessOutput> {
  const hasText = typeof input.text === "string";
  const hasBuffer = input.buffer != null && typeof input.buffer.byteLength === "number";

  if (!hasText && !hasBuffer) {
    throw new Error("Kuch text enter karo ya file drop karo hash generate karne ke liye.");
  }

  let bytes: Uint8Array;
  if (hasBuffer && input.buffer) {
    bytes = new Uint8Array(input.buffer);
  } else {
    const raw = input.text ?? "";
    if (raw.trim().length === 0) {
      throw new Error("Text input khali hai. Hash nikaalne ke liye data enter karo.");
    }
    bytes = new TextEncoder().encode(raw);
  }

  // Calculate MD5 using spark-md5 ArrayBuffer hasher
  const md5 = SparkMD5.ArrayBuffer.hash(bytes.slice().buffer as ArrayBuffer);

  // Calculate SHAs via Web Crypto API in parallel
  const [sha1, sha256, sha384, sha512] = await Promise.all([
    computeSubtleHash("SHA-1", bytes),
    computeSubtleHash("SHA-256", bytes),
    computeSubtleHash("SHA-384", bytes),
    computeSubtleHash("SHA-512", bytes),
  ]);

  const upper = input.uppercase ?? false;
  const format = (h: string) => (upper ? h.toUpperCase() : h.toLowerCase());

  const formattedMd5 = format(md5);
  const formattedSha1 = format(sha1);
  const formattedSha256 = format(sha256);
  const formattedSha384 = format(sha384);
  const formattedSha512 = format(sha512);

  const list: HashItem[] = [
    { id: "md5", name: "MD5", hash: formattedMd5, bits: 128 },
    { id: "sha1", name: "SHA-1", hash: formattedSha1, bits: 160 },
    { id: "sha256", name: "SHA-256", hash: formattedSha256, bits: 256 },
    { id: "sha384", name: "SHA-384", hash: formattedSha384, bits: 384 },
    { id: "sha512", name: "SHA-512", hash: formattedSha512, bits: 512 },
  ];

  // Default formatted text summary
  const result = list.map((item) => `${item.name.padEnd(8)}: ${item.hash}`).join("\n");

  return {
    md5: formattedMd5,
    sha1: formattedSha1,
    sha256: formattedSha256,
    sha384: formattedSha384,
    sha512: formattedSha512,
    list,
    inputBytes: bytes.byteLength,
    result,
  };
}

export const process = processHash;
