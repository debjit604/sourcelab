export type Base64Mode = "encode" | "decode";

export interface Base64ProcessInput {
  text: string;
  mode?: Base64Mode;
  urlSafe?: boolean;
}

export interface Base64ProcessOutput {
  result: string;
  stats: {
    inputBytes: number;
    outputBytes: number;
    mode: Base64Mode;
    ratio: string;
  };
}

export function encodeBase64(str: string, urlSafe = false): string {
  if (!str) {
    throw new Error("Input khali hai. Kripya pehle text ya file daalein.");
  }

  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binary);

  if (urlSafe) {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  return base64;
}

export function decodeBase64(b64: string): string {
  const trimmed = b64.trim();
  if (!trimmed) {
    throw new Error("Base64 input khali hai. Kripya encoded text daalein.");
  }

  // Strip optional data URL scheme e.g. "data:text/plain;base64,"
  let cleaned = trimmed.replace(/^data:[^;]+;base64,/, "").trim();

  // Handle URL-safe replacement back to standard base64
  cleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");

  // Pad missing '=' characters
  while (cleaned.length % 4 !== 0) {
    cleaned += "=";
  }

  // Validate base64 charset
  if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
    throw new Error(
      "Invalid Base64 string mila. Isme aise characters hain jo Base64 me allowed nahi hain."
    );
  }

  try {
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err: unknown) {
    throw new Error(
      `Decode karne me error aaya: ${err instanceof Error ? err.message : "Malformed Base64"}.`
    );
  }
}

export function processBase64(input: Base64ProcessInput): Base64ProcessOutput {
  const mode = input.mode || "encode";
  const urlSafe = Boolean(input.urlSafe);

  const result =
    mode === "encode"
      ? encodeBase64(input.text, urlSafe)
      : decodeBase64(input.text);

  const inputBytes = new TextEncoder().encode(input.text).length;
  const outputBytes = new TextEncoder().encode(result).length;
  const ratio = inputBytes > 0 ? (outputBytes / inputBytes).toFixed(2) + "x" : "1.00x";

  return {
    result,
    stats: {
      inputBytes,
      outputBytes,
      mode,
      ratio,
    },
  };
}
