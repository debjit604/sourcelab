import http from "http";
import { jobStore, ReconJob } from "../store/jobStore";
import { createJobZipArchive } from "../store/zipStream";
import { validateTargetUrl } from "../guard/url";
import { runSnapshot } from "../snapshot/engine";
import { runPassiveRecon } from "../passive";
import { detectHiddenPaths } from "../detector";
import { analyzeDownloadedAssets } from "../analyzer";
import { checkSnapshotAbuse, globalConcurrency } from "../abuse";

export interface ServerOptions {
  turnstileSecret?: string;
  allowedOrigins?: string[];
}

export function handleApiRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  options: ServerOptions = {}
): void {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const method = req.method || "GET";

  // CORS headers
  const origin = req.headers.origin;
  const allowed = !options.allowedOrigins || (origin && options.allowedOrigins.includes(origin));
  if (allowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Turnstile-Token");
  }

  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 1. Health check
  if (pathname === "/health" && method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  // Helper JSON sender
  const sendJson = (status: number, data: unknown) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = status;
    res.end(JSON.stringify(data));
  };

  // 2. POST /snapshot -> create job
  if (pathname === "/snapshot" && method === "POST") {
    let bodyText = "";
    req.on("data", (chunk: Buffer) => {
      bodyText += chunk.toString("utf-8");
      if (bodyText.length > 64 * 1024) req.destroy();
    });

    req.on("end", async () => {
      let body: { url?: string; turnstileToken?: string; options?: Record<string, unknown> } = {};
      try {
        body = JSON.parse(bodyText);
      } catch {
        sendJson(400, { error: "Invalid JSON payload" });
        return;
      }

      const targetUrl = (body.url || "").trim();
      const val = validateTargetUrl(targetUrl);
      if (!val.valid) {
        sendJson(400, { error: val.error });
        return;
      }

      const turnstileToken =
        body.turnstileToken ||
        (req.headers["x-turnstile-token"] as string | undefined);

      const abuseResult = await checkSnapshotAbuse(
        req,
        targetUrl,
        turnstileToken,
        options.turnstileSecret
      );
      if (!abuseResult.allowed) {
        if (abuseResult.headers) {
          for (const [k, v] of Object.entries(abuseResult.headers)) {
            res.setHeader(k, v);
          }
        }
        sendJson(abuseResult.status || 403, { error: abuseResult.error });
        return;
      }

      const job = jobStore.createJob(targetUrl);

      // Launch async processing worker
      executeReconJob(job, body.options).catch((err: unknown) => {
        jobStore.updateStatus(job.id, "failed", 100, err instanceof Error ? err.message : String(err));
      });

      sendJson(202, {
        jobId: job.id,
        status: job.status,
        expiresAt: job.expiresAt,
      });
      return;
    });
    return;
  }

  // 3. GET /snapshot/:id/status
  const statusMatch = pathname.match(/^\/snapshot\/([a-zA-Z0-9_-]+)\/status$/);
  if (statusMatch && method === "GET") {
    const job = jobStore.getJob(statusMatch[1]);
    if (!job) return sendJson(404, { error: "Job not found or expired" });
    return sendJson(200, {
      status: job.status,
      progressPercent: job.progressPercent,
      error: job.error,
      expiresAt: job.expiresAt,
    });
  }

  // 4. GET /snapshot/:id/manifest
  const manifestMatch = pathname.match(/^\/snapshot\/([a-zA-Z0-9_-]+)\/manifest$/);
  if (manifestMatch && method === "GET") {
    const job = jobStore.getJob(manifestMatch[1]);
    if (!job) return sendJson(404, { error: "Job not found or expired" });
    if (job.status !== "completed") {
      return sendJson(409, { error: "Job is still processing", status: job.status, progress: job.progressPercent });
    }
    return sendJson(200, job.manifest || {});
  }

  // 5. GET /snapshot/:id/screenshot?view=desktop|mobile
  const screenshotMatch = pathname.match(/^\/snapshot\/([a-zA-Z0-9_-]+)\/screenshot$/);
  if (screenshotMatch && method === "GET") {
    const job = jobStore.getJob(screenshotMatch[1]);
    if (!job) return sendJson(404, { error: "Job not found or expired" });
    const view = url.searchParams.get("view") === "mobile" ? "mobile" : "desktop";
    const imgBuffer = job.screenshots[view];
    if (!imgBuffer) return sendJson(404, { error: `Screenshot (${view}) not available` });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, max-age=600");
    res.statusCode = 200;
    res.end(imgBuffer);
    return;
  }

  // 6. GET /snapshot/:id/file/:fileId
  const fileMatch = pathname.match(/^\/snapshot\/([a-zA-Z0-9_-]+)\/file\/([a-zA-Z0-9_-]+)$/);
  if (fileMatch && method === "GET") {
    const [, jobId, fileId] = fileMatch;
    const file = jobStore.getFile(jobId, fileId);
    if (!file) {
      sendJson(404, { error: "File not found or expired" });
      return;
    }

    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.statusCode = 200;
    res.end(file.data);
    return;
  }

  // 7. GET /snapshot/:id/zip
  const zipMatch = pathname.match(/^\/snapshot\/([a-zA-Z0-9_-]+)\/zip$/);
  if (zipMatch && method === "GET") {
    const job = jobStore.getJob(zipMatch[1]);
    if (!job) return sendJson(404, { error: "Job not found or expired" });

    createJobZipArchive(job)
      .then((zipBuf) => {
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="sourcelab-snapshot-${job.id}.zip"`);
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.statusCode = 200;
        res.end(zipBuf);
      })
      .catch((err) => {
        sendJson(500, { error: `ZIP generation failed: ${err.message}` });
      });
    return;
  }

  return sendJson(404, { error: "Route not found" });
}

// Background Recon Pipeline Orchestrator
async function executeReconJob(job: ReconJob, options?: Record<string, unknown>): Promise<void> {
  try {
    const url = job.targetUrl;

    jobStore.updateStatus(job.id, "resolving", 10);

    // Phase 1: Snapshot Engine
    jobStore.updateStatus(job.id, "loading", 25);
    const snapshotRes = await runSnapshot({ url, ...options });

    jobStore.updateStatus(job.id, "screenshot", 45);
    jobStore.setScreenshots(job.id, snapshotRes.screenshots);

    // Store assets
    jobStore.updateStatus(job.id, "collecting", 65);
    const fileManifestList: Array<{ id: string; filename: string; folder: string; size: number; url: string }> = [];
    for (const asset of snapshotRes.assets) {
      const fileId = jobStore.addFile(job.id, {
        filename: asset.filename,
        folder: asset.folder,
        contentType: asset.contentType,
        data: asset.data,
      });
      fileManifestList.push({
        id: fileId,
        filename: asset.filename,
        folder: asset.folder,
        size: asset.size,
        url: asset.url,
      });
    }

    // Phase 2: Passive Recon & Hidden Paths
    jobStore.updateStatus(job.id, "analyzing", 80);
    const [passiveData, hiddenPaths, jsAnalysis] = await Promise.all([
      runPassiveRecon(url, snapshotRes.renderedDom || snapshotRes.rawHtml),
      detectHiddenPaths(url),
      analyzeDownloadedAssets(snapshotRes.assets, snapshotRes.sourceMaps),
    ]);

    // Phase 3: Manifest Assembly
    const manifest = {
      jobId: job.id,
      targetUrl: url,
      timestamp: new Date().toISOString(),
      pagesVisited: snapshotRes.pagesVisited,
      filesCount: fileManifestList.length,
      files: fileManifestList,
      screenshots: {
        hasDesktop: !!snapshotRes.screenshots.desktop,
        hasMobile: !!snapshotRes.screenshots.mobile,
      },
      dns: passiveData.dns,
      emailSecurity: passiveData.emailSecurity,
      subdomains: passiveData.subdomains,
      ssl: passiveData.ssl,
      whois: passiveData.whois,
      seo: passiveData.seo,
      contacts: passiveData.contacts,
      patterns: passiveData.patterns,
      reachability: passiveData.reachability,
      hiddenPaths,
      jsAnalysis,
    };

    jobStore.setManifest(job.id, manifest);
    jobStore.updateStatus(job.id, "completed", 100);
  } finally {
    globalConcurrency.release();
  }
}

export function createReconServer(options: ServerOptions = {}): http.Server {
  return http.createServer((req, res) => handleApiRequest(req, res, options));
}
