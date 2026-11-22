"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { analyzeHeaders } from "./process";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";

const SAMPLE_HEADERS = `HTTP/2 200 OK
content-type: text/html; charset=UTF-8
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
content-security-policy: default-src 'self'; script-src 'self'; object-src 'none';
server: cloudflare`;

export default function HeaderAnalyzerTool() {
  const [rawHeaders, setRawHeaders] = useState<string>(SAMPLE_HEADERS);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return analyzeHeaders(rawHeaders);
  }, [rawHeaders]);

  const handleCopy = () => {
    const text = result.checks
      .map(
        (c) =>
          `[${c.status.toUpperCase()}] ${c.header}: ${
            c.value || "MISSING"
          }\n${c.finding}\nFix: ${c.recommendation}\n`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Notice */}
      <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] text-xs text-[#8B95AD]">
        Paste raw HTTP response headers from DevTools Network tab, Burp Suite, or curl (<code className="text-[#22D3EE]">curl -I https://target.com</code>).
      </div>

      {/* Raw Headers Textarea */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8B95AD]">
          <span>Raw HTTP Headers</span>
          <span>{result.totalParsedHeaders} parsed headers</span>
        </div>
        <textarea
          value={rawHeaders}
          onChange={(e) => setRawHeaders(e.target.value)}
          rows={9}
          placeholder="Paste headers here..."
          className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] resize-y focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => setRawHeaders(SAMPLE_HEADERS)}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Hardened (A+)
        </button>
        <button
          type="button"
          onClick={() =>
            setRawHeaders(`HTTP/1.1 200 OK\nServer: Apache/2.4.41\nX-Powered-By: PHP/7.4.3\nContent-Type: text/html`)
          }
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Weak & Leaky (F)
        </button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Security Grade Banner */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] flex items-center justify-between">
        <div>
          <div className="text-xs text-[#8B95AD] uppercase tracking-wider">Overall Security Grade</div>
          <div className="text-xs text-[#8B95AD] mt-0.5">Score: {result.score} / 100</div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="text-4xl font-black font-mono px-4 py-1.5 rounded-xl border"
            style={{
              color: result.color,
              borderColor: `${result.color}50`,
              backgroundColor: `${result.color}15`,
            }}
          >
            {result.grade}
          </div>
        </div>
      </div>

      {/* Info Leaks Alert if any */}
      {result.infoLeaks.length > 0 && (
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs text-orange-300 space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Information Disclosure Headers Detected:</span>
          </div>
          {result.infoLeaks.map((l, i) => (
            <div key={i} className="font-mono text-[11px]">
              • <span className="text-orange-400 font-bold">{l.header}</span>: {l.value}
            </div>
          ))}
        </div>
      )}

      {/* Security Header Findings List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {result.checks.map((c, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#121828] border border-[#232C42] space-y-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {c.status === "pass" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : c.status === "warn" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="font-semibold text-[#E6EAF2]">{c.header}</span>
              </div>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  c.status === "pass"
                    ? "bg-green-500/15 text-green-400"
                    : c.status === "warn"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="text-[11px] text-[#8B95AD] pl-6">{c.finding}</div>

            {c.status !== "pass" && (
              <div className="text-[11px] text-[#22D3EE] pl-6 font-mono pt-1">
                Fix: {c.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Copy Report Button */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full py-2 px-3 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE] text-xs text-[#E6EAF2] flex items-center justify-center gap-2 transition-all"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#22D3EE]" />}
        {copied ? "Report Copied" : "Copy Remediation Report"}
      </button>
    </div>
  );

  return (
    <ToolShell
      toolId="header-analyzer"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
