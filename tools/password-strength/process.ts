export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: string;
  entropyBits: number;
  poolSize: number;
  crackTimeDisplay: string;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  length: number;
  warnings: string[];
  suggestions: string[];
}

export function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "Instantly (< 1 sec)";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} months`;
  const years = Math.round(days / 365);
  if (years < 100) return `${years} years`;
  if (years < 1000) return `${years} years`;
  if (years < 1000000) return `${Math.round(years / 1000)}k years`;
  if (years < 1000000000) return `${Math.round(years / 1000000)}M years`;
  return "Centuries / Trillions of years";
}

export function analyzePassword(pwd: string): PasswordStrengthResult {
  if (!pwd) {
    return {
      score: 0,
      label: "Very Weak",
      color: "#F87171",
      entropyBits: 0,
      poolSize: 0,
      crackTimeDisplay: "Instantly",
      hasLowercase: false,
      hasUppercase: false,
      hasNumbers: false,
      hasSymbols: false,
      length: 0,
      warnings: ["Password khali hai."],
      suggestions: ["Kam se kam 12 characters ka lamba password banayein."],
    };
  }

  const length = pwd.length;
  const hasLowercase = /[a-z]/.test(pwd);
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasNumbers = /[0-9]/.test(pwd);
  const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33;

  // Shannon Entropy: E = L * log2(R)
  const entropyBits = poolSize > 0 ? Math.round(length * Math.log2(poolSize) * 10) / 10 : 0;

  // Assuming offline fast attack: 10 billion guesses/sec
  const combinations = Math.pow(poolSize || 1, length);
  const crackTimeSeconds = combinations / 10000000000;
  const crackTimeDisplay = formatCrackTime(crackTimeSeconds);

  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check repetition or simple sequences
  if (/^(\w)\1+$/.test(pwd)) {
    warnings.push("Sirf ek hi character baar baar repeat ho raha hai.");
  }
  if (/^(?:12345|password|qwerty|admin|12345678|abc123)/i.test(pwd)) {
    warnings.push("Ye bahut aam (common) password hai jo dictionary attacks me pehle second me crack hota hai.");
  }
  if (length < 8) {
    warnings.push("Password bahut chhota hai (8 characters se kam).");
  }

  // Suggestions
  if (!hasUppercase) suggestions.push("Uppercase letters (A-Z) jodein.");
  if (!hasNumbers) suggestions.push("Numbers (0-9) add karein.");
  if (!hasSymbols) suggestions.push("Special symbols (!@#$%) shaamil karein.");
  if (length < 12) suggestions.push("Length badhakar 12+ characters karein.");

  let score = 0;
  if (entropyBits < 28) score = 0;
  else if (entropyBits < 45) score = 1;
  else if (entropyBits < 60) score = 2;
  else if (entropyBits < 80) score = 3;
  else score = 4;

  const scoreLabels: Array<{ label: PasswordStrengthResult["label"]; color: string }> = [
    { label: "Very Weak", color: "#F87171" },
    { label: "Weak", color: "#FB923C" },
    { label: "Fair", color: "#FBBF24" },
    { label: "Strong", color: "#34D399" },
    { label: "Very Strong", color: "#22D3EE" },
  ];

  return {
    score,
    label: scoreLabels[score].label,
    color: scoreLabels[score].color,
    entropyBits,
    poolSize,
    crackTimeDisplay,
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSymbols,
    length,
    warnings,
    suggestions,
  };
}
