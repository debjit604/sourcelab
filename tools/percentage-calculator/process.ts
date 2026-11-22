export type CalcMode =
  | "percent-of"
  | "what-percent"
  | "percent-change"
  | "discount";

export interface PercentageResult {
  value: number;
  formatted: string;
  formula: string;
  details?: Record<string, number | string>;
}

export function calculatePercentOf(percent: number, total: number): PercentageResult {
  const result = (percent / 100) * total;
  const rounded = Math.round(result * 10000) / 10000;
  return {
    value: rounded,
    formatted: rounded.toLocaleString("en-IN", { maximumFractionDigits: 4 }),
    formula: `${percent}% × ${total} = ${rounded}`,
  };
}

export function calculateWhatPercent(part: number, total: number): PercentageResult {
  if (total === 0) {
    throw new Error("Total 0 nahi ho sakta (Division by zero)");
  }
  const result = (part / total) * 100;
  const rounded = Math.round(result * 10000) / 10000;
  return {
    value: rounded,
    formatted: `${rounded.toLocaleString("en-IN", { maximumFractionDigits: 2 })}%`,
    formula: `(${part} ÷ ${total}) × 100 = ${rounded}%`,
  };
}

export function calculatePercentChange(oldValue: number, newValue: number): PercentageResult {
  if (oldValue === 0) {
    throw new Error("Initial value 0 nahi ho sakti (Division by zero)");
  }
  const diff = newValue - oldValue;
  const change = (diff / oldValue) * 100;
  const rounded = Math.round(change * 10000) / 10000;
  const isIncrease = diff >= 0;

  return {
    value: rounded,
    formatted: `${isIncrease ? "+" : ""}${rounded.toFixed(2)}%`,
    formula: `((${newValue} - ${oldValue}) ÷ ${oldValue}) × 100 = ${rounded.toFixed(2)}%`,
    details: {
      difference: Math.round(diff * 100) / 100,
      direction: isIncrease ? "Increase" : "Decrease",
    },
  };
}

export function calculateDiscount(price: number, discountPercent: number): PercentageResult {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount 0% se 100% ke beech hona chahiye");
  }
  const savings = (discountPercent / 100) * price;
  const finalPrice = price - savings;

  return {
    value: Math.round(finalPrice * 100) / 100,
    formatted: `₹${(Math.round(finalPrice * 100) / 100).toLocaleString("en-IN")}`,
    formula: `Original: ₹${price} - Discount (${discountPercent}% = ₹${savings.toFixed(2)}) = ₹${finalPrice.toFixed(2)}`,
    details: {
      originalPrice: price,
      savings: Math.round(savings * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
    },
  };
}

export interface ProcessInput {
  mode: CalcMode;
  val1: number;
  val2: number;
}

export async function process(input: ProcessInput): Promise<PercentageResult> {
  switch (input.mode) {
    case "percent-of":
      return calculatePercentOf(input.val1, input.val2);
    case "what-percent":
      return calculateWhatPercent(input.val1, input.val2);
    case "percent-change":
      return calculatePercentChange(input.val1, input.val2);
    case "discount":
      return calculateDiscount(input.val1, input.val2);
    default:
      throw new Error("Invalid percentage mode");
  }
}
