const NAMED_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "¢": "&cent;",
  "£": "&pound;",
  "¥": "&yen;",
  "€": "&euro;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "§": "&sect;",
  "°": "&deg;",
};

const REVERSE_NAMED_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&cent;": "¢",
  "&pound;": "£",
  "&yen;": "¥",
  "&euro;": "€",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&sect;": "§",
  "&deg;": "°",
  "&nbsp;": " ",
};

export function encodeHtmlEntities(
  text: string,
  format: "named" | "decimal" | "hex" = "named"
): string {
  if (!text) return "";

  if (format === "decimal") {
    return Array.from(text)
      .map((ch) => {
        const code = ch.codePointAt(0);
        return code ? `&#${code};` : ch;
      })
      .join("");
  }

  if (format === "hex") {
    return Array.from(text)
      .map((ch) => {
        const code = ch.codePointAt(0);
        return code ? `&#x${code.toString(16).toUpperCase()};` : ch;
      })
      .join("");
  }

  // Named format (falls back to numeric for unmapped special/non-ASCII)
  return text.replace(/[&<>"'¢£¥€©®™§°]/g, (ch) => NAMED_MAP[ch] || ch);
}

export function decodeHtmlEntities(text: string): string {
  if (!text) return "";

  // 1. Decode named entities
  const decoded = text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    if (REVERSE_NAMED_MAP[entity]) {
      return REVERSE_NAMED_MAP[entity];
    }
    // 2. Decode Hex &#x...;
    const hexMatch = entity.match(/^&#x([0-9a-fA-F]+);$/);
    if (hexMatch) {
      const code = parseInt(hexMatch[1], 16);
      try {
        return String.fromCodePoint(code);
      } catch {
        return entity;
      }
    }
    // 3. Decode Decimal &#...;
    const decMatch = entity.match(/^&#([0-9]+);$/);
    if (decMatch) {
      const code = parseInt(decMatch[1], 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return entity;
      }
    }
    return entity;
  });

  return decoded;
}
