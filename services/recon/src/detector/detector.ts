import { safeFetch, SafeFetchResponse } from "../guard/fetch";
import { isAllowedRequest } from "../guard/url";
import { SENSITIVE_PATHS, SensitivePathDef } from "./config";

export interface DetectionResult {
  path: string;
  category: string;
  status: number;
  exposed: boolean;
  isSensitive: boolean;
  sizeBytes?: number;
  contentType?: string;
  description: string;
  note?: string;
}

export interface DetectorOptions {
  paths?: SensitivePathDef[];
  concurrency?: number; // default: 5
  delayMs?: number; // default: 50
  timeoutMs?: number; // default: 15_000 hard cap
  fetchFn?: (url: string, opts?: Record<string, unknown>) => Promise<SafeFetchResponse>;
}

const DEFAULT_CONCURRENCY = 5;
const DEFAULT_DELAY_MS = 50;
const HARD_TIMEOUT_MS = 15_000;

export async function detectHiddenPaths(
  targetOriginUrl: string,
  options: DetectorOptions = {}
): Promise<DetectionResult[]> {
  const originCheck = await isAllowedRequest(targetOriginUrl);
  if (!originCheck.allowed || !originCheck.parsedUrl) {
    throw new Error(`SSRF Guard Blocked [${targetOriginUrl}]: ${originCheck.reason}`);
  }

  const origin = originCheck.parsedUrl.origin;
  const pathsToCheck = options.paths || SENSITIVE_PATHS;
  const concurrency = Math.min(options.concurrency || DEFAULT_CONCURRENCY, 5);
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  const timeoutMs = options.timeoutMs ?? HARD_TIMEOUT_MS;
  const fetcher = options.fetchFn || safeFetch;

  const results: DetectionResult[] = [];

  const runDetection = async () => {
    let index = 0;

    const worker = async () => {
      while (index < pathsToCheck.length) {
        const currentPathDef = pathsToCheck[index++];
        if (!currentPathDef) break;

        const checkUrl = `${origin}${currentPathDef.path}`;

        try {
          // 1. Send single HEAD request first
          let res: SafeFetchResponse;
          try {
            res = await fetcher(checkUrl, { method: "HEAD", timeoutMs: 3_000 });
          } catch {
            // If server returns 405 Method Not Allowed or rejects HEAD, try lightweight GET
            res = await fetcher(checkUrl, { method: "GET", timeoutMs: 3_000, maxBytes: 1024 * 64 });
          }

          const status = res.status;
          const ct = (res.contentType || "").toLowerCase();
          const size = res.contentLength || 0;

          // 2. Classify status code and content-type
          let exposed = false;
          let note = "";

          if (status === 200 || status === 206) {
            // Soft-404 check: if a non-HTML file returns text/html, it is usually a SPA fallback
            const isHtml = ct.includes("text/html");
            const nonHtmlPath = !currentPathDef.path.endsWith(".html") && !currentPathDef.path.endsWith(".htm");

            if (isHtml && nonHtmlPath) {
              exposed = false;
              note = "Returned 200 with text/html (likely SPA or custom 404 fallback page)";
            } else if (size === 0) {
              exposed = false;
              note = "Empty response (0 bytes)";
            } else {
              exposed = true;
              note = "Potentially accessible (status 200 with valid content length)";
            }
          } else if (status === 403) {
            exposed = false;
            note = "Protected / Forbidden (HTTP 403)";
          } else if (status === 401) {
            exposed = false;
            note = "Authentication required (HTTP 401)";
          } else {
            exposed = false;
            note = `Not accessible (HTTP ${status})`;
          }

          results.push({
            path: currentPathDef.path,
            category: currentPathDef.category,
            status,
            exposed,
            isSensitive: currentPathDef.isSensitive,
            sizeBytes: size,
            contentType: ct,
            description: currentPathDef.description,
            note,
          });
        } catch {
          // Connection timeout or error
          results.push({
            path: currentPathDef.path,
            category: currentPathDef.category,
            status: 0,
            exposed: false,
            isSensitive: currentPathDef.isSensitive,
            description: currentPathDef.description,
            note: "Request failed or connection timed out",
          });
        }

        if (delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);

    // Sort: exposed items first, then by status
    return results.sort((a, b) => {
      if (a.exposed && !b.exposed) return -1;
      if (!a.exposed && b.exposed) return 1;
      return a.path.localeCompare(b.path);
    });
  };

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Hidden path detector exceeded hard limit of ${timeoutMs}ms`)), timeoutMs)
  );

  return Promise.race([runDetection(), timeoutPromise]);
}
