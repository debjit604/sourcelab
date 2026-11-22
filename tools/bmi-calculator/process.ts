export interface BmiResult {
  bmi: number;
  category: string;
  asianCategory: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  color: string;
}

export function calculateBmi(
  weightKg: number,
  heightCm: number,
  isAsianCutoff: boolean = true
): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error("Weight aur height positive number hone chahiye");
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  // Standard WHO Categories
  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25.0) category = "Normal";
  else if (bmi < 30.0) category = "Overweight";
  else category = "Obese";

  // Asian WHO Cutoffs
  let asianCategory = "Normal";
  let color = "#34D399"; // success green

  if (bmi < 18.5) {
    asianCategory = "Underweight";
    color = "#38BDF8"; // cyan/blue
  } else if (bmi <= 22.9) {
    asianCategory = "Normal";
    color = "#34D399"; // green
  } else if (bmi <= 24.9) {
    asianCategory = "Overweight";
    color = "#FBBF24"; // yellow/orange
  } else {
    asianCategory = "Obese";
    color = "#F87171"; // red
  }

  // Ideal weight range: 18.5 to 22.9 (Asian) or 24.9 (Standard)
  const maxBmi = isAsianCutoff ? 22.9 : 24.9;
  const minKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxKg = Math.round(maxBmi * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    asianCategory,
    healthyWeightMinKg: minKg,
    healthyWeightMaxKg: maxKg,
    color,
  };
}

export function imperialToMetric(
  weightLbs: number,
  feet: number,
  inches: number
): { weightKg: number; heightCm: number } {
  const weightKg = weightLbs * 0.45359237;
  const totalInches = feet * 12 + inches;
  const heightCm = totalInches * 2.54;
  return {
    weightKg: Math.round(weightKg * 10) / 10,
    heightCm: Math.round(heightCm * 10) / 10,
  };
}

export interface ProcessInput {
  weightKg: number;
  heightCm: number;
  isAsianCutoff?: boolean;
}

export async function process(input: ProcessInput): Promise<BmiResult> {
  return calculateBmi(input.weightKg, input.heightCm, input.isAsianCutoff !== false);
}
