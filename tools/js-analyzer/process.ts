import {
  scanSource,
  AnalysisSummary,
  SecretFinding,
} from "@/lib/analyzers";

export function exportToJson(summary: AnalysisSummary): string {
  return JSON.stringify(summary, null, 2);
}

export function exportToCsv(findings: SecretFinding[]): string {
  const headers = ["ID", "Rule", "Category", "Severity", "Line", "Column", "Entropy", "Masked Match"];
  const rows = findings.map((f) => [
    `"${f.id}"`,
    `"${f.ruleName}"`,
    `"${f.category}"`,
    `"${f.severity}"`,
    f.line,
    f.column,
    f.entropy,
    `"${f.masked}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function exportToMarkdown(summary: AnalysisSummary, filename: string = "source.js"): string {
  const lines: string[] = [
    `# Security Analysis Report for \`${filename}\``,
    `\n**Scanned Lines:** ${summary.scannedLines} | **Scanned Size:** ${(summary.scannedBytes / 1024).toFixed(1)} KB`,
    `\n## Discovered Secrets & Tokens (${summary.findings.length})`,
  ];

  if (summary.findings.length === 0) {
    lines.push("\n*No sensitive hardcoded credentials identified.*");
  } else {
    lines.push("\n| Severity | Category | Rule | Location | Masked Snippet |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const f of summary.findings) {
      lines.push(
        `| **${f.severity.toUpperCase()}** | ${f.category} | ${f.ruleName} | Line ${f.line}:${f.column} | \`${f.masked}\` |`
      );
    }
  }

  lines.push(`\n## Discovered Endpoints (${summary.endpoints.length})`);
  if (summary.endpoints.length === 0) {
    lines.push("\n*No HTTP/API endpoints detected.*");
  } else {
    for (const ep of summary.endpoints.slice(0, 100)) {
      lines.push(`- \`${ep.url}\` *(Line ${ep.line})*`);
    }
    if (summary.endpoints.length > 100) {
      lines.push(`\n*... and ${summary.endpoints.length - 100} more endpoints.*`);
    }
  }

  if (summary.buckets.length > 0) {
    lines.push(`\n## Cloud Storage Buckets (${summary.buckets.length})`);
    for (const b of summary.buckets) {
      lines.push(`- **${b.provider}**: \`${b.name}\` *(Line ${b.line})*`);
    }
  }

  if (summary.sourceMaps.length > 0) {
    lines.push(`\n## Exposed Source Maps (${summary.sourceMaps.length})`);
    for (const sm of summary.sourceMaps) {
      lines.push(`- \`${sm}\``);
    }
  }

  return lines.join("\n");
}

export interface ProcessInput {
  content: string;
  filename?: string;
}

export interface ProcessResult {
  summary: AnalysisSummary;
  jsonExport: string;
  csvExport: string;
  markdownExport: string;
}

export async function process(input: ProcessInput): Promise<ProcessResult> {
  const content = input.content;
  if (!content || !content.trim()) {
    throw new Error("Input JavaScript/Source file khali hai");
  }

  const summary = scanSource(content);
  const filename = input.filename || "source.js";

  return {
    summary,
    jsonExport: exportToJson(summary),
    csvExport: exportToCsv(summary.findings),
    markdownExport: exportToMarkdown(summary, filename),
  };
}
