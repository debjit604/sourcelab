import http from "http";
import https from "https";
import { isAllowedRequest } from "./url";

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  allowedContentTypes?: string[];
  userAgent?: string;
  method?: "GET" | "HEAD";
}

export interface SafeFetchResponse {
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string | string[] | undefined>;
  contentType: string;
  contentLength: number;
  body: Buffer;
  redirects: string[];
  pinnedIp: string;
}

const DEFAULT_USER_AGENT = "SourceLabBot/1.0 (+https://sourcelab.dev/bot)";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const DEFAULT_MAX_REDIRECTS = 5;

export async function safeFetch(
  targetUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResponse> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
  const method = options.method ?? "GET";

  let currentUrl = targetUrl;
  const redirectHistory: string[] = [];

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
    // 1. Full SSRF & IP Guard validation for EVERY hop
    const check = await isAllowedRequest(currentUrl);
    if (!check.allowed || !check.pinIp || !check.parsedUrl) {
      throw new Error(`SSRF Guard Blocked [${currentUrl}]: ${check.reason || "Forbidden destination"}`);
    }

    const parsed = check.parsedUrl;
    const isHttps = parsed.protocol === "https:";
    const pinnedIp = check.pinIp;
    const isIpv6 = pinnedIp.includes(":");
    const family = isIpv6 ? 6 : 4;

    // 2. Perform connection with IP Pinning to prevent TOCTOU DNS rebinding
    const response = await new Promise<{
      statusCode: number;
      statusMessage: string;
      headers: http.IncomingHttpHeaders;
      body: Buffer;
    }>((resolve, reject) => {
      let isSettled = false;
      const chunks: Buffer[] = [];
      let bytesReceived = 0;

      // Custom pinned lookup: forces socket to connect to verified pinnedIp
      const pinnedLookup = (
        _hostname: string,
        _options: unknown,
        cb: (err: Error | null, address: string, family: number) => void
      ) => {
        cb(null, pinnedIp, family);
      };

      const requestOptions: https.RequestOptions = {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: `${parsed.pathname}${parsed.search}`,
        method,
        lookup: pinnedLookup,
        headers: {
          Host: parsed.host,
          "User-Agent": userAgent,
          Accept: "*/*",
          "Accept-Encoding": "identity", // avoid gzip complexity in raw check
          Connection: "close",
        },
        timeout: timeoutMs,
      };

      if (isHttps) {
        requestOptions.servername = parsed.hostname; // SNI
      }

      const client = isHttps ? https : http;
      const req = client.request(requestOptions, (res) => {
        const contentLengthHeader = res.headers["content-length"];
        if (contentLengthHeader) {
          const declaredLen = parseInt(contentLengthHeader, 10);
          if (!isNaN(declaredLen) && declaredLen > maxBytes) {
            req.destroy();
            if (!isSettled) {
              isSettled = true;
              reject(new Error(`Response size ${declaredLen} exceeds maximum allowed limit of ${maxBytes} bytes`));
            }
            return;
          }
        }

        res.on("data", (chunk: Buffer) => {
          bytesReceived += chunk.length;
          if (bytesReceived > maxBytes) {
            req.destroy();
            if (!isSettled) {
              isSettled = true;
              reject(new Error(`Response exceeded maximum allowed size of ${maxBytes} bytes`));
            }
            return;
          }
          chunks.push(chunk);
        });

        res.on("end", () => {
          if (!isSettled) {
            isSettled = true;
            resolve({
              statusCode: res.statusCode || 200,
              statusMessage: res.statusMessage || "",
              headers: res.headers,
              body: Buffer.concat(chunks),
            });
          }
        });
      });

      req.on("timeout", () => {
        req.destroy();
        if (!isSettled) {
          isSettled = true;
          reject(new Error(`Request timed out after ${timeoutMs}ms`));
        }
      });

      req.on("error", (err) => {
        if (!isSettled) {
          isSettled = true;
          reject(err);
        }
      });

      req.end();
    });

    // 3. Handle redirects (301, 302, 303, 307, 308)
    const status = response.statusCode;
    if (status >= 300 && status < 400 && response.headers.location) {
      if (redirectCount === maxRedirects) {
        throw new Error(`Exceeded maximum redirect limit of ${maxRedirects}`);
      }

      const location = response.headers.location;
      const nextUrl = new URL(location, currentUrl).toString();
      redirectHistory.push(currentUrl);
      currentUrl = nextUrl;
      continue;
    }

    // 4. Content-Type check if allowlist provided
    const contentType = (response.headers["content-type"] || "").toLowerCase();
    if (options.allowedContentTypes && options.allowedContentTypes.length > 0) {
      const allowed = options.allowedContentTypes.some((act) => contentType.includes(act.toLowerCase()));
      if (!allowed) {
        throw new Error(`Content-Type '${contentType}' is not in the allowed list`);
      }
    }

    return {
      url: currentUrl,
      status: response.statusCode,
      statusText: response.statusMessage,
      headers: response.headers as Record<string, string | string[] | undefined>,
      contentType,
      contentLength: response.body.length,
      body: response.body,
      redirects: redirectHistory,
      pinnedIp,
    };
  }

  throw new Error(`Exceeded maximum redirect limit of ${maxRedirects}`);
}
