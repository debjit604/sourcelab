export type CompoundingFrequency = 1 | 2 | 4 | 12;

export interface YearBreakdown {
  year: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
}

export interface CompoundInterestResult {
  principal: number;
  finalAmount: number;
  totalInterest: number;
  growthMultiple: number;
  breakdown: YearBreakdown[];
}

export function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  frequency: CompoundingFrequency = 1
): CompoundInterestResult {
  if (principal <= 0 || annualRatePct < 0 || years <= 0) {
    throw new Error("Principal, rate aur years positive hone chahiye");
  }

  const r = annualRatePct / 100;
  const n = frequency;
  const t = Math.min(years, 50); // cap at 50 years to avoid overflow

  const finalAmountRaw = principal * Math.pow(1 + r / n, n * t);
  const finalAmount = Math.round(finalAmountRaw);
  const totalInterest = Math.round(finalAmount - principal);
  const growthMultiple = Math.round((finalAmount / principal) * 100) / 100;

  // Build year by year breakdown
  const breakdown: YearBreakdown[] = [];
  let prevBalance = principal;

  for (let year = 1; year <= t; year++) {
    const balanceAtYearEnd = principal * Math.pow(1 + r / n, n * year);
    const roundedBalance = Math.round(balanceAtYearEnd);
    const interestThisYear = roundedBalance - prevBalance;

    breakdown.push({
      year,
      openingBalance: prevBalance,
      interestEarned: interestThisYear,
      closingBalance: roundedBalance,
    });

    prevBalance = roundedBalance;
  }

  return {
    principal,
    finalAmount,
    totalInterest,
    growthMultiple,
    breakdown,
  };
}

export interface ProcessInput {
  principal: number;
  ratePct: number;
  years: number;
  frequency?: CompoundingFrequency;
}

export async function process(input: ProcessInput): Promise<CompoundInterestResult> {
  return calculateCompoundInterest(
    input.principal,
    input.ratePct,
    input.years,
    input.frequency || 1
  );
}
