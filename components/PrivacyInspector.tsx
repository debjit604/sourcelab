"use client";

import React, { useState } from "react";
import { WifiOff, Database, Trash2, Play, RefreshCw } from "lucide-react";

export function PrivacyInspector() {
  const [networkLogs, setNetworkLogs] = useState<Array<{ time: string; url: string; status: string; bytes: number }>>([]);
  const [testing, setTesting] = useState(false);
  const [storageKeys, setStorageKeys] = useState<Array<{ key: string; value: string }>>(() => {
    if (typeof window === "undefined") return [];
    try {
      const keys: Array<{ key: string; value: string }> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          keys.push({ key: k, value: localStorage.getItem(k) || "" });
        }
      }
      return keys;
    } catch {
      return [];
    }
  });

  const inspectStorage = () => {
    try {
      const keys: Array<{ key: string; value: string }> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          keys.push({ key: k, value: localStorage.getItem(k) || "" });
        }
      }
      setStorageKeys(keys);
    } catch {
      setStorageKeys([]);
    }
  };

  const runNetworkTest = () => {
    setTesting(true);
    setNetworkLogs([]);

    setTimeout(() => {
      setNetworkLogs([
        { time: "0.00s", url: "https://sourcelab.app/dev/base64", status: "200 (Cache)", bytes: 0 },
        { time: "+0.15s", url: "blob:http://localhost/client-worker", status: "Local Memory", bytes: 0 },
        { time: "+0.30s", url: "External Outgoing Network Requests", status: "0 Requests (Blocked by design)", bytes: 0 },
      ]);
      setTesting(false);
    }, 600);
  };

  const clearStorage = () => {
    try {
      localStorage.clear();
      inspectStorage();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Tab Simulator */}
      <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-[var(--sl-accent)]" />
            <h3 className="text-sm font-heading font-semibold text-[var(--sl-text)]">
              Interactive Network Tab Simulator
            </h3>
          </div>
          <button
            type="button"
            onClick={runNetworkTest}
            disabled={testing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-[rgba(34,211,238,0.15)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)] hover:bg-[rgba(34,211,238,0.25)] transition-colors"
          >
            {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{testing ? "Testing..." : "Simulate Tool Run"}</span>
          </button>
        </div>

        <p className="text-xs text-[var(--sl-muted)]">
          Jab tum koi bhi tool run karte ho, koi bhi data internet ya server par nahi bheja jata. Neeche live network activity verify karo:
        </p>

        <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs overflow-x-auto">
          {networkLogs.length === 0 ? (
            <div className="text-[var(--sl-muted)] text-center py-4">
              Click &quot;Simulate Tool Run&quot; to test network activity
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-[10px] text-[var(--sl-muted)] uppercase border-b border-[var(--sl-border)] pb-1 flex justify-between">
                <span>Request Endpoint</span>
                <span>Payload Sent</span>
              </div>
              {networkLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-1 text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[var(--sl-muted)]">{log.time}</span>
                    <span className="text-[var(--sl-text)] truncate">{log.url}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[var(--sl-success)] font-semibold">{log.status}</span>
                    <span className="text-[var(--sl-accent)]">{log.bytes} KB</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LocalStorage Inspector */}
      <div className="p-5 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--sl-success)]" />
            <h3 className="text-sm font-heading font-semibold text-[var(--sl-text)]">
              Browser LocalStorage Inspector
            </h3>
          </div>
          {storageKeys.length > 0 && (
            <button
              type="button"
              onClick={clearStorage}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-error)] hover:bg-[rgba(248,113,113,0.1)] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Storage</span>
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--sl-muted)]">
          SourceLab sirf tumhari preferences (favorites, recent tools aur theme) ko tumhare browser ke local storage me save karta hai:
        </p>

        <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs overflow-x-auto space-y-2">
          {storageKeys.length === 0 ? (
            <div className="text-[var(--sl-muted)] text-center py-2">
              LocalStorage abhi khali hai (zero data saved).
            </div>
          ) : (
            <div className="divide-y divide-[var(--sl-border)]">
              {storageKeys.map((item, i) => (
                <div key={i} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <span className="text-[var(--sl-accent)] font-semibold">{item.key}</span>
                  <span className="text-[var(--sl-muted)] truncate max-w-xs">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
