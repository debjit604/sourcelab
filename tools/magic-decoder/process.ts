export interface DecodeStep {
  method: string;
  output: string;
}

export interface AutoDecodeResult {
  original: string;
  decoded: string;
  layers: DecodeStep[];
  isDecoded: boolean;
}

export function isReadableText(str: string): boolean {
  if (!str || str.length === 0) return false;
  let printableCount = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // printable ASCII range 32-126 or common whitespace (\n, \r, \t)
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      printableCount++;
    }
  }
  return printableCount / str.length >= 0.85;
}

export function tryBase64(str: string): string | null {
  const clean = str.trim();
  if (clean.length < 4 || clean.length % 4 !== 0) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) return null;

  try {
    const decoded = atob(clean);
    if (decoded && isReadableText(decoded) && decoded !== clean) {
      return decoded;
    }
  } catch {
    return null;
  }
  return null;
}

export function tryHex(str: string): string | null {
  const clean = str.trim().replace(/^0x/i, "").replace(/[\s-]/g, "");
  if (clean.length < 2 || clean.length % 2 !== 0) return null;
  if (!/^[0-9a-fA-F]+$/.test(clean)) return null;

  try {
    let result = "";
    for (let i = 0; i < clean.length; i += 2) {
      const code = parseInt(clean.substring(i, i + 2), 16);
      result += String.fromCharCode(code);
    }
    if (result && isReadableText(result) && result !== clean) {
      return result;
    }
  } catch {
    return null;
  }
  return null;
}

export function tryUrl(str: string): string | null {
  if (!str.includes("%")) return null;
  try {
    const decoded = decodeURIComponent(str);
    if (decoded && decoded !== str) {
      return decoded;
    }
  } catch {
    return null;
  }
  return null;
}

export function tryBinary(str: string): string | null {
  const clean = str.trim();
  const chunks = clean.split(/[\s,]+/);
  if (chunks.length === 0) return null;

  const all8Bits = chunks.every((c) => /^[01]{8}$/.test(c));
  if (!all8Bits) return null;

  try {
    const result = chunks.map((c) => String.fromCharCode(parseInt(c, 2))).join("");
    if (result && isReadableText(result)) {
      return result;
    }
  } catch {
    return null;
  }
  return null;
}

export function tryDecimal(str: string): string | null {
  const clean = str.trim();
  const chunks = clean.split(/[\s,]+/);
  if (chunks.length < 2) return null;

  const allDecimal = chunks.every((c) => {
    const num = parseInt(c, 10);
    return !isNaN(num) && num >= 32 && num <= 126;
  });

  if (!allDecimal) return null;

  try {
    const result = chunks.map((c) => String.fromCharCode(parseInt(c, 10))).join("");
    if (result && isReadableText(result)) {
      return result;
    }
  } catch {
    return null;
  }
  return null;
}

export function tryRot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function autoMagicDecode(input: string, maxDepth = 6): AutoDecodeResult {
  const original = input.trim();
  if (!original) {
    return { original: "", decoded: "", layers: [], isDecoded: false };
  }

  let current = original;
  const layers: DecodeStep[] = [];
  const visited = new Set<string>([original]);

  for (let depth = 0; depth < maxDepth; depth++) {
    let next: string | null = null;
    let method = "";

    // 1. Try URL decode
    const urlRes = tryUrl(current);
    if (urlRes && !visited.has(urlRes)) {
      next = urlRes;
      method = "URL Decode";
    }

    // 2. Try Base64
    if (!next) {
      const b64Res = tryBase64(current);
      if (b64Res && !visited.has(b64Res)) {
        next = b64Res;
        method = "Base64 Decode";
      }
    }

    // 3. Try Hex
    if (!next) {
      const hexRes = tryHex(current);
      if (hexRes && !visited.has(hexRes)) {
        next = hexRes;
        method = "Hex Decode";
      }
    }

    // 4. Try Binary
    if (!next) {
      const binRes = tryBinary(current);
      if (binRes && !visited.has(binRes)) {
        next = binRes;
        method = "Binary Decode";
      }
    }

    // 5. Try Decimal ASCII
    if (!next) {
      const decRes = tryDecimal(current);
      if (decRes && !visited.has(decRes)) {
        next = decRes;
        method = "Decimal ASCII";
      }
    }

    if (next) {
      visited.add(next);
      layers.push({ method, output: next });
      current = next;
    } else {
      break;
    }
  }

  return {
    original,
    decoded: current,
    layers,
    isDecoded: layers.length > 0,
  };
}
