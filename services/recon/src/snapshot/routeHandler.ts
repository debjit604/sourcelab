import { isAllowedRequest } from "../guard/url";
import { safeFetch, SafeFetchResponse } from "../guard/fetch";

export interface PlaywrightRoute {
  request: () => { url: () => string; method?: () => string; headers?: () => Record<string, string> };
  continue: () => Promise<void>;
  abort: (errorCode?: string) => Promise<void>;
  fulfill: (response: {
    status?: number;
    headers?: Record<string, string>;
    body?: Buffer | string;
    contentType?: string;
  }) => Promise<void>;
}

export interface RouteHandlerOptions {
  pinnedHosts?: Record<string, string>;
  fulfillThroughSafeFetch?: boolean;
  safeFetchFn?: (url: string, opts?: unknown) => Promise<SafeFetchResponse>;
}

const ALLOWED_DATA_PREFIXES = ["data:image/", "data:font/", "data:application/font"];

export async function handleBrowserRoute(
  route: PlaywrightRoute,
  options: RouteHandlerOptions = {}
): Promise<void> {
  const reqUrl = route.request().url();

  // 1. Parse and validate protocol scheme
  let parsed: URL;
  try {
    parsed = new URL(reqUrl);
  } catch {
    return route.abort("blockedbyclient");
  }

  // 2. Data URL handling: strictly limit to images and fonts (no data:text/html or scripts)
  if (parsed.protocol === "data:") {
    const isAllowedData = ALLOWED_DATA_PREFIXES.some((prefix) => reqUrl.startsWith(prefix));
    if (isAllowedData) {
      return route.continue();
    }
    // Abort data:text/html, data:javascript, etc.
    return route.abort("blockedbyclient");
  }

  // 3. Strict protocol allowlist: reject ws:, wss:, ftp:, gopher:, blob:, file:, javascript:, etc.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return route.abort("blockedbyclient");
  }

  // 4. SSRF & Rebinding check
  const check = await isAllowedRequest(reqUrl);
  if (!check.allowed || !check.pinIp) {
    return route.abort("blockedbyclient");
  }

  // 5. Check if hostname is pinned and matches pre-resolved IP (DNS Rebinding Defense)
  if (options.pinnedHosts && options.pinnedHosts[parsed.hostname]) {
    const expectedIp = options.pinnedHosts[parsed.hostname];
    if (check.pinIp !== expectedIp) {
      // Rebinding detected: hostname now resolves to a different IP!
      return route.abort("blockedbyclient");
    }
  }

  // 6. Safe fulfillment: route through safeFetch so Chromium never performs independent DNS/socket calls
  if (options.fulfillThroughSafeFetch) {
    try {
      const fetchImpl = options.safeFetchFn || safeFetch;
      const res = await fetchImpl(reqUrl);
      const headers: Record<string, string> = {};
      for (const [k, v] of Object.entries(res.headers)) {
        if (typeof v === "string") headers[k] = v;
        else if (Array.isArray(v)) headers[k] = v.join(", ");
      }

      return await route.fulfill({
        status: res.status,
        headers,
        body: res.body,
        contentType: res.contentType,
      });
    } catch {
      return route.abort("blockedbyclient");
    }
  }

  return route.continue();
}
