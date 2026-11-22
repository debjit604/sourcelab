"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { analyzeCookies } from "./process";
import {
  Cookie,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";

const SAMPLE_COOKIES = `Set-Cookie: session_id=s%3A987654321; Path=/; Secure; HttpOnly; SameSite=Lax
Set-Cookie: csrf_token=d8f7e6c5b4a3; Path=/; Secure; SameSite=Strict
Set-Cookie: tracking_id=anon_12345; Path=/; SameSite=None
Set-Cookie: user_auth=jwt_payload_here; Path=/;`;

export default function CookieAnalyzerTool() {
  const [cookieInput, setCookieInput] = useState<string>(SAMPLE_COOKIES);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return analyzeCookies(cookieInput);
  }, [cookieInput]);

  const handleCopy = () => {
    const text = result.cookies
      .map((c) => {
        const issuesText = c.issues.length
          ? c.issues.map((i) => `  - [${i.severity.toUpperCase()}] ${i.message}`).join("\n")
          : "  - [PASS] All security flags properly configured";
        return `Cookie: ${c.name}\n${issuesText}\n`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Notice */}
      <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] text-xs text-[#8B95AD]">
        Paste raw <code className="text-[#22D3EE]">Set-Cookie</code> response headers from HTTP responses or DevTools storage.
      </div>

      {/* Cookies Textarea */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8B95AD]">
          <span>Set-Cookie Header(s)</span>
          <span>{result.totalCookies} cookies parsed</span>
        </div>
        <textarea
          value={cookieInput}
          onChange={(e) => setCookieInput(e.target.value)}
          rows={7}
          placeholder="Set-Cookie: session=123; Secure; HttpOnly..."
          className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] resize-y focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => setCookieInput(SAMPLE_COOKIES)}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Mixed Set
        </button>
        <button
          type="button"
          onClick={() =>
            setCookieInput(
              "Set-Cookie: __Host-sess=tok_987; Secure; HttpOnly; SameSite=Strict; Path=/"
            )
          }
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Hardened __Host-
        </button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Score Banner */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] flex items-center justify-between">
        <div>
          <div className="text-xs text-[#8B95AD] uppercase tracking-wider">Cookie Security Health</div>
          <div className="text-sm font-bold text-[#E6EAF2] mt-0.5 flex items-center gap-1.5">
            {result.criticalIssuesCount === 0 ? (
              <ShieldCheck className="w-4 h-4 text-green-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            )}
            <span>
              {result.criticalIssuesCount === 0
                ? "No Critical Flaws Found"
                : `${result.criticalIssuesCount} Critical Flaw(s) Detected`}
            </span>
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-[#22D3EE]">
          {result.score}/100
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[#8B95AD]">Secure Flag</div>
          <div className="text-base font-bold font-mono text-[#E6EAF2]">
            {result.secureCount} / {result.totalCookies}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[#8B95AD]">HttpOnly Flag</div>
          <div className="text-base font-bold font-mono text-[#E6EAF2]">
            {result.httpOnlyCount} / {result.totalCookies}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[#8B95AD]">SameSite Set</div>
          <div className="text-base font-bold font-mono text-[#E6EAF2]">
            {result.sameSiteCount} / {result.totalCookies}
          </div>
        </div>
      </div>

      {/* Cookie List */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {result.cookies.map((c, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#121828] border border-[#232C42] space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cookie className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span className="font-mono font-bold text-[#E6EAF2]">{c.name}</span>
                {c.isSensitive && (
                  <span className="text-[10px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                    Sensitive
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 text-[10px] font-mono">
                <span className={`px-1.5 py-0.5 rounded ${c.secure ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {c.secure ? "Secure" : "No-Secure"}
                </span>
                <span className={`px-1.5 py-0.5 rounded ${c.httpOnly ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {c.httpOnly ? "HttpOnly" : "No-HttpOnly"}
                </span>
                <span className={`px-1.5 py-0.5 rounded ${c.sameSite ? "bg-cyan-500/20 text-cyan-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {c.sameSite ? `SameSite=${c.sameSite}` : "No-SameSite"}
                </span>
              </div>
            </div>

            {/* Issues */}
            {c.issues.length > 0 ? (
              <div className="space-y-1 pt-1">
                {c.issues.map((iss, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-start gap-1.5 text-[11px] text-red-400"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{iss.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-green-400 flex items-center gap-1 pt-1">
                <Check className="w-3.5 h-3.5" />
                <span>All security flags configured properly.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Copy Report */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full py-2 px-3 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE] text-xs text-[#E6EAF2] flex items-center justify-center gap-2 transition-all font-medium"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#22D3EE]" />}
        {copied ? "Report Copied" : "Copy Cookie Audit Report"}
      </button>
    </div>
  );

  return (
    <ToolShell
      toolId="cookie-analyzer"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
