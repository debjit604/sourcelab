export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating";

export interface CaseConvertResult {
  output: string;
  wordCount: number;
  charCount: number;
  error?: string;
}

export function splitWords(text: string): string[] {
  if (!text) return [];
  // Split on camelCase transitions and non-alphanumeric characters
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z0-9])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

export function toSentenceCase(text: string): string {
  if (!text) return "";
  // Lowercase everything first
  const lower = text.toLowerCase();
  // Capitalize first character of string and first character after sentence enders (. ? ! \n)
  return lower.replace(/(^\s*|[.!?\n]\s*)([a-z])/g, (_, boundary, char) => {
    return boundary + char.toUpperCase();
  });
}

export function toTitleCase(text: string): string {
  if (!text) return "";
  return text.toLowerCase().replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

export function toCamelCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return "";
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

export function toPascalCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return "";
  return words
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

export function toSnakeCase(text: string): string {
  const words = splitWords(text);
  return words.map((w) => w.toLowerCase()).join("_");
}

export function toKebabCase(text: string): string {
  const words = splitWords(text);
  return words.map((w) => w.toLowerCase()).join("-");
}

export function toConstantCase(text: string): string {
  const words = splitWords(text);
  return words.map((w) => w.toUpperCase()).join("_");
}

export function toAlternatingCase(text: string): string {
  let isUpper = true;
  return text
    .split("")
    .map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        isUpper = !isUpper;
        return isUpper ? char.toUpperCase() : char.toLowerCase();
      }
      return char;
    })
    .join("");
}

export function convertCase(text: string, type: CaseType): CaseConvertResult {
  if (!text || text.length === 0) {
    return {
      output: "",
      wordCount: 0,
      charCount: 0,
    };
  }

  let output = "";
  switch (type) {
    case "upper":
      output = text.toUpperCase();
      break;
    case "lower":
      output = text.toLowerCase();
      break;
    case "title":
      output = toTitleCase(text);
      break;
    case "sentence":
      output = toSentenceCase(text);
      break;
    case "camel":
      output = toCamelCase(text);
      break;
    case "pascal":
      output = toPascalCase(text);
      break;
    case "snake":
      output = toSnakeCase(text);
      break;
    case "kebab":
      output = toKebabCase(text);
      break;
    case "constant":
      output = toConstantCase(text);
      break;
    case "alternating":
      output = toAlternatingCase(text);
      break;
    default:
      output = text;
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return {
    output,
    wordCount: words,
    charCount: output.length,
  };
}
