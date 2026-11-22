const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertLessThanThousand(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) {
    const unit = n % 10;
    return `${TENS[Math.floor(n / 10)]}${unit ? ` ${ONES[unit]}` : ""}`;
  }
  const hundred = Math.floor(n / 100);
  const remainder = n % 100;
  return `${ONES[hundred]} Hundred${remainder ? ` and ${convertLessThanThousand(remainder)}` : ""}`;
}

export function numberToWordsIndian(numStr: string): string {
  const parts = numStr.trim().split(".");
  let intPart = parts[0].replace(/^0+/, "") || "0";
  const decPart = parts[1] || "";

  if (intPart === "0" && !decPart) return "Zero";

  const isNegative = intPart.startsWith("-");
  if (isNegative) intPart = intPart.slice(1);

  const num = parseInt(intPart, 10);
  if (isNaN(num)) throw new Error("Invalid number");

  if (num === 0 && !decPart) return "Zero";

  // Indian groups: Hundreds (3 digits), Thousands (2 digits), Lakhs (2 digits), Crores (2+ digits)
  let remainder = num;
  const chunks: string[] = [];

  const crores = Math.floor(remainder / 10000000);
  remainder %= 10000000;

  const lakhs = Math.floor(remainder / 100000);
  remainder %= 100000;

  const thousands = Math.floor(remainder / 1000);
  remainder %= 1000;

  const hundreds = remainder;

  if (crores > 0) {
    chunks.push(`${numberToWordsIndian(crores.toString())} Crore`);
  }
  if (lakhs > 0) {
    chunks.push(`${convertLessThanThousand(lakhs)} Lakh`);
  }
  if (thousands > 0) {
    chunks.push(`${convertLessThanThousand(thousands)} Thousand`);
  }
  if (hundreds > 0) {
    chunks.push(convertLessThanThousand(hundreds));
  }

  let words = chunks.join(" ").trim() || "Zero";
  if (isNegative) words = `Minus ${words}`;

  if (decPart) {
    const paise = parseInt(decPart.slice(0, 2).padEnd(2, "0"), 10);
    if (paise > 0) {
      words += ` and ${convertLessThanThousand(paise)} Paise`;
    }
  }

  return words;
}

export function numberToWordsInternational(numStr: string): string {
  const parts = numStr.trim().split(".");
  let intPart = parts[0].replace(/^0+/, "") || "0";
  const decPart = parts[1] || "";

  const isNegative = intPart.startsWith("-");
  if (isNegative) intPart = intPart.slice(1);

  const num = parseInt(intPart, 10);
  if (isNaN(num)) throw new Error("Invalid number");

  if (num === 0 && !decPart) return "Zero";

  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  let remainder = num;
  const groups: string[] = [];

  let scaleIndex = 0;
  while (remainder > 0 && scaleIndex < scales.length) {
    const chunk = remainder % 1000;
    if (chunk > 0) {
      const chunkWords = convertLessThanThousand(chunk);
      groups.unshift(`${chunkWords}${scales[scaleIndex] ? ` ${scales[scaleIndex]}` : ""}`);
    }
    remainder = Math.floor(remainder / 1000);
    scaleIndex++;
  }

  let words = groups.join(" ").trim() || "Zero";
  if (isNegative) words = `Minus ${words}`;

  if (decPart) {
    const cents = parseInt(decPart.slice(0, 2).padEnd(2, "0"), 10);
    if (cents > 0) {
      words += ` and ${convertLessThanThousand(cents)} Cents`;
    }
  }

  return words;
}

export interface NumberToWordsResult {
  indian: string;
  international: string;
  chequeFormat: string;
  formattedNumber: string;
}

export function convertNumber(inputStr: string): NumberToWordsResult {
  const clean = inputStr.replace(/,/g, "").trim();
  if (!clean || isNaN(Number(clean))) {
    throw new Error("Valid number enter karo (jaise 125000 ya 1500.50)");
  }

  const indian = numberToWordsIndian(clean);
  const international = numberToWordsInternational(clean);

  // Cheque format: Rupees X Only
  const chequeFormat = `Rupees ${indian} Only`;

  const numVal = Number(clean);
  const formattedNumber = numVal.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  return {
    indian,
    international,
    chequeFormat,
    formattedNumber,
  };
}

export interface ProcessInput {
  number: string;
}

export async function process(input: ProcessInput): Promise<NumberToWordsResult> {
  return convertNumber(input.number);
}
