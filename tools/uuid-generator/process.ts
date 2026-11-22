export interface UuidOptions {
  quantity: number;
  uppercase?: boolean;
  hyphens?: boolean;
  braces?: boolean;
  quotes?: "none" | "single" | "double";
  separator?: "newline" | "comma" | "json";
}

export interface UuidResult {
  output: string;
  items: string[];
  count: number;
  error?: string;
}

export function generateSingleUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Cryptographically compliant RFC 4122 v4 fallback
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function formatUuid(uuid: string, options: Partial<UuidOptions>): string {
  let formatted = uuid;

  if (options.hyphens === false) {
    formatted = formatted.replace(/-/g, "");
  }

  if (options.uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }

  if (options.braces) {
    formatted = `{${formatted}}`;
  }

  if (options.quotes === "single") {
    formatted = `'${formatted}'`;
  } else if (options.quotes === "double") {
    formatted = `"${formatted}"`;
  }

  return formatted;
}

export function generateUuids(options: Partial<UuidOptions> = {}): UuidResult {
  const qty = Math.max(1, Math.min(500, Math.floor(options.quantity || 1)));
  const items: string[] = [];

  for (let i = 0; i < qty; i++) {
    const raw = generateSingleUuid();
    items.push(formatUuid(raw, options));
  }

  let output = "";
  if (options.separator === "json") {
    output = JSON.stringify(items, null, 2);
  } else if (options.separator === "comma") {
    output = items.join(", ");
  } else {
    output = items.join("\n");
  }

  return {
    output,
    items,
    count: items.length,
  };
}
