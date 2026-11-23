export interface SnapshotOptions {
  depth?: number;
  maxPages?: number;
  includeMobile?: boolean;
}

export interface SnapshotManifest {
  jobId: string;
  targetUrl: string;
  timestamp: string;
  pagesVisited: string[];
  filesCount: number;
  files: Array<{
    id: string;
    filename: string;
    folder: string;
    size: number;
    url: string;
  }>;
  screenshots: {
    hasDesktop: boolean;
    hasMobile: boolean;
  };
  dns?: {
    records: Record<string, string[]>;
    dohResolver?: string;
  };
  emailSecurity?: {
    spf: { present: boolean; raw?: string; status: string };
    dmarc: { present: boolean; raw?: string; status: string };
  };
  subdomains?: Array<{ name: string; ip: string; cname?: string }>;
  ssl?: {
    valid: boolean;
    subject?: string;
    issuer?: string;
    validTo?: string;
    daysRemaining?: number;
  };
  seo?: {
    score: number;
    title?: string;
    description?: string;
    h1?: string[];
    viewport: boolean;
    https: boolean;
  };
  contacts?: {
    emails: string[];
    phones: string[];
  };
  patterns?: {
    apiEndpoints: string[];
  };
  hiddenPaths?: Array<{
    path: string;
    status: number;
    exposed: boolean;
    category: string;
  }>;
  jsAnalysis?: {
    findings: Array<{
      ruleId: string;
      ruleName: string;
      severity: string;
      maskedSnippet: string;
      line: number;
    }>;
    endpoints: string[];
    parameters: string[];
  };
}

export function getReconApiBase(): string {
  if (typeof window !== "undefined") {
    // If configured via environment
    if (process.env.NEXT_PUBLIC_RECON_URL) {
      return process.env.NEXT_PUBLIC_RECON_URL.replace(/\/$/, "");
    }
  }
  return "http://localhost:4000";
}

export async function createSnapshotJob(
  targetUrl: string,
  turnstileToken?: string,
  options?: SnapshotOptions,
  apiBase: string = getReconApiBase()
): Promise<{ jobId: string; status: string; expiresAt: number }> {
  const res = await fetch(`${apiBase}/snapshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: JSON.stringify({
      url: targetUrl,
      turnstileToken,
      options,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(errorBody.error || `Scan request failed with HTTP ${res.status}`);
  }

  return res.json();
}

export async function checkJobStatus(
  jobId: string,
  apiBase: string = getReconApiBase()
): Promise<{ status: string; progressPercent: number; error?: string }> {
  const res = await fetch(`${apiBase}/snapshot/${jobId}/status`);
  if (!res.ok) {
    throw new Error(`Failed to query job status (${res.status})`);
  }
  return res.json();
}

export async function fetchJobManifest(
  jobId: string,
  apiBase: string = getReconApiBase()
): Promise<SnapshotManifest> {
  const res = await fetch(`${apiBase}/snapshot/${jobId}/manifest`);
  if (!res.ok) {
    throw new Error(`Failed to load scan manifest (${res.status})`);
  }
  return res.json();
}

export function getScreenshotApiUrl(
  jobId: string,
  view: "desktop" | "mobile" = "desktop",
  apiBase: string = getReconApiBase()
): string {
  return `${apiBase}/snapshot/${jobId}/screenshot?view=${view}`;
}

export function getFileApiUrl(
  jobId: string,
  fileId: string,
  apiBase: string = getReconApiBase()
): string {
  return `${apiBase}/snapshot/${jobId}/file/${fileId}`;
}

export function getZipApiUrl(jobId: string, apiBase: string = getReconApiBase()): string {
  return `${apiBase}/snapshot/${jobId}/zip`;
}

export function generateMarkdownReport(manifest: SnapshotManifest): string {
  const lines: string[] = [];
  lines.push(`# SourceLab Recon Audit Report: ${manifest.targetUrl}`);
  lines.push(`- **Scan Timestamp:** ${manifest.timestamp}`);
  lines.push(`- **Job ID:** \`${manifest.jobId}\``);
  lines.push(`- **Pages Visited:** ${manifest.pagesVisited?.length || 1}`);
  lines.push(`- **Total Assets Captured:** ${manifest.filesCount || 0}`);
  lines.push("");

  if (manifest.seo) {
    lines.push(`## SEO & Core Web Vitals Audit (Score: ${manifest.seo.score}/100)`);
    lines.push(`- Title: ${manifest.seo.title || "None"}`);
    lines.push(`- Meta Description: ${manifest.seo.description || "None"}`);
    lines.push(`- Viewport Meta: ${manifest.seo.viewport ? "Configured" : "Missing"}`);
    lines.push(`- HTTPS: ${manifest.seo.https ? "Enforced" : "Not Enforced"}`);
    lines.push("");
  }

  if (manifest.emailSecurity) {
    lines.push(`## Email Security & Spoofing Defense`);
    lines.push(`- **SPF:** ${manifest.emailSecurity.spf.status} (\`${manifest.emailSecurity.spf.raw || "None"}\`)`);
    lines.push(`- **DMARC:** ${manifest.emailSecurity.dmarc.status} (\`${manifest.emailSecurity.dmarc.raw || "None"}\`)`);
    lines.push("");
  }

  if (manifest.ssl) {
    lines.push(`## SSL/TLS Certificate`);
    lines.push(`- **Subject:** ${manifest.ssl.subject || "Unknown"}`);
    lines.push(`- **Issuer:** ${manifest.ssl.issuer || "Unknown"}`);
    lines.push(`- **Expiry:** ${manifest.ssl.validTo || "Unknown"} (${manifest.ssl.daysRemaining ?? 0} days remaining)`);
    lines.push("");
  }

  if (manifest.hiddenPaths && manifest.hiddenPaths.length > 0) {
    lines.push(`## Exposed Sensitive Paths (${manifest.hiddenPaths.length} discovered)`);
    lines.push(`| Path | Status | Category |`);
    lines.push(`| :--- | :--- | :--- |`);
    for (const hp of manifest.hiddenPaths) {
      lines.push(`| \`${hp.path}\` | HTTP ${hp.status} | ${hp.category} |`);
    }
    lines.push("");
  }

  if (manifest.jsAnalysis?.findings && manifest.jsAnalysis.findings.length > 0) {
    lines.push(`## JavaScript Security Findings (${manifest.jsAnalysis.findings.length})`);
    lines.push(`| Rule | Severity | Snippet | Line |`);
    lines.push(`| :--- | :--- | :--- | :--- |`);
    for (const f of manifest.jsAnalysis.findings) {
      lines.push(`| ${f.ruleName} | ${f.severity} | \`${f.maskedSnippet}\` | ${f.line} |`);
    }
    lines.push("");
  }

  lines.push(`---`);
  lines.push(`*Generated securely by SourceLab Website Snapshot Suite*`);
  return lines.join("\n");
}
