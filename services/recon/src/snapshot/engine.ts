import { safeFetch } from "../guard/fetch";
import { isAllowedRequest } from "../guard/url";
import { categorizeAsset, extractSourceMapUrl } from "./classifier";
import { handleBrowserRoute, PlaywrightRoute } from "./routeHandler";
import { SnapshotAsset, SnapshotJobOptions, SnapshotResult, SourceMapRef } from "./types";

const MAX_FILES = 200;
const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const DEFAULT_TIMEOUT_MS = 30_000;

interface PlaywrightPage {
  goto: (url: string, options?: Record<string, unknown>) => Promise<unknown>;
  content: () => Promise<string>;
  setViewportSize: (size: { width: number; height: number }) => Promise<void>;
  screenshot: (options?: Record<string, unknown>) => Promise<Buffer>;
  close: () => Promise<void>;
}

interface PlaywrightContext {
  route: (urlPattern: string, handler: (route: PlaywrightRoute) => Promise<void>) => Promise<void>;
  newPage: () => Promise<PlaywrightPage>;
  close: () => Promise<void>;
}

interface PlaywrightBrowser {
  newContext: (options?: Record<string, unknown>) => Promise<PlaywrightContext>;
  close: () => Promise<void>;
}

export async function runSnapshot(options: SnapshotJobOptions): Promise<SnapshotResult> {
  const startTime = Date.now();
  const timeoutMs = options.jobTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  const targetUrl = options.url;
  const maxPages = Math.min(options.maxPages ?? 25, 25);
  const maxDepth = Math.min(options.maxDepth ?? 2, 2);

  // Initial SSRF Check
  const initialCheck = await isAllowedRequest(targetUrl);
  if (!initialCheck.allowed) {
    throw new Error(`SSRF Guard Blocked [${targetUrl}]: ${initialCheck.reason}`);
  }

  const targetOrigin = new URL(targetUrl).origin;
  const assets: SnapshotAsset[] = [];
  const sourceMaps: SourceMapRef[] = [];
  const pagesVisited: string[] = [];
  const discoveredAssetUrls = new Set<string>();
  const visitedPageUrls = new Set<string>();
  let totalAssetBytes = 0;

  let rawHtml = "";
  let renderedDom = "";
  const screenshots: { desktop?: Buffer; mobile?: Buffer } = {};

  // Execute snapshot within a strict 30s hard timeout
  const snapshotPromise = (async () => {
    // 1. Fetch raw HTML directly via safeFetch
    try {
      const rawRes = await safeFetch(targetUrl, { timeoutMs: 10_000, maxBytes: MAX_FILE_BYTES });
      rawHtml = rawRes.body.toString("utf-8");
      renderedDom = rawHtml;
      pagesVisited.push(targetUrl);
      visitedPageUrls.add(targetUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to fetch target URL: ${msg}`);
    }

    // 2. Headless Browser (Playwright Chromium) if available
    let browser: PlaywrightBrowser | null = null;
    try {
      // Dynamic import with variable to prevent Vite static analysis failure in non-browser test runs
      const pwPkg = "playwright";
      const pw = await import(/* @vite-ignore */ pwPkg).catch(() => null);
      if (pw && pw.chromium) {
        const targetHost = new URL(targetUrl).hostname;
        browser = (await pw.chromium.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            `--host-resolver-rules=MAP ${targetHost} ${initialCheck.pinIp}`,
          ],
        })) as unknown as PlaywrightBrowser;

        // Desktop screenshot context
        const desktopContext = await browser.newContext({
          viewport: { width: 1366, height: 768 },
          userAgent: "SourceLabBot/1.0 (+https://sourcelab.dev/bot)",
          acceptDownloads: false,
        });

        // Intercept every subresource through hardened SSRF & DNS-rebinding guard
        await desktopContext.route("**/*", (route: PlaywrightRoute) =>
          handleBrowserRoute(route, {
            pinnedHosts: { [targetHost]: initialCheck.pinIp! },
            fulfillThroughSafeFetch: true,
          })
        );

        const desktopPage = await desktopContext.newPage();
        await desktopPage.goto(targetUrl, { waitUntil: "networkidle", timeout: 15_000 }).catch(() => {});
        renderedDom = await desktopPage.content().catch(() => rawHtml);

        if (options.captureScreenshots !== false) {
          screenshots.desktop = await desktopPage.screenshot({ fullPage: true, type: "png" }).catch(() => undefined);

          // Mobile screenshot
          const mobilePage = await desktopContext.newPage();
          await mobilePage.setViewportSize({ width: 390, height: 844 });
          await mobilePage.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 12_000 }).catch(() => {});
          screenshots.mobile = await mobilePage.screenshot({ fullPage: true, type: "png" }).catch(() => undefined);
          await mobilePage.close().catch(() => {});
        }

        await desktopPage.close().catch(() => {});
        await desktopContext.close().catch(() => {});
      }
    } catch {
      // If headless browser fails or is not installed in local environment, keep raw HTML
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }

    // 3. Extract linked asset URLs from rendered DOM & raw HTML
    const domToSearch = renderedDom || rawHtml;
    const assetRegex = /(?:href|src|data-src|srcset)=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;

    while ((match = assetRegex.exec(domToSearch)) !== null) {
      const rawHref = match[1].split(" ")[0].trim(); // handle srcset
      if (!rawHref || rawHref.startsWith("data:") || rawHref.startsWith("javascript:") || rawHref.startsWith("#")) {
        continue;
      }

      try {
        const resolved = new URL(rawHref, targetUrl).toString();
        // Ignore external domains for heavy asset mirroring
        if (new URL(resolved).origin === targetOrigin) {
          discoveredAssetUrls.add(resolved);
        }
      } catch {
        // Skip invalid URLs
      }
    }

    // 4. Download linked assets through safeFetch with strict caps
    if (options.collectAssets !== false) {
      for (const assetUrl of Array.from(discoveredAssetUrls)) {
        if (assets.length >= MAX_FILES || totalAssetBytes >= MAX_TOTAL_BYTES) {
          break;
        }

        try {
          const res = await safeFetch(assetUrl, {
            timeoutMs: 5_000,
            maxBytes: MAX_FILE_BYTES,
          });

          if (totalAssetBytes + res.body.length > MAX_TOTAL_BYTES) break;

          const meta = categorizeAsset(assetUrl, res.contentType);
          assets.push({
            url: assetUrl,
            filename: meta.filename,
            folder: meta.folder,
            size: res.body.length,
            contentType: res.contentType,
            data: res.body,
          });
          totalAssetBytes += res.body.length;

          // Source Map detection for JS
          if (meta.folder === "js") {
            const jsText = res.body.toString("utf-8");
            const mapUrl = extractSourceMapUrl(jsText, assetUrl);
            if (mapUrl && !discoveredAssetUrls.has(mapUrl)) {
              sourceMaps.push({ sourceUrl: assetUrl, mapUrl });
              // Fetch source map if limits permit
              try {
                const mapRes = await safeFetch(mapUrl, { timeoutMs: 5_000, maxBytes: MAX_FILE_BYTES });
                const mapMeta = categorizeAsset(mapUrl, mapRes.contentType);
                assets.push({
                  url: mapUrl,
                  filename: mapMeta.filename,
                  folder: "js",
                  size: mapRes.body.length,
                  contentType: mapRes.contentType,
                  data: mapRes.body,
                });
                totalAssetBytes += mapRes.body.length;
              } catch {
                // Non-critical if map fetch fails
              }
            }
          }
        } catch {
          // Continue if individual asset fails
        }
      }
    }

    // 5. Shallow crawl for same-origin pages (max pages, max depth 2)
    if (options.crawlPages && maxDepth > 1) {
      const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi;
      const discoveredPages = new Set<string>();

      while ((match = linkRegex.exec(domToSearch)) !== null) {
        try {
          const pUrl = new URL(match[1], targetUrl);
          if (pUrl.origin === targetOrigin && !visitedPageUrls.has(pUrl.toString())) {
            discoveredPages.add(pUrl.toString());
          }
        } catch {}
      }

      for (const nextP of Array.from(discoveredPages)) {
        if (pagesVisited.length >= maxPages) break;
        try {
          visitedPageUrls.add(nextP);
          pagesVisited.push(nextP);
          // Polite delay between shallow crawl requests
          await new Promise((r) => setTimeout(r, 150));
        } catch {}
      }
    }

    return {
      targetUrl,
      rawHtml,
      renderedDom,
      screenshots,
      assets,
      pagesVisited,
      sourceMaps,
      durationMs: Date.now() - startTime,
    };
  })();

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Snapshot job timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  return Promise.race([snapshotPromise, timeoutPromise]);
}
