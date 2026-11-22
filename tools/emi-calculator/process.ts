export interface EmiProcessInput {
  principal: number;
  annualRate: number;
  tenureYears: number;
}

export interface YearlyScheduleItem {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  balance: number;
}

export interface EmiProcessOutput {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  principalRatio: number;
  interestRatio: number;
  tenureMonths: number;
  schedule: YearlyScheduleItem[];
  result: string;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function calculateAmortization(
  principal: number,
  monthlyRate: number,
  monthlyEmi: number,
  totalMonths: number
): YearlyScheduleItem[] {
  const schedule: YearlyScheduleItem[] = [];
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(balance, monthlyEmi - interest);
    balance = Math.max(0, balance - principalPaid);

    yearPrincipal += principalPaid;
    yearInterest += interest;

    if (m % 12 === 0 || m === totalMonths) {
      const yearNum = Math.ceil(m / 12);
      schedule.push({
        year: yearNum,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        totalPaid: Math.round(yearPrincipal + yearInterest),
        balance: Math.round(balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return schedule;
}

export function processEmi(input: EmiProcessInput): EmiProcessOutput {
  const principal = Number(input.principal);
  const annualRate = Number(input.annualRate);
  const tenureYears = Number(input.tenureYears);

  if (isNaN(principal) || principal <= 0) {
    throw new Error("Loan amount (Principal) 0 se zyada hona chahiye.");
  }

  if (isNaN(annualRate) || annualRate < 0 || annualRate > 100) {
    throw new Error("Interest rate 0% se 100% ke beech hona chahiye.");
  }

  if (isNaN(tenureYears) || tenureYears <= 0 || tenureYears > 40) {
    throw new Error("Loan tenure 1 se 40 saal ke beech hona chahiye.");
  }

  const totalMonths = Math.round(tenureYears * 12);
  const monthlyRate = annualRate / (12 * 100);

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = principal / totalMonths;
  } else {
    const rateFactor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyEmi = (principal * monthlyRate * rateFactor) / (rateFactor - 1);
  }

  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const principalRatio = totalPayment > 0 ? parseFloat(((principal / totalPayment) * 100).toFixed(1)) : 100;
  const interestRatio = totalPayment > 0 ? parseFloat(((totalInterest / totalPayment) * 100).toFixed(1)) : 0;

  const schedule = calculateAmortization(principal, monthlyRate, monthlyEmi, totalMonths);

  const summary = [
    `--- Loan EMI Calculation Summary ---`,
    `Loan Principal:    ${formatInr(principal)}`,
    `Annual Interest:   ${annualRate}%`,
    `Tenure:            ${tenureYears} Years (${totalMonths} Months)`,
    `Monthly EMI:       ${formatInr(monthlyEmi)}`,
    `Total Interest:    ${formatInr(totalInterest)} (${interestRatio}%)`,
    `Total Payable:     ${formatInr(totalPayment)}`,
    `\nYearly Schedule:`,
    ...schedule.map(
      (s) =>
        `Year ${s.year.toString().padStart(2)}: Principal ${formatInr(s.principalPaid)} | Interest ${formatInr(s.interestPaid)} | Balance ${formatInr(s.balance)}`
    ),
  ].join("\n");

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principal,
    principalRatio,
    interestRatio,
    tenureMonths: totalMonths,
    schedule,
    result: summary,
  };
}

export const process = processEmi;
