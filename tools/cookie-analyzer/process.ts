export interface ParsedCookie {
  name: string;
  value: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  path?: string;
  domain?: string;
  maxAge?: string;
  isSensitive: boolean;
  issues: { severity: "critical" | "high" | "medium" | "low"; message: string }[];
}

export interface CookieAnalysisResult {
  cookies: ParsedCookie[];
  totalCookies: number;
  secureCount: number;
  httpOnlyCount: number;
  sameSiteCount: number;
  criticalIssuesCount: number;
  score: number;
}

const SENSITIVE_NAMES = new Set([
  "session", "sessionid", "sid", "token", "jwt", "auth", "phpsessid",
  "jsessionid", "connect.sid", "remember_me", "user_session", "id_token"
]);

export function parseCookieString(rawInput: string): ParsedCookie[] {
  const lines = rawInput.split(/\r?\n/);
  const cookies: ParsedCookie[] = [];

  for (const line of lines) {
    let cleanLine = line.trim();
    if (!cleanLine) continue;

    // Remove Set-Cookie: prefix if present
    cleanLine = cleanLine.replace(/^Set-Cookie:\s*/i, "").trim();

    const parts = cleanLine.split(";").map((p) => p.trim());
    if (!parts.length) continue;

    // First part is name=value
    const firstPart = parts[0];
    const eqIdx = firstPart.indexOf("=");
    if (eqIdx <= 0) continue;

    const name = firstPart.slice(0, eqIdx).trim();
    const value = firstPart.slice(eqIdx + 1).trim();

    let secure = false;
    let httpOnly = false;
    let sameSite: "Strict" | "Lax" | "None" | undefined = undefined;
    let path: string | undefined = undefined;
    let domain: string | undefined = undefined;
    let maxAge: string | undefined = undefined;

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const partLower = part.toLowerCase();

      if (partLower === "secure") {
        secure = true;
      } else if (partLower === "httponly") {
        httpOnly = true;
      } else if (partLower.startsWith("samesite=")) {
        const val = part.split("=")[1]?.trim().toLowerCase();
        if (val === "strict") sameSite = "Strict";
        else if (val === "lax") sameSite = "Lax";
        else if (val === "none") sameSite = "None";
      } else if (partLower.startsWith("path=")) {
        path = part.split("=")[1]?.trim();
      } else if (partLower.startsWith("domain=")) {
        domain = part.split("=")[1]?.trim();
      } else if (partLower.startsWith("max-age=") || partLower.startsWith("expires=")) {
        maxAge = part;
      }
    }

    const lowerName = name.toLowerCase();
    const isSensitive =
      SENSITIVE_NAMES.has(lowerName) ||
      lowerName.includes("session") ||
      lowerName.includes("token") ||
      lowerName.includes("auth");

    const issues: { severity: "critical" | "high" | "medium" | "low"; message: string }[] = [];

    if (!httpOnly) {
      if (isSensitive) {
        issues.push({
          severity: "critical",
          message: "Missing HttpOnly flag on sensitive session cookie. Vulnerable to theft via XSS.",
        });
      } else {
        issues.push({
          severity: "medium",
          message: "Missing HttpOnly flag. Cookie can be read by client scripts.",
        });
      }
    }

    if (!secure) {
      issues.push({
        severity: "high",
        message: "Missing Secure flag. Transmitted in plaintext over insecure HTTP connections.",
      });
    }

    if (!sameSite) {
      issues.push({
        severity: "medium",
        message: "Missing SameSite attribute. Susceptible to Cross-Site Request Forgery (CSRF).",
      });
    } else if (sameSite === "None" && !secure) {
      issues.push({
        severity: "critical",
        message: "SameSite=None must be paired with Secure flag, otherwise rejected by modern browsers.",
      });
    }

    cookies.push({
      name,
      value,
      secure,
      httpOnly,
      sameSite,
      path,
      domain,
      maxAge,
      isSensitive,
      issues,
    });
  }

  return cookies;
}

export function analyzeCookies(rawInput: string): CookieAnalysisResult {
  const cookies = parseCookieString(rawInput);
  if (!cookies.length) {
    return {
      cookies: [],
      totalCookies: 0,
      secureCount: 0,
      httpOnlyCount: 0,
      sameSiteCount: 0,
      criticalIssuesCount: 0,
      score: 100,
    };
  }

  let secureCount = 0;
  let httpOnlyCount = 0;
  let sameSiteCount = 0;
  let criticalIssuesCount = 0;
  let score = 100;

  for (const c of cookies) {
    if (c.secure) secureCount++;
    else score -= 15;

    if (c.httpOnly) httpOnlyCount++;
    else score -= c.isSensitive ? 25 : 10;

    if (c.sameSite) sameSiteCount++;
    else score -= 10;

    for (const issue of c.issues) {
      if (issue.severity === "critical") criticalIssuesCount++;
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    cookies,
    totalCookies: cookies.length,
    secureCount,
    httpOnlyCount,
    sameSiteCount,
    criticalIssuesCount,
    score,
  };
}

export interface ProcessInput {
  raw: string;
}

export async function process(input: ProcessInput): Promise<CookieAnalysisResult> {
  if (!input.raw || !input.raw.trim()) {
    throw new Error("Set-Cookie headers paste karo");
  }
  return analyzeCookies(input.raw);
}
