import { scanSource, SecretFinding, AnalysisSummary } from "../../../../lib/analyzers";
import { SnapshotAsset, SourceMapRef } from "../snapshot/types";

export interface FileAnalysisFinding {
  file: string;
  url: string;
  isMap: boolean;
  finding: SecretFinding;
}

export interface FileEndpoints {
  file: string;
  url: string;
  endpoints: string[];
}

export interface AssetAnalysisSummary {
  filesScanned: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  findings: FileAnalysisFinding[];
  endpoints: FileEndpoints[];
  cloudBuckets: Array<{ file: string; bucket: string }>;
  parameters: Array<{ file: string; parameter: string }>;
  exposedSourceMaps: Array<{ sourceUrl: string; mapUrl: string }>;
  disclaimer: string;
}

export function analyzeDownloadedAssets(
  assets: SnapshotAsset[],
  sourceMaps: SourceMapRef[] = []
): AssetAnalysisSummary {
  const findings: FileAnalysisFinding[] = [];
  const allEndpoints: FileEndpoints[] = [];
  const cloudBuckets: Array<{ file: string; bucket: string }> = [];
  const parameters: Array<{ file: string; parameter: string }> = [];

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let filesScanned = 0;

  // 1. Scan all JS and Source Map assets
  for (const asset of assets) {
    if (asset.folder !== "js") continue;

    filesScanned++;
    const isMap = asset.filename.endsWith(".map");
    const content = asset.data.toString("utf-8");

    let scanRes: AnalysisSummary;
    try {
      scanRes = scanSource(content);
    } catch {
      continue;
    }

    // Accumulate findings with masked snippets
    for (const f of scanRes.findings) {
      if (f.severity === "critical") criticalCount++;
      else if (f.severity === "high") highCount++;
      else if (f.severity === "medium") mediumCount++;
      else lowCount++;

      findings.push({
        file: asset.filename,
        url: asset.url,
        isMap,
        finding: f,
      });
    }

    if (scanRes.endpoints.length > 0) {
      allEndpoints.push({
        file: asset.filename,
        url: asset.url,
        endpoints: scanRes.endpoints.map((e) => e.url),
      });
    }

    for (const b of scanRes.buckets) {
      cloudBuckets.push({ file: asset.filename, bucket: b.name });
    }

    for (const p of scanRes.parameters) {
      parameters.push({ file: asset.filename, parameter: p.name });
    }
  }

  // 2. Format exposed source maps
  const exposedSourceMaps = sourceMaps.map((sm) => ({
    sourceUrl: sm.sourceUrl,
    mapUrl: sm.mapUrl,
  }));

  return {
    filesScanned,
    totalFindings: findings.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    findings,
    endpoints: allEndpoints,
    cloudBuckets,
    parameters,
    exposedSourceMaps,
    disclaimer: "Possible secrets found in client-side code. Never test or validate credentials against remote providers. Use only for authorized security audits.",
  };
}
