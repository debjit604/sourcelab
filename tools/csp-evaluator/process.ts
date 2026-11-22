export type CspFindingSeverity = "critical" | "high" | "medium" | "info" | "good";

export interface CspFinding {
  directive: string;
  severity: CspFindingSeverity;
  title: string;
  description: string;
  recommendation: string;
}

export interface ParsedDirective {
  name: string;
  values: string[];
}

export interface CspEvaluationResult {
  rawCsp: string;
  directives: ParsedDirective[];
  findings: CspFinding[];
  isEffectiveAgainstXss: boolean;
  score: number;
}

export function parseCsp(cspString: string): ParsedDirective[] {
  const directives: ParsedDirective[] = [];
  const rawParts = cspString.split(";");

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const tokens = trimmed.split(/\s+/);
    const name = tokens[0].toLowerCase();
    const values = tokens.slice(1);
    directives.push({ name, values });
  }

  return directives;
}

export function evaluateCsp(cspString: string): CspEvaluationResult {
  const clean = cspString.trim();
  if (!clean) {
    return {
      rawCsp: "",
      directives: [],
      findings: [
        {
          directive: "global",
          severity: "critical",
          title: "Empty Policy",
          description: "No CSP directives defined.",
          recommendation: "Define a strict baseline Content Security Policy.",
        },
      ],
      isEffectiveAgainstXss: false,
      score: 0,
    };
  }

  const directives = parseCsp(clean);
  const dirMap = new Map<string, string[]>();
  for (const d of directives) {
    dirMap.set(d.name, d.values);
  }

  const findings: CspFinding[] = [];
  let score = 100;

  const scriptSrc = dirMap.get("script-src") || dirMap.get("default-src");
  const defaultSrc = dirMap.get("default-src");

  // 1. Check script-src / default-src presence
  if (!scriptSrc) {
    score -= 30;
    findings.push({
      directive: "script-src",
      severity: "critical",
      title: "Missing script-src and default-src",
      description: "Scripts can be loaded from arbitrary origins.",
      recommendation: "Define 'script-src' or 'default-src' restricting executable scripts.",
    });
  } else {
    // 2. Check unsafe-inline
    const hasUnsafeInline = scriptSrc.some((v) => v.toLowerCase() === "'unsafe-inline'");
    const hasNonceOrHash = scriptSrc.some(
      (v) => v.startsWith("'nonce-") || v.startsWith("'sha256-") || v.startsWith("'sha384-") || v.startsWith("'sha512-")
    );

    if (hasUnsafeInline && !hasNonceOrHash) {
      score -= 35;
      findings.push({
        directive: "script-src",
        severity: "critical",
        title: "Script execution allows 'unsafe-inline'",
        description: "'unsafe-inline' allows attackers to execute injected inline script tags and event handlers.",
        recommendation: "Adopt nonce-based CSP ('nonce-...') or hash-based CSP, and remove 'unsafe-inline'.",
      });
    }

    // 3. Check unsafe-eval
    if (scriptSrc.some((v) => v.toLowerCase() === "'unsafe-eval'")) {
      score -= 15;
      findings.push({
        directive: "script-src",
        severity: "high",
        title: "Allows 'unsafe-eval'",
        description: "Enables string-to-code execution APIs (eval, Function, setTimeout with strings).",
        recommendation: "Refactor code to remove dynamic string execution and drop 'unsafe-eval'.",
      });
    }

    // 4. Check Wildcard in scripts
    if (scriptSrc.some((v) => v === "*" || v === "https:" || v === "http:")) {
      score -= 25;
      findings.push({
        directive: "script-src",
        severity: "critical",
        title: "Wildcard source in script-src",
        description: "Scripts can be imported from any internet host (* or https:).",
        recommendation: "Limit scripts strictly to 'self' or explicit trusted CDN origins.",
      });
    }
  }

  // 5. Check object-src
  const objectSrc = dirMap.get("object-src") || defaultSrc;
  if (!objectSrc || (!objectSrc.includes("'none'") && !objectSrc.includes("none"))) {
    score -= 15;
    findings.push({
      directive: "object-src",
      severity: "high",
      title: "Missing object-src 'none'",
      description: "Plugins (Flash/Java/Silverlight) can be injected to bypass script restrictions.",
      recommendation: "Set 'object-src \\'none\\''.",
    });
  } else {
    findings.push({
      directive: "object-src",
      severity: "good",
      title: "object-src properly restricted",
      description: "Plugin execution is blocked.",
      recommendation: "Keep 'object-src \\'none\\''.",
    });
  }

  // 6. Check base-uri
  const baseUri = dirMap.get("base-uri");
  if (!baseUri || (!baseUri.includes("'none'") && !baseUri.includes("'self'"))) {
    score -= 10;
    findings.push({
      directive: "base-uri",
      severity: "medium",
      title: "Missing or loose base-uri",
      description: "Attackers can inject a <base> tag to redirect relative script imports to malicious servers.",
      recommendation: "Set 'base-uri \\'self\\'' or 'base-uri \\'none\\''.",
    });
  }

  // 7. Check frame-ancestors
  const frameAncestors = dirMap.get("frame-ancestors");
  if (!frameAncestors) {
    score -= 10;
    findings.push({
      directive: "frame-ancestors",
      severity: "medium",
      title: "Missing frame-ancestors",
      description: "Page may be vulnerable to clickjacking if not protected by X-Frame-Options.",
      recommendation: "Set 'frame-ancestors \\'none\\'' or 'frame-ancestors \\'self\\''.",
    });
  }

  score = Math.max(0, Math.min(100, score));
  const isEffectiveAgainstXss = !findings.some(
    (f) => f.severity === "critical" && f.directive === "script-src"
  );

  return {
    rawCsp: clean,
    directives,
    findings,
    isEffectiveAgainstXss,
    score,
  };
}

export interface ProcessInput {
  csp: string;
}

export async function process(input: ProcessInput): Promise<CspEvaluationResult> {
  return evaluateCsp(input.csp);
}
