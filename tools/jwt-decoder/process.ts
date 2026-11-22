export interface JwtClaimInfo {
  timestamp: number;
  dateStr: string;
  isExpired?: boolean;
  statusText: string;
}

export interface JwtProcessInput {
  token: string;
}

export interface JwtProcessOutput {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  algorithm?: string;
  tokenType?: string;
  issuedAt?: JwtClaimInfo;
  expiresAt?: JwtClaimInfo;
  notBefore?: JwtClaimInfo;
  isExpired?: boolean;
  result: string;
}

export function base64UrlDecode(str: string): string {
  // Convert Base64URL to standard Base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  try {
    // Decode base64 to binary string
    const binary = atob(base64);
    // Convert binary string to bytes and decode as UTF-8
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  } catch {
    throw new Error("Base64URL decoding fail ho gayi. Token ka format invalid lag raha hai.");
  }
}

export function parseTimestampClaim(timestampSec: unknown): JwtClaimInfo | undefined {
  if (typeof timestampSec !== "number" || isNaN(timestampSec)) {
    return undefined;
  }

  const date = new Date(timestampSec * 1000);
  if (isNaN(date.getTime())) {
    return undefined;
  }

  const nowMs = Date.now();
  const targetMs = date.getTime();
  const diffSec = Math.round((targetMs - nowMs) / 1000);

  const isExpired = diffSec < 0;
  let statusText = "";

  if (isExpired) {
    const absDiff = Math.abs(diffSec);
    if (absDiff < 60) statusText = `Expired (${absDiff} seconds pehle)`;
    else if (absDiff < 3600) statusText = `Expired (${Math.floor(absDiff / 60)} min pehle)`;
    else if (absDiff < 86400) statusText = `Expired (${Math.floor(absDiff / 3600)} hours pehle)`;
    else statusText = `Expired (${Math.floor(absDiff / 86400)} din pehle)`;
  } else {
    if (diffSec < 60) statusText = `Active (${diffSec} seconds bache hain)`;
    else if (diffSec < 3600) statusText = `Active (${Math.floor(diffSec / 60)} min bache hain)`;
    else if (diffSec < 86400) statusText = `Active (${Math.floor(diffSec / 3600)} hours bache hain)`;
    else statusText = `Active (${Math.floor(diffSec / 86400)} din bache hain)`;
  }

  return {
    timestamp: timestampSec,
    dateStr: date.toUTCString(),
    isExpired,
    statusText,
  };
}

export function processJwt(input: JwtProcessInput): JwtProcessOutput {
  const raw = (input.token ?? "").trim();

  if (!raw) {
    throw new Error("JWT token khali hai. Kripya pehle valid JWT token paste karein.");
  }

  // Strip "Bearer " prefix if present
  const cleaned = raw.replace(/^Bearer\s+/i, "").trim();

  const parts = cleaned.split(".");
  if (parts.length !== 3) {
    throw new Error(
      `Invalid JWT format: Token me 3 parts (Header.Payload.Signature) hone chahiye, lekin yahan ${parts.length} part mile.`
    );
  }

  const [headerPart, payloadPart, signaturePart] = parts;

  let header: Record<string, unknown> = {};
  let rawHeader = "";
  try {
    rawHeader = base64UrlDecode(headerPart);
    header = JSON.parse(rawHeader);
  } catch (err: unknown) {
    throw new Error(
      `JWT Header decode nahi ho paya: ${err instanceof Error ? err.message : "Invalid JSON"}`
    );
  }

  let payload: Record<string, unknown> = {};
  let rawPayload = "";
  try {
    rawPayload = base64UrlDecode(payloadPart);
    payload = JSON.parse(rawPayload);
  } catch (err: unknown) {
    throw new Error(
      `JWT Payload decode nahi ho paya: ${err instanceof Error ? err.message : "Invalid JSON"}`
    );
  }

  const algorithm = typeof header.alg === "string" ? header.alg : undefined;
  const tokenType = typeof header.typ === "string" ? header.typ : undefined;

  const expiresAt = parseTimestampClaim(payload.exp);
  const issuedAt = parseTimestampClaim(payload.iat);
  const notBefore = parseTimestampClaim(payload.nbf);

  const fullResult = JSON.stringify(
    {
      header,
      payload,
      signature: signaturePart,
    },
    null,
    2
  );

  return {
    header,
    payload,
    signature: signaturePart,
    rawHeader,
    rawPayload,
    algorithm,
    tokenType,
    issuedAt,
    expiresAt,
    notBefore,
    isExpired: expiresAt?.isExpired,
    result: fullResult,
  };
}

export const process = processJwt;
