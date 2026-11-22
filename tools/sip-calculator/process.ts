export interface SipInput {
  monthlyInvestment: number;
  expectedReturnRate: number;
  timePeriodYears: number;
  mode?: "sip" | "lumpsum";
  stepUpPercent?: number;
}

export interface YearlyBreakdown {
  year: number;
  invested: number;
  returns: number;
  totalValue: number;
}

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return "₹" + Math.round(val).toLocaleString("en-IN");
}

export function formatCompactINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  const abs = Math.abs(val);
  if (abs >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
  return formatINR(val);
}

export function generateSipSummaryText(
  result: SipResult,
  params: {
    mode: "sip" | "lumpsum";
    amount: number;
    returnRate: number;
    tenureYears: number;
    stepUp: number;
  }
): string {
  return [
    `SourceLab SIP Calculator Summary:`,
    `Type: ${params.mode === "sip" ? "Monthly SIP" : "Lumpsum"}`,
    `Investment: ${formatINR(params.amount)}${params.mode === "sip" ? "/month" : ""}`,
    `Expected Return: ${params.returnRate}% p.a.`,
    `Tenure: ${params.tenureYears} Years`,
    params.stepUp > 0 ? `Step-up: ${params.stepUp}% yearly` : null,
    `---`,
    `Total Invested: ${formatINR(result.investedAmount)}`,
    `Estimated Returns: ${formatINR(result.estimatedReturns)}`,
    `Total Value: ${formatINR(result.totalValue)} (${formatCompactINR(result.totalValue)})`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function calculateSip(input: SipInput): SipResult {
  const mode = input.mode || "sip";
  const P = Math.max(0, input.monthlyInvestment);
  const annualRate = Math.max(0, input.expectedReturnRate);
  const years = Math.max(1, Math.min(50, Math.round(input.timePeriodYears)));
  const stepUp = Math.max(0, Math.min(100, input.stepUpPercent || 0));

  if (mode === "lumpsum") {
    return calculateLumpsum(P, annualRate, years);
  }

  const yearlyBreakdown: YearlyBreakdown[] = [];
  const monthlyRate = annualRate / (12 * 100);

  let totalInvested = 0;
  let currentValue = 0;
  let currentMonthlyInvestment = P;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      totalInvested += currentMonthlyInvestment;
      if (monthlyRate === 0) {
        currentValue += currentMonthlyInvestment;
      } else {
        currentValue = (currentValue + currentMonthlyInvestment) * (1 + monthlyRate);
      }
    }

    const yearValue = Math.round(currentValue);
    const yearInvested = Math.round(totalInvested);
    yearlyBreakdown.push({
      year: y,
      invested: yearInvested,
      returns: Math.max(0, yearValue - yearInvested),
      totalValue: yearValue,
    });

    if (stepUp > 0) {
      currentMonthlyInvestment = Math.round(currentMonthlyInvestment * (1 + stepUp / 100));
    }
  }

  const finalValue = Math.round(currentValue);
  const finalInvested = Math.round(totalInvested);
  const finalReturns = Math.max(0, finalValue - finalInvested);

  return {
    investedAmount: finalInvested,
    estimatedReturns: finalReturns,
    totalValue: finalValue,
    yearlyBreakdown,
  };
}

function calculateLumpsum(P: number, annualRate: number, years: number): SipResult {
  const yearlyBreakdown: YearlyBreakdown[] = [];
  const r = annualRate / 100;

  for (let y = 1; y <= years; y++) {
    const value = Math.round(P * Math.pow(1 + r, y));
    yearlyBreakdown.push({
      year: y,
      invested: P,
      returns: Math.max(0, value - P),
      totalValue: value,
    });
  }

  const finalValue = yearlyBreakdown.length > 0 ? yearlyBreakdown[years - 1].totalValue : P;
  const finalReturns = Math.max(0, finalValue - P);

  return {
    investedAmount: P,
    estimatedReturns: finalReturns,
    totalValue: finalValue,
    yearlyBreakdown,
  };
}
