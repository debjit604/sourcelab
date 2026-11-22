export type DelimiterType = "space" | "none" | "comma" | "hyphen";
export type PrefixType = "" | "0b";

export interface BitStats {
  totalBits: number;
  onesCount: number;
  zerosCount: number;
  byteCount: number;
}

export interface TextBinaryProcessInput {
  text: string;
  mode: "text-to-binary" | "binary-to-text";
  delimiter?: DelimiterType;
  prefix?: PrefixType;
}

export interface TextBinaryProcessResult {
  result: string;
  binary: string;
  text: string;
  hex: string;
  decimal: string;
  stats: BitStats;
}

export function textToBinary(
  text: string,
  delimiter: DelimiterType = "space",
  prefix: PrefixType = ""
): string {
  if (!text) return "";
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);

  const binArray = Array.from(bytes).map(
    (b) => `${prefix}${b.toString(2).padStart(8, "0")}`
  );

  switch (delimiter) {
    case "none":
      return binArray.join("");
    case "comma":
      return binArray.join(", ");
    case "hyphen":
      return binArray.join("-");
    case "space":
    default:
      return binArray.join(" ");
  }
}

export function binaryToText(binaryInput: string): string {
  if (!binaryInput.trim()) return "";

  // Strip prefixes like 0b, and normalize delimiters
  const sanitized = binaryInput
    .replace(/0b/gi, "")
    .replace(/[\s,\-_]+/g, " ")
    .trim();

  let chunks: string[] = [];
  if (sanitized.includes(" ")) {
    chunks = sanitized.split(" ").filter(Boolean);
  } else {
    // Continuous bitstream
    const rawBits = sanitized.replace(/\s+/g, "");
    if (!/^[01]+$/.test(rawBits)) {
      throw new Error("Invalid binary: Sirf 0 aur 1 allow hai.");
    }
    const matched = rawBits.match(/.{1,8}/g);
    if (matched) chunks = matched;
  }

  const bytes: number[] = [];
  for (const chunk of chunks) {
    const cleanChunk = chunk.trim();
    if (!cleanChunk) continue;
    if (!/^[01]{1,8}$/.test(cleanChunk)) {
      throw new Error(`Invalid binary byte: "${cleanChunk}". Har byte 1-8 bits ka hona chahiye.`);
    }
    bytes.push(parseInt(cleanChunk, 2));
  }

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(new Uint8Array(bytes));
}

export function calculateBitStats(binaryStr: string): BitStats {
  const onlyBits = binaryStr.replace(/[^01]/g, "");
  const totalBits = onlyBits.length;
  let onesCount = 0;
  for (let i = 0; i < totalBits; i++) {
    if (onlyBits[i] === "1") onesCount++;
  }
  const zerosCount = totalBits - onesCount;
  const byteCount = Math.ceil(totalBits / 8);

  return { totalBits, onesCount, zerosCount, byteCount };
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

export function bytesToDecimal(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(10))
    .join(" ");
}

export async function process(
  input: TextBinaryProcessInput
): Promise<TextBinaryProcessResult> {
  const raw = input.text;
  if (!raw || !raw.trim()) {
    throw new Error("Input text khali hai");
  }

  const delimiter = input.delimiter || "space";
  const prefix = input.prefix || "";

  if (input.mode === "binary-to-text") {
    const decoded = binaryToText(raw);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(decoded);
    const standardBin = textToBinary(decoded, "space", "");
    const stats = calculateBitStats(raw);

    return {
      result: decoded,
      binary: standardBin,
      text: decoded,
      hex: bytesToHex(bytes),
      decimal: bytesToDecimal(bytes),
      stats,
    };
  } else {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(raw);
    const formattedBin = textToBinary(raw, delimiter, prefix);
    const standardBin = textToBinary(raw, "space", "");
    const stats = calculateBitStats(formattedBin);

    return {
      result: formattedBin,
      binary: standardBin,
      text: raw,
      hex: bytesToHex(bytes),
      decimal: bytesToDecimal(bytes),
      stats,
    };
  }
}
