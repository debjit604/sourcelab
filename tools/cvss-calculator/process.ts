export type AttackVector = "N" | "A" | "L" | "P";
export type AttackComplexity = "L" | "H";
export type PrivilegesRequired = "N" | "L" | "H";
export type UserInteraction = "N" | "R";
export type Scope = "U" | "C";
export type ImpactMetric = "N" | "L" | "H";

export interface CvssV31Metrics {
  av: AttackVector;
  ac: AttackComplexity;
  pr: PrivilegesRequired;
  ui: UserInteraction;
  s: Scope;
  c: ImpactMetric;
  i: ImpactMetric;
  a: ImpactMetric;
}

export type CvssSeverity = "None" | "Low" | "Medium" | "High" | "Critical";

export interface CvssResult {
  score: number;
  severity: CvssSeverity;
  vectorString: string;
  color: string;
  impactSubscore: number;
  exploitabilitySubscore: number;
}

/**
 * Standard FIRST CVSS v3.1 RoundUp function
 */
export function roundUp(val: number): number {
  const input = Math.round(val * 100000);
  if (input % 10000 === 0) {
    return input / 100000;
  }
  return (Math.floor(input / 10000) + 1) / 10;
}

export const DEFAULT_CVSS_METRICS: CvssV31Metrics = {
  av: "N",
  ac: "L",
  pr: "N",
  ui: "N",
  s: "U",
  c: "H",
  i: "H",
  a: "H",
};

export function calculateCvss(metrics: CvssV31Metrics): CvssResult {
  // Numeric values
  const avWeights: Record<AttackVector, number> = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
  const acWeights: Record<AttackComplexity, number> = { L: 0.77, H: 0.44 };
  const uiWeights: Record<UserInteraction, number> = { N: 0.85, R: 0.62 };

  const isScopeChanged = metrics.s === "C";

  let prWeight = 0.85;
  if (metrics.pr === "L") prWeight = isScopeChanged ? 0.68 : 0.62;
  else if (metrics.pr === "H") prWeight = isScopeChanged ? 0.50 : 0.27;

  const impactWeights: Record<ImpactMetric, number> = { N: 0, L: 0.22, H: 0.56 };
  const cVal = impactWeights[metrics.c];
  const iVal = impactWeights[metrics.i];
  const aVal = impactWeights[metrics.a];

  // ISS (Impact Sub-Score multiplier)
  const iss = 1 - (1 - cVal) * (1 - iVal) * (1 - aVal);

  let impact = 0;
  if (isScopeChanged) {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  } else {
    impact = 6.42 * iss;
  }

  const exploitability =
    8.22 * avWeights[metrics.av] * acWeights[metrics.ac] * prWeight * uiWeights[metrics.ui];

  let score = 0;
  if (impact <= 0) {
    score = 0;
  } else if (!isScopeChanged) {
    score = roundUp(Math.min(impact + exploitability, 10));
  } else {
    score = roundUp(Math.min(1.08 * (impact + exploitability), 10));
  }

  // Format to 1 decimal place
  score = Math.round(score * 10) / 10;

  let severity: CvssSeverity = "None";
  let color = "#8B95AD";

  if (score === 0) {
    severity = "None";
    color = "#8B95AD";
  } else if (score <= 3.9) {
    severity = "Low";
    color = "#34D399";
  } else if (score <= 6.9) {
    severity = "Medium";
    color = "#FBBF24";
  } else if (score <= 8.9) {
    severity = "High";
    color = "#FB923C";
  } else {
    severity = "Critical";
    color = "#F87171";
  }

  const vectorString = `CVSS:3.1/AV:${metrics.av}/AC:${metrics.ac}/PR:${metrics.pr}/UI:${metrics.ui}/S:${metrics.s}/C:${metrics.c}/I:${metrics.i}/A:${metrics.a}`;

  return {
    score,
    severity,
    vectorString,
    color,
    impactSubscore: Math.round(impact * 10) / 10,
    exploitabilitySubscore: Math.round(exploitability * 10) / 10,
  };
}

export function parseVectorString(vectorStr: string): CvssV31Metrics | null {
  const parts = vectorStr.trim().split("/");
  if (parts.length < 8) return null;

  const result: Partial<CvssV31Metrics> = {};

  for (const part of parts) {
    const [k, v] = part.split(":");
    if (!k || !v) continue;
    switch (k.toUpperCase()) {
      case "AV":
        if (["N", "A", "L", "P"].includes(v)) result.av = v as AttackVector;
        break;
      case "AC":
        if (["L", "H"].includes(v)) result.ac = v as AttackComplexity;
        break;
      case "PR":
        if (["N", "L", "H"].includes(v)) result.pr = v as PrivilegesRequired;
        break;
      case "UI":
        if (["N", "R"].includes(v)) result.ui = v as UserInteraction;
        break;
      case "S":
        if (["U", "C"].includes(v)) result.s = v as Scope;
        break;
      case "C":
        if (["N", "L", "H"].includes(v)) result.c = v as ImpactMetric;
        break;
      case "I":
        if (["N", "L", "H"].includes(v)) result.i = v as ImpactMetric;
        break;
      case "A":
        if (["N", "L", "H"].includes(v)) result.a = v as ImpactMetric;
        break;
    }
  }

  if (
    result.av &&
    result.ac &&
    result.pr &&
    result.ui &&
    result.s &&
    result.c &&
    result.i &&
    result.a
  ) {
    return result as CvssV31Metrics;
  }
  return null;
}

export interface ProcessInput {
  vector?: string;
  metrics?: CvssV31Metrics;
}

export async function process(input: ProcessInput): Promise<CvssResult> {
  if (input.vector && input.vector.trim()) {
    const parsed = parseVectorString(input.vector);
    if (!parsed) {
      throw new Error("Invalid CVSS v3.1 vector string");
    }
    return calculateCvss(parsed);
  }
  if (input.metrics) {
    return calculateCvss(input.metrics);
  }
  return calculateCvss(DEFAULT_CVSS_METRICS);
}

