import {
  ExtractedEndpoint,
  ExtractedCloudBucket,
  ExtractedParameter,
} from "./types";

const URL_REGEX =
  /(?:["'`])((?:https?:\/\/|\/api\/|\/v[0-9]\/|\/[a-zA-Z0-9_-]{2,}\/)[a-zA-Z0-9_\-./?%&=#~:@!$,;+*]+)(?:["'`])/g;

const S3_BUCKET_REGEX =
  /(?:https?:\/\/)?([a-z0-9.-]+)\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com|s3:\/\/([a-z0-9.-]+)/gi;

const GCS_BUCKET_REGEX =
  /(?:https?:\/\/)?storage\.googleapis\.com\/([a-z0-9.-]+)|gs:\/\/([a-z0-9.-]+)/gi;

const PARAM_REGEX = /(?:[?&])([a-zA-Z0-9_-]{2,})=(?:[^&#\s'"]*)/g;

const SOURCE_MAP_REGEX =
  /(?:\/\/#\s*sourceMappingURL=|\/\*#\s*sourceMappingURL=)\s*([^\s*]+)/gi;

const SENSITIVE_COMMENT_REGEX =
  /\/\/(?:[^\n]*(?:TODO|FIXME|HACK|BUG|DEPRECATED|SECURITY|AUTH|PASSWORD|SECRET)[^\n]*)/gi;

export function extractEndpoints(
  lines: string[]
): {
  endpoints: ExtractedEndpoint[];
  buckets: ExtractedCloudBucket[];
  parameters: ExtractedParameter[];
  sourceMaps: string[];
  comments: { text: string; line: number }[];
} {
  const seenEndpoints = new Set<string>();
  const endpoints: ExtractedEndpoint[] = [];

  const seenBuckets = new Set<string>();
  const buckets: ExtractedCloudBucket[] = [];

  const seenParams = new Set<string>();
  const parameters: ExtractedParameter[] = [];

  const seenSourceMaps = new Set<string>();
  const sourceMaps: string[] = [];

  const comments: { text: string; line: number }[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    // 1. Endpoints & URLs
    let match: RegExpExecArray | null;
    URL_REGEX.lastIndex = 0;
    while ((match = URL_REGEX.exec(line)) !== null) {
      const url = match[1];
      if (url && !seenEndpoints.has(url) && url.length > 3) {
        // filter out common file extension noise like images if just a path
        if (!/\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|ico)$/i.test(url)) {
          seenEndpoints.add(url);
          const type = url.startsWith("http")
            ? "absolute"
            : url.startsWith("/api")
            ? "api_path"
            : "relative";
          endpoints.push({ url, type, line: lineNum });
        }
      }
    }

    // 2. S3 Buckets
    S3_BUCKET_REGEX.lastIndex = 0;
    while ((match = S3_BUCKET_REGEX.exec(line)) !== null) {
      const bucketName = match[1] || match[2];
      if (bucketName && !seenBuckets.has(bucketName)) {
        seenBuckets.add(bucketName);
        buckets.push({ name: bucketName, provider: "aws_s3", line: lineNum });
      }
    }

    // 3. GCS Buckets
    GCS_BUCKET_REGEX.lastIndex = 0;
    while ((match = GCS_BUCKET_REGEX.exec(line)) !== null) {
      const bucketName = match[1] || match[2];
      if (bucketName && !seenBuckets.has(bucketName)) {
        seenBuckets.add(bucketName);
        buckets.push({
          name: bucketName,
          provider: "google_cloud_storage",
          line: lineNum,
        });
      }
    }

    // 4. URL Parameters
    PARAM_REGEX.lastIndex = 0;
    while ((match = PARAM_REGEX.exec(line)) !== null) {
      const paramName = match[1];
      if (paramName && !seenParams.has(paramName)) {
        seenParams.add(paramName);
        parameters.push({
          name: paramName,
          context: match[0],
          line: lineNum,
        });
      }
    }

    // 5. Source Maps
    SOURCE_MAP_REGEX.lastIndex = 0;
    while ((match = SOURCE_MAP_REGEX.exec(line)) !== null) {
      const mapUrl = match[1];
      if (mapUrl && !seenSourceMaps.has(mapUrl)) {
        seenSourceMaps.add(mapUrl);
        sourceMaps.push(mapUrl.replace(/\*\/$/, "").trim());
      }
    }

    // 6. Sensitive Comments
    SENSITIVE_COMMENT_REGEX.lastIndex = 0;
    while ((match = SENSITIVE_COMMENT_REGEX.exec(line)) !== null) {
      const comment = match[0].trim();
      if (comment.length > 5 && comments.length < 50) {
        comments.push({ text: comment, line: lineNum });
      }
    }
  }

  return { endpoints, buckets, parameters, sourceMaps, comments };
}
