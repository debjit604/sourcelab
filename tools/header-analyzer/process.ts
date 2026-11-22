export type HeaderStatus = "pass" | "warn" | "fail";

export interface HeaderCheckItem {
  header: string;
  value: string | null;
  status: HeaderStatus;
  title: string;
  finding: string;
  recommendation: string;
}

export interface HeaderAnalysisResult {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  color: string;
  checks: HeaderCheckItem[];
  infoLeaks: { header: string; value: string }[];
  totalParsedHeaders: number;
}

export function parseRawHeaders(rawHeaders: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const lines = rawHeaders.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("HTTP/")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx > 0) {
      const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
      const val = trimmed.slice(colonIdx + 1).trim();
      headers[key] = val;
    }
  }

  return headers;
}

export function analyzeHeaders(rawHeaders: string): HeaderAnalysisResult {
  const headers = parseRawHeaders(rawHeaders);
  const checks: HeaderCheckItem[] = [];
  const infoLeaks: { header: string; value: string }[] = [];
  let score = 100;

  // 1. Content-Security-Policy (CSP)
  const csp = headers["content-security-policy"];
  if (csp) {
    checks.push({
      header: "Content-Security-Policy",
      value: csp,
      status: "pass",
      title: "Content Security Policy Present",
      finding: "CSP protects against Cross-Site Scripting (XSS) and code injection.",
      recommendation: "Ensure script-src and object-src don't allow 'unsafe-inline' or wildcard sources.",
    });
  } else {
    score -= 25;
    checks.push({
      header: "Content-Security-Policy",
      value: null,
      status: "fail",
      title: "Missing Content Security Policy (CSP)",
      finding: "No CSP header detected. High exposure to XSS and data exfiltration.",
      recommendation: "Add 'Content-Security-Policy: default-src \\'self\\'; script-src \\'self\\'; object-src \\'none\\';'.",
    });
  }

  // 2. Strict-Transport-Security (HSTS)
  const hsts = headers["strict-transport-security"];
  if (hsts) {
    const hasLongAge = /max-age=(\d+)/i.exec(hsts);
    const maxAgeVal = hasLongAge ? parseInt(hasLongAge[1], 10) : 0;
    if (maxAgeVal >= 31536000) {
      checks.push({
        header: "Strict-Transport-Security",
        value: hsts,
        status: "pass",
        title: "Strong HSTS Configuration",
        finding: `HSTS enforced for at least 1 year (max-age=${maxAgeVal}s).`,
        recommendation: "Consider adding 'preload' and 'includeSubDomains' once fully verified.",
      });
    } else {
      score -= 10;
      checks.push({
        header: "Strict-Transport-Security",
        value: hsts,
        status: "warn",
        title: "Short HSTS Duration",
        finding: `HSTS max-age is ${maxAgeVal}s, below the recommended 1 year (31536000s).`,
        recommendation: "Increase max-age to 31536000 (1 year).",
      });
    }
  } else {
    score -= 20;
    checks.push({
      header: "Strict-Transport-Security",
      value: null,
      status: "fail",
      title: "Missing HSTS Header",
      finding: "Users are vulnerable to SSL-stripping and man-in-the-middle attacks.",
      recommendation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains'.",
    });
  }

  // 3. X-Frame-Options
  const xfo = headers["x-frame-options"];
  if (xfo && (xfo.toUpperCase() === "DENY" || xfo.toUpperCase() === "SAMEORIGIN")) {
    checks.push({
      header: "X-Frame-Options",
      value: xfo,
      status: "pass",
      title: "Clickjacking Protection Enabled",
      finding: `Framing restricted to ${xfo.toUpperCase()}.`,
      recommendation: "Pair with CSP 'frame-ancestors' for modern browser compliance.",
    });
  } else {
    score -= 15;
    checks.push({
      header: "X-Frame-Options",
      value: xfo || null,
      status: "fail",
      title: "Missing or Ineffective Clickjacking Protection",
      finding: "Pages can potentially be embedded inside malicious third-party iframes.",
      recommendation: "Set 'X-Frame-Options: DENY' or 'SAMEORIGIN'.",
    });
  }

  // 4. X-Content-Type-Options
  const xcto = headers["x-content-type-options"];
  if (xcto && xcto.toLowerCase() === "nosniff") {
    checks.push({
      header: "X-Content-Type-Options",
      value: xcto,
      status: "pass",
      title: "MIME Sniffing Prevention Active",
      finding: "Browsers are prevented from MIME-type sniffing executable content.",
      recommendation: "Keep 'X-Content-Type-Options: nosniff' enabled.",
    });
  } else {
    score -= 10;
    checks.push({
      header: "X-Content-Type-Options",
      value: xcto || null,
      status: "fail",
      title: "Missing X-Content-Type-Options",
      finding: "Browsers may execute uploaded non-script files (images/text) as scripts.",
      recommendation: "Add 'X-Content-Type-Options: nosniff'.",
    });
  }

  // 5. Referrer-Policy
  const rp = headers["referrer-policy"];
  if (rp) {
    checks.push({
      header: "Referrer-Policy",
      value: rp,
      status: "pass",
      title: "Referrer Policy Configured",
      finding: `Referrer policy set to '${rp}'.`,
      recommendation: "Recommended setting: 'strict-origin-when-cross-origin' or 'no-referrer'.",
    });
  } else {
    score -= 10;
    checks.push({
      header: "Referrer-Policy",
      value: null,
      status: "warn",
      title: "Missing Referrer-Policy",
      finding: "URL paths and query tokens may leak in the Referer header to external origins.",
      recommendation: "Add 'Referrer-Policy: strict-origin-when-cross-origin'.",
    });
  }

  // 6. Information Leaks (Server, X-Powered-By, X-AspNet-Version)
  const leakHeaders = ["server", "x-powered-by", "x-aspnet-version", "x-generator"];
  for (const lh of leakHeaders) {
    if (headers[lh]) {
      score -= 5;
      infoLeaks.push({ header: lh, value: headers[lh] });
    }
  }

  score = Math.max(0, Math.min(100, score));

  let grade: "A+" | "A" | "B" | "C" | "D" | "F" = "F";
  let color = "#F87171";

  if (score >= 95) {
    grade = "A+";
    color = "#34D399";
  } else if (score >= 85) {
    grade = "A";
    color = "#34D399";
  } else if (score >= 70) {
    grade = "B";
    color = "#22D3EE";
  } else if (score >= 50) {
    grade = "C";
    color = "#FBBF24";
  } else if (score >= 35) {
    grade = "D";
    color = "#FB923C";
  } else {
    grade = "F";
    color = "#F87171";
  }

  return {
    score,
    grade,
    color,
    checks,
    infoLeaks,
    totalParsedHeaders: Object.keys(headers).length,
  };
}

export interface ProcessInput {
  headers: string;
}

export async function process(input: ProcessInput): Promise<HeaderAnalysisResult> {
  if (!input.headers || !input.headers.trim()) {
    throw new Error("HTTP response headers paste karo");
  }
  return analyzeHeaders(input.headers);
}
