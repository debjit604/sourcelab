"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  createSnapshotJob,
  checkJobStatus,
  fetchJobManifest,
  SnapshotManifest,
} from "./process";
import { ResultTabs } from "./ResultTabs";
import { Search, Globe } from "lucide-react";

export function WebsiteSnapshotTool() {
  const [url, setUrl] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<SnapshotManifest | null>(null);

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const handleStartScan = async () => {
    if (!url.trim()) {
      setError("Kripya ek valid URL darj karein (e.g. https://example.com)");
      return;
    }
    if (!authorized) {
      setError("Pehle shartein manzoor karein (I am authorized to test this target)");
      return;
    }

    setError(null);
    setLoading(true);
    setProgressPercent(10);
    setStatusMessage("Target URL validate aur initiate ho raha hai...");
    setManifest(null);

    try {
      const initRes = await createSnapshotJob(url.trim(), turnstileToken || undefined);
      const jobId = initRes.jobId;
      setStatusMessage("Scan shuru ho gaya hai. Status check ho raha hai...");

      pollingTimerRef.current = setInterval(async () => {
        try {
          const statusRes = await checkJobStatus(jobId);
          setProgressPercent(statusRes.progressPercent || 25);
          setStatusMessage(`Current state: ${statusRes.status} (${statusRes.progressPercent}%)`);

          if (statusRes.status === "completed") {
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            const fullManifest = await fetchJobManifest(jobId);
            setManifest(fullManifest);
            setLoading(false);
            setProgressPercent(100);
            setStatusMessage("Scan safalta-poorvak poora hua!");
          } else if (statusRes.status === "failed") {
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            setError(statusRes.error || "Scan failed.");
            setLoading(false);
          }
        } catch (pollErr) {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          setError(pollErr instanceof Error ? pollErr.message : "Polling error");
          setLoading(false);
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate scan");
      setLoading(false);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-mono font-medium text-[var(--sl-muted)] mb-1">
          Target Website URL (HTTP / HTTPS)
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 w-4 h-4 text-[var(--sl-muted)]" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full pl-9 pr-3 py-2.5 rounded-[10px] bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sl-accent)]"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-[10px] bg-[rgba(35,44,66,0.5)] border border-[var(--sl-border)]">
        <input
          type="checkbox"
          id="authCheck"
          checked={authorized}
          onChange={(e) => setAuthorized(e.target.checked)}
          className="mt-1 accent-[var(--sl-accent)]"
          disabled={loading}
        />
        <label htmlFor="authCheck" className="text-xs text-[var(--sl-text)] leading-relaxed cursor-pointer">
          <span className="font-semibold text-[var(--sl-accent)]">Authorized testing:</span> Main certify karta hoon ki main is target URL ka public audit lene ke liye authorized hoon. Internal network testing aur private IPs strict SSRF guard dwara block hain.
        </label>
      </div>

      <div>
        <label className="block text-xs font-mono font-medium text-[var(--sl-muted)] mb-1">
          Turnstile / Bot Verification Token (Optional in Local Dev)
        </label>
        <input
          type="text"
          value={turnstileToken}
          onChange={(e) => setTurnstileToken(e.target.value)}
          placeholder="cf-turnstile-token"
          className="w-full px-3 py-2 rounded-[10px] bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs text-[var(--sl-text)]"
          disabled={loading}
        />
      </div>

      <button
        type="button"
        onClick={handleStartScan}
        disabled={loading || !url || !authorized}
        className="w-full py-2.5 px-4 rounded-[10px] bg-[var(--sl-accent)] text-[#0B0F1A] font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" />
        {loading ? "Recon Scanning Chalu Hai..." : "Launch Website Snapshot"}
      </button>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs text-[var(--sl-muted)]">
          {statusMessage}
        </div>
      )}
    </div>
  );

  const outputPanel = manifest ? (
    <ResultTabs manifest={manifest} />
  ) : (
    <div className="p-8 text-center text-xs font-mono text-[var(--sl-muted)]">
      Target URL enter karein aur &apos;Launch Website Snapshot&apos; par click karein.
    </div>
  );

  return (
    <ToolShell
      toolId="website-snapshot"
      input={inputPanel}
      output={outputPanel}
      error={error}
      loading={loading}
      progressPercent={progressPercent}
      onRunShortcut={handleStartScan}
    />
  );
}

export default WebsiteSnapshotTool;
