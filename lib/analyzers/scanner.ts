import { SECRET_RULES } from "./rules";
import { calculateShannonEntropy, maskSecret } from "./entropy";
import { extractEndpoints } from "./endpoints";
import { AnalysisSummary, SecretFinding } from "./types";

export function scanSource(sourceText: string): AnalysisSummary {
  if (!sourceText) {
    return {
      findings: [],
      endpoints: [],
      parameters: [],
      buckets: [],
      sourceMaps: [],
      comments: [],
      scannedLines: 0,
      scannedBytes: 0,
    };
  }

  const lines = sourceText.split(/\r?\n/);
  const findings: SecretFinding[] = [];
  const seenSecretKeys = new Set<string>();

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    for (const rule of SECRET_RULES) {
      rule.regex.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.regex.exec(line)) !== null) {
        // match[1] is captured group if present (e.g. for generic high-entropy), else match[0]
        const matchedSecret = match[1] || match[0];
        const col = match.index + 1;

        // Entropy gate
        const entropy = calculateShannonEntropy(matchedSecret);
        if (rule.minEntropy && entropy < rule.minEntropy) {
          continue;
        }

        const dedupeKey = `${rule.id}:${matchedSecret}`;
        if (seenSecretKeys.has(dedupeKey)) {
          continue;
        }
        seenSecretKeys.add(dedupeKey);

        findings.push({
          id: `${rule.id}-${lineNum}-${col}`,
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          match: matchedSecret,
          masked: maskSecret(matchedSecret),
          line: lineNum,
          column: col,
          entropy,
          description: rule.description,
        });
      }
    }
  }

  // Extract Endpoints, Buckets, Params, Source Maps, and Comments
  const extracted = extractEndpoints(lines);

  return {
    findings,
    endpoints: extracted.endpoints,
    parameters: extracted.parameters,
    buckets: extracted.buckets,
    sourceMaps: extracted.sourceMaps,
    comments: extracted.comments,
    scannedLines: lines.length,
    scannedBytes: sourceText.length,
  };
}
