export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface SecretRule {
  id: string;
  name: string;
  category: string;
  regex: RegExp;
  severity: FindingSeverity;
  minEntropy?: number;
  description: string;
  verificationGuide: string;
}

export interface SecretFinding {
  id: string;
  ruleId: string;
  ruleName: string;
  category: string;
  severity: FindingSeverity;
  match: string;
  masked: string;
  line: number;
  column: number;
  entropy: number;
  description: string;
}

export interface ExtractedEndpoint {
  url: string;
  type: "relative" | "absolute" | "api_path";
  line: number;
}

export interface ExtractedCloudBucket {
  name: string;
  provider: "aws_s3" | "google_cloud_storage" | "azure_blob";
  line: number;
}

export interface ExtractedParameter {
  name: string;
  context: string;
  line: number;
}

export interface AnalysisSummary {
  findings: SecretFinding[];
  endpoints: ExtractedEndpoint[];
  parameters: ExtractedParameter[];
  buckets: ExtractedCloudBucket[];
  sourceMaps: string[];
  comments: { text: string; line: number }[];
  scannedLines: number;
  scannedBytes: number;
}
