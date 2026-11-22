export type GstType = "exclusive" | "inclusive";

export interface GstInput {
  amount: number;
  rate: number;
  type: GstType;
}

export interface GstResult {
  originalAmount: number;
  netAmount: number;
  gstAmount: number;
  grossAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  rate: number;
  type: GstType;
  error?: string;
}

function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function formatINR(val: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  } catch {
    return `₹${val.toFixed(2)}`;
  }
}

export function calculateGst(input: GstInput): GstResult {
  const { amount, rate, type } = input;

  if (isNaN(amount) || isNaN(rate)) {
    return {
      originalAmount: 0,
      netAmount: 0,
      gstAmount: 0,
      grossAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      rate: 0,
      type,
      error: "Kripya valid numbers enter karo.",
    };
  }

  if (amount < 0) {
    return {
      originalAmount: amount,
      netAmount: 0,
      gstAmount: 0,
      grossAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      rate,
      type,
      error: "Amount zero ya positive hona chahiye.",
    };
  }

  if (rate < 0 || rate > 100) {
    return {
      originalAmount: amount,
      netAmount: 0,
      gstAmount: 0,
      grossAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      rate,
      type,
      error: "GST rate 0% se 100% ke beech honi chahiye.",
    };
  }

  let net = 0;
  let gst = 0;
  let gross = 0;

  if (type === "exclusive") {
    // Adding GST to Net Amount: Gross = Net * (1 + rate/100)
    net = amount;
    gst = (net * rate) / 100;
    gross = net + gst;
  } else {
    // Extracting GST from Gross Amount: Net = Gross / (1 + rate/100)
    gross = amount;
    net = gross / (1 + rate / 100);
    gst = gross - net;
  }

  const roundedNet = round2(net);
  const roundedGst = round2(gst);
  const roundedGross = round2(gross);
  const halfTax = round2(gst / 2);

  return {
    originalAmount: amount,
    netAmount: roundedNet,
    gstAmount: roundedGst,
    grossAmount: roundedGross,
    cgst: halfTax,
    sgst: halfTax,
    igst: roundedGst,
    rate,
    type,
  };
}

export function generateGstSummary(
  result: GstResult,
  transactionType: "intra" | "inter"
): string {
  return `GST Tax Breakdown (SourceLab)
----------------------------------------
Mode        : ${result.type === "exclusive" ? "GST Exclusive (Tax Added)" : "GST Inclusive (Tax Included)"}
Territory   : ${transactionType === "intra" ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)"}
Base Amount : ${formatINR(result.netAmount)}
GST Rate    : ${result.rate}%
Total GST   : ${formatINR(result.gstAmount)}
----------------------------------------
${
  transactionType === "intra"
    ? `CGST        : ${formatINR(result.cgst)}\nSGST        : ${formatINR(result.sgst)}`
    : `IGST        : ${formatINR(result.igst)}`
}
----------------------------------------
Total Gross : ${formatINR(result.grossAmount)}
`;
}
