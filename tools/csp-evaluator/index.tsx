"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { evaluateCsp, CspFindingSeverity } from "./process";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

const SAMPLE_WEAK_CSP = `default-src 'self' https:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
style-src 'self' 'unsafe-inline';
img-src * data:;`;

const SAMPLE_STRONG_CSP = `default-src 'self';
script-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';`;

export default function CspEvaluatorTool() {
  const [cspInput, setCspInput] = useState<string>(SAMPLE_WEAK_CSP);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return evaluateCsp(cspInput);
  }, [cspInput]);

  const handleCopy = () => {
    const text = result.findings
      .map(
        (f) =>
          `[${f.severity.toUpperCase()}] ${f.directive}: ${f.title}\n${f.description}\nFix: ${f.recommendation}\n`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadgeClass = (s: CspFindingSeverity) => {
    switch (s) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "good":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Notice */}
      <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] text-xs text-[#8B95AD]">
        Paste a <code className="text-[#22D3EE]">Content-Security-Policy</code> header value or meta tag content to audit against XSS, clickjacking and injection vectors.
      </div>

      {/* CSP Textarea */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8B95AD]">
          <span>CSP Header String</span>
          <span>{result.directives.length} directives detected</span>
        </div>
        <textarea
          value={cspInput}
          onChange={(e) => setCspInput(e.target.value)}
          rows={8}
          placeholder="default-src 'self'; script-src 'self'..."
          className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] resize-y focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => setCspInput(SAMPLE_STRONG_CSP)}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Strict Baseline
        </button>
        <button
          type="button"
          onClick={() => setCspInput(SAMPLE_WEAK_CSP)}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Weak (unsafe-inline)
        </button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Overall Status Banner */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] flex items-center justify-between">
        <div>
          <div className="text-xs text-[#8B95AD] uppercase tracking-wider">XSS Protection Status</div>
          <div className="text-sm font-bold text-[#E6EAF2] mt-0.5 flex items-center gap-1.5">
            {result.isEffectiveAgainstXss ? (
              <ShieldCheck className="w-4 h-4 text-green-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            )}
            <span>
              {result.isEffectiveAgainstXss
                ? "Effective Against XSS"
                : "Can Be Bypassed (XSS Possible)"}
            </span>
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-[#22D3EE]">
          {result.score}/100
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {result.findings.map((f, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#121828] border border-[#232C42] space-y-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {f.severity === "good" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : f.severity === "critical" || f.severity === "high" ? (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="font-semibold text-[#E6EAF2]">{f.title}</span>
              </div>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(
                  f.severity
                )}`}
              >
                {f.severity}
              </span>
            </div>

            <div className="text-[11px] text-[#8B95AD] pl-6">{f.description}</div>

            {f.severity !== "good" && (
              <div className="text-[11px] text-[#22D3EE] pl-6 font-mono pt-0.5">
                Fix: {f.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Copy Report Button */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full py-2 px-3 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE] text-xs text-[#E6EAF2] flex items-center justify-center gap-2 transition-all font-medium"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#22D3EE]" />}
        {copied ? "Report Copied" : "Copy CSP Audit Report"}
      </button>
    </div>
  );

  return (
    <ToolShell
      toolId="csp-evaluator"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
