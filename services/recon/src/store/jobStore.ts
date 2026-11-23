import crypto from "crypto";
import { sanitizeFilename } from "../snapshot/classifier";

export type JobStatus =
  | "queued"
  | "resolving"
  | "loading"
  | "screenshot"
  | "collecting"
  | "analyzing"
  | "completed"
  | "failed";

export interface StoredFile {
  fileId: string;
  filename: string;
  folder: string;
  contentType: string;
  size: number;
  data: Buffer;
}

export interface ReconJob {
  id: string;
  targetUrl: string;
  status: JobStatus;
  progressPercent: number;
  error?: string;
  createdAt: number;
  expiresAt: number;
  manifest?: Record<string, unknown>;
  files: Map<string, StoredFile>;
  screenshots: {
    desktop?: Buffer;
    mobile?: Buffer;
  };
}

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

class JobStore {
  private jobs = new Map<string, ReconJob>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup sweep every 60 seconds
    if (typeof setInterval !== "undefined") {
      this.cleanupTimer = setInterval(() => this.cleanupExpiredJobs(), 60_000);
      if (this.cleanupTimer.unref) this.cleanupTimer.unref();
    }
  }

  public createJob(targetUrl: string, ttlMs = DEFAULT_TTL_MS): ReconJob {
    const id = crypto.randomUUID();
    const now = Date.now();
    const job: ReconJob = {
      id,
      targetUrl,
      status: "queued",
      progressPercent: 0,
      createdAt: now,
      expiresAt: now + ttlMs,
      files: new Map(),
      screenshots: {},
    };
    this.jobs.set(id, job);
    return job;
  }

  public getJob(id: string): ReconJob | undefined {
    const cleanId = sanitizeFilename(id);
    const job = this.jobs.get(cleanId);
    if (!job) return undefined;
    if (Date.now() > job.expiresAt) {
      this.jobs.delete(cleanId);
      return undefined;
    }
    return job;
  }

  public updateStatus(id: string, status: JobStatus, progressPercent: number, error?: string): void {
    const job = this.getJob(id);
    if (job) {
      job.status = status;
      job.progressPercent = Math.min(100, Math.max(0, progressPercent));
      if (error) job.error = error;
    }
  }

  public setManifest(id: string, manifest: Record<string, unknown>): void {
    const job = this.getJob(id);
    if (job) {
      job.manifest = manifest;
    }
  }

  public setScreenshots(id: string, screenshots: { desktop?: Buffer; mobile?: Buffer }): void {
    const job = this.getJob(id);
    if (job) {
      job.screenshots = screenshots;
    }
  }

  public addFile(
    jobId: string,
    file: { filename: string; folder: string; contentType: string; data: Buffer }
  ): string {
    const job = this.getJob(jobId);
    if (!job) throw new Error("Job not found or expired");

    const fileId = crypto.randomUUID();
    const cleanFilename = sanitizeFilename(file.filename, "file");

    const storedFile: StoredFile = {
      fileId,
      filename: cleanFilename,
      folder: sanitizeFilename(file.folder, "other"),
      contentType: file.contentType || "application/octet-stream",
      size: file.data.length,
      data: file.data,
    };

    job.files.set(fileId, storedFile);
    return fileId;
  }

  public getFile(jobId: string, fileId: string): StoredFile | undefined {
    const job = this.getJob(jobId);
    if (!job) return undefined;

    // Path traversal defense: strict UUID validation
    const cleanFileId = fileId.replace(/[^a-zA-Z0-9-]/g, "");
    if (!cleanFileId || cleanFileId.includes("..")) return undefined;

    return job.files.get(cleanFileId);
  }

  public cleanupExpiredJobs(): number {
    const now = Date.now();
    let cleaned = 0;
    for (const [id, job] of Array.from(this.jobs.entries())) {
      if (now > job.expiresAt) {
        job.files.clear();
        job.screenshots = {};
        this.jobs.delete(id);
        cleaned++;
      }
    }
    return cleaned;
  }

  public clearAll(): void {
    this.jobs.clear();
  }
}

export const jobStore = new JobStore();
