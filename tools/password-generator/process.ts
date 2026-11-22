export interface PasswordOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean;
  count?: number;
}

export interface PasswordStrength {
  entropy: number;
  score: number; // 1 to 5
  label: string;
  color: string;
}

export interface PasswordItem {
  password: string;
  strength: PasswordStrength;
}

export interface PasswordProcessOutput {
  passwords: PasswordItem[];
  primary: string;
  strength: PasswordStrength;
  result: string;
  stats: {
    length: number;
    count: number;
    poolSize: number;
    entropy: number;
  };
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS_CHARS = new Set(["l", "1", "I", "O", "0", "o"]);

function filterAmbiguous(charset: string): string {
  return charset
    .split("")
    .filter((ch) => !AMBIGUOUS_CHARS.has(ch))
    .join("");
}

export function calculateEntropy(length: number, poolSize: number): PasswordStrength {
  if (poolSize <= 0 || length <= 0) {
    return { entropy: 0, score: 1, label: "Bahut Kamzor", color: "var(--sl-error)" };
  }

  const entropy = Math.round(length * Math.log2(poolSize));

  if (entropy < 40) {
    return { entropy, score: 1, label: "Bahut Kamzor", color: "#F87171" };
  } else if (entropy < 60) {
    return { entropy, score: 2, label: "Kamzor", color: "#FB923C" };
  } else if (entropy < 80) {
    return { entropy, score: 3, label: "Theek-thaak", color: "#FBBF24" };
  } else if (entropy < 100) {
    return { entropy, score: 4, label: "Strong", color: "#34D399" };
  } else {
    return { entropy, score: 5, label: "Unbreakable", color: "#22D3EE" };
  }
}

function getRandomInt(max: number): number {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] % max;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSinglePassword(
  length: number,
  charsets: string[],
  fullPool: string
): string {
  const chars: string[] = [];

  // Guarantee at least one char from each requested set
  for (const set of charsets) {
    if (set.length > 0) {
      chars.push(set[getRandomInt(set.length)]);
    }
  }

  // Fill the remaining length with random chars from full pool
  while (chars.length < length) {
    chars.push(fullPool[getRandomInt(fullPool.length)]);
  }

  // Cryptographically shuffle the resulting characters
  return shuffleArray(chars).join("");
}

export function processPassword(options: PasswordOptions = {}): PasswordProcessOutput {
  const length = Math.min(128, Math.max(4, options.length ?? 16));
  const count = Math.min(50, Math.max(1, options.count ?? 1));
  const excludeAmbiguous = options.excludeAmbiguous ?? false;

  const useUpper = options.uppercase ?? true;
  const useLower = options.lowercase ?? true;
  const useNum = options.numbers ?? true;
  const useSym = options.symbols ?? true;

  const charsets: string[] = [];
  if (useUpper) charsets.push(excludeAmbiguous ? filterAmbiguous(UPPERCASE_CHARS) : UPPERCASE_CHARS);
  if (useLower) charsets.push(excludeAmbiguous ? filterAmbiguous(LOWERCASE_CHARS) : LOWERCASE_CHARS);
  if (useNum) charsets.push(excludeAmbiguous ? filterAmbiguous(NUMBER_CHARS) : NUMBER_CHARS);
  if (useSym) charsets.push(SYMBOL_CHARS);

  if (charsets.length === 0) {
    throw new Error(
      "Kam se kam ek character type (Uppercase, Lowercase, Numbers ya Symbols) select karna zaroori hai."
    );
  }

  const fullPool = charsets.join("");
  const poolSize = fullPool.length;
  const strength = calculateEntropy(length, poolSize);

  const passwords: PasswordItem[] = [];
  for (let i = 0; i < count; i++) {
    const pw = generateSinglePassword(length, charsets, fullPool);
    passwords.push({
      password: pw,
      strength,
    });
  }

  const primary = passwords[0]?.password ?? "";
  const result = passwords.map((p) => p.password).join("\n");

  return {
    passwords,
    primary,
    strength,
    result,
    stats: {
      length,
      count,
      poolSize,
      entropy: strength.entropy,
    },
  };
}

export const process = processPassword;
