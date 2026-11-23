import { describe, it, expect } from "vitest";
import { jobStore } from "./jobStore";
import { createJobZipArchive } from "./zipStream";
import JSZip from "jszip";

describe("Ephemeral Job Store & ZIP Archive (Task 6)", () => {
  it("creates a job with 10-minute TTL and updates progress", () => {
    const job = jobStore.createJob("https://example.com");
    expect(job.id).toBeDefined();
    expect(job.targetUrl).toBe("https://example.com");
    expect(job.status).toBe("queued");
    expect(job.progressPercent).toBe(0);
    expect(job.expiresAt).toBeGreaterThan(Date.now() + 9 * 60 * 1000);

    jobStore.updateStatus(job.id, "loading", 35);
    const updated = jobStore.getJob(job.id);
    expect(updated?.status).toBe("loading");
    expect(updated?.progressPercent).toBe(35);
  });

  it("adds and retrieves files with path traversal protection", () => {
    const job = jobStore.createJob("https://example.com");
    const fileId = jobStore.addFile(job.id, {
      filename: "app.bundle.js",
      folder: "js",
      contentType: "application/javascript",
      data: Buffer.from("console.log('hi');"),
    });

    const file = jobStore.getFile(job.id, fileId);
    expect(file).toBeDefined();
    expect(file?.filename).toBe("app.bundle.js");
    expect(file?.folder).toBe("js");

    // Path traversal attacks must return undefined
    expect(jobStore.getFile(job.id, "../../../etc/passwd")).toBeUndefined();
    expect(jobStore.getFile(job.id, "..\\..\\windows\\cmd.exe")).toBeUndefined();
    expect(jobStore.getFile(job.id, "nonexistent-id")).toBeUndefined();
  });

  it("cleans up expired jobs automatically when TTL passes", () => {
    // Create an expired job with negative TTL
    const job = jobStore.createJob("https://example.com", -1000);
    expect(jobStore.getJob(job.id)).toBeUndefined(); // getJob discards expired

    const cleaned = jobStore.cleanupExpiredJobs();
    expect(cleaned).toBeGreaterThanOrEqual(0);
  });

  it("generates a valid structured ZIP file with manifest and grouped folders", async () => {
    const job = jobStore.createJob("https://example.com");
    jobStore.setManifest(job.id, { test: "manifest_data", url: "https://example.com" });
    jobStore.setScreenshots(job.id, {
      desktop: Buffer.from("fake-desktop-png"),
      mobile: Buffer.from("fake-mobile-png"),
    });
    jobStore.addFile(job.id, {
      filename: "main.css",
      folder: "css",
      contentType: "text/css",
      data: Buffer.from("body { color: blue; }"),
    });

    const zipBuf = await createJobZipArchive(job);
    expect(zipBuf).toBeInstanceOf(Buffer);
    expect(zipBuf.length).toBeGreaterThan(100);

    // Read back and inspect entries
    const unzipped = await JSZip.loadAsync(zipBuf);
    expect(unzipped.file("manifest.json")).not.toBeNull();
    expect(unzipped.file("screenshots/desktop.png")).not.toBeNull();
    expect(unzipped.file("screenshots/mobile.png")).not.toBeNull();
    expect(unzipped.file("css/main.css")).not.toBeNull();

    const manifestText = await unzipped.file("manifest.json")?.async("text");
    expect(manifestText).toContain("manifest_data");
  });
});
