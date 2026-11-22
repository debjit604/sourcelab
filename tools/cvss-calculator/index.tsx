"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  calculateCvss,
  parseVectorString,
  DEFAULT_CVSS_METRICS,
  CvssV31Metrics,
  AttackVector,
  AttackComplexity,
  PrivilegesRequired,
  UserInteraction,
  Scope,
  ImpactMetric,
} from "./process";
import { Copy, Check, Info } from "lucide-react";

const PRESETS = [
  { name: "Log4Shell (RCE)", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H" },
  { name: "SQL Injection", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H" },
  { name: "Local PrivEsc", vector: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H" },
  { name: "Stored XSS", vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N" },
  { name: "CSRF", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N" },
];

export default function CvssCalculatorTool() {
  const [metrics, setMetrics] = useState<CvssV31Metrics>(DEFAULT_CVSS_METRICS);
  const [vectorInput, setVectorInput] = useState<string>("");
  const [copiedVector, setCopiedVector] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const result = useMemo(() => calculateCvss(metrics), [metrics]);

  const updateMetric = <K extends keyof CvssV31Metrics>(key: K, value: CvssV31Metrics[K]) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
  };

  const handleVectorInputChange = (val: string) => {
    setVectorInput(val);
    const parsed = parseVectorString(val);
    if (parsed) {
      setMetrics(parsed);
    }
  };

  const applyPreset = (vector: string) => {
    const parsed = parseVectorString(vector);
    if (parsed) {
      setMetrics(parsed);
      setVectorInput(vector);
    }
  };

  const copyToClipboard = (text: string, type: "vector" | "markdown") => {
    navigator.clipboard.writeText(text);
    if (type === "vector") {
      setCopiedVector(true);
      setTimeout(() => setCopiedVector(false), 2000);
    } else {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    }
  };

  const markdownReport = `### Vulnerability CVSS v3.1 Assessment
- **Severity**: ${result.severity} (${result.score}/10.0)
- **Vector String**: \`${result.vectorString}\`
- **Exploitability Subscore**: ${result.exploitabilitySubscore}
- **Impact Subscore**: ${result.impactSubscore}`;

  const renderOptionGroup = <T extends string>(
    label: string,
    current: T,
    options: { value: T; label: string; desc?: string }[],
    onChange: (val: T) => void
  ) => (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-[#8B95AD]">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
              current === opt.value
                ? "bg-[#22D3EE]/15 border-[#22D3EE] text-[#22D3EE] font-medium"
                : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:border-[#8B95AD]/50 hover:text-[#E6EAF2]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const inputPanel = (
    <div className="space-y-5">
      {/* Quick Presets */}
      <div className="space-y-1.5">
        <div className="text-xs text-[#8B95AD] font-medium">Quick Presets (Common Vulnerabilities)</div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p.vector)}
              className="px-2.5 py-1 text-xs rounded-md bg-[#121828] border border-[#232C42] text-[#E6EAF2] hover:border-[#22D3EE] transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vector String Direct Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#8B95AD]">
          CVSS Vector String (Type ya Paste karo)
        </label>
        <input
          type="text"
          value={vectorInput || result.vectorString}
          onChange={(e) => handleVectorInputChange(e.target.value)}
          placeholder="CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
          className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Exploitability Metrics */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3.5">
        <div className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">
          Exploitability Metrics
        </div>
        {renderOptionGroup<AttackVector>(
          "Attack Vector (AV)",
          metrics.av,
          [
            { value: "N", label: "Network (N)" },
            { value: "A", label: "Adjacent (A)" },
            { value: "L", label: "Local (L)" },
            { value: "P", label: "Physical (P)" },
          ],
          (val) => updateMetric("av", val)
        )}
        {renderOptionGroup<AttackComplexity>(
          "Attack Complexity (AC)",
          metrics.ac,
          [
            { value: "L", label: "Low (L)" },
            { value: "H", label: "High (H)" },
          ],
          (val) => updateMetric("ac", val)
        )}
        {renderOptionGroup<PrivilegesRequired>(
          "Privileges Required (PR)",
          metrics.pr,
          [
            { value: "N", label: "None (N)" },
            { value: "L", label: "Low (L)" },
            { value: "H", label: "High (H)" },
          ],
          (val) => updateMetric("pr", val)
        )}
        {renderOptionGroup<UserInteraction>(
          "User Interaction (UI)",
          metrics.ui,
          [
            { value: "N", label: "None (N)" },
            { value: "R", label: "Required (R)" },
          ],
          (val) => updateMetric("ui", val)
        )}
        {renderOptionGroup<Scope>(
          "Scope (S)",
          metrics.s,
          [
            { value: "U", label: "Unchanged (U)" },
            { value: "C", label: "Changed (C)" },
          ],
          (val) => updateMetric("s", val)
        )}
      </div>

      {/* Impact Metrics */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3.5">
        <div className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">
          Impact Metrics
        </div>
        {renderOptionGroup<ImpactMetric>(
          "Confidentiality (C)",
          metrics.c,
          [
            { value: "N", label: "None (N)" },
            { value: "L", label: "Low (L)" },
            { value: "H", label: "High (H)" },
          ],
          (val) => updateMetric("c", val)
        )}
        {renderOptionGroup<ImpactMetric>(
          "Integrity (I)",
          metrics.i,
          [
            { value: "N", label: "None (N)" },
            { value: "L", label: "Low (L)" },
            { value: "H", label: "High (H)" },
          ],
          (val) => updateMetric("i", val)
        )}
        {renderOptionGroup<ImpactMetric>(
          "Availability (A)",
          metrics.a,
          [
            { value: "N", label: "None (N)" },
            { value: "L", label: "Low (L)" },
            { value: "H", label: "High (H)" },
          ],
          (val) => updateMetric("a", val)
        )}
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Score and Severity Card */}
      <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] flex flex-col items-center justify-center text-center space-y-2">
        <div className="text-xs text-[#8B95AD] uppercase tracking-wider font-medium">
          Base Score (CVSS v3.1)
        </div>
        <div className="text-5xl font-black font-mono tracking-tight" style={{ color: result.color }}>
          {result.score.toFixed(1)}
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: `${result.color}20`, color: result.color }}
        >
          {result.severity} Severity
        </div>
      </div>

      {/* Subscores Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] text-center">
          <div className="text-[11px] text-[#8B95AD]">Exploitability Subscore</div>
          <div className="text-lg font-bold font-mono text-[#E6EAF2]">
            {result.exploitabilitySubscore.toFixed(1)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] text-center">
          <div className="text-[11px] text-[#8B95AD]">Impact Subscore</div>
          <div className="text-lg font-bold font-mono text-[#E6EAF2]">
            {result.impactSubscore.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Vector String with Copy */}
      <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <span>Full Vector String</span>
          <button
            type="button"
            onClick={() => copyToClipboard(result.vectorString, "vector")}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline"
          >
            {copiedVector ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedVector ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="font-mono text-xs text-[#E6EAF2] bg-[#0B0F1A] p-2.5 rounded border border-[#232C42] break-all select-all">
          {result.vectorString}
        </div>
      </div>

      {/* Markdown Report Copy */}
      <button
        type="button"
        onClick={() => copyToClipboard(markdownReport, "markdown")}
        className="w-full py-2.5 px-3 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE] text-xs text-[#E6EAF2] flex items-center justify-center gap-2 transition-all font-medium"
      >
        {copiedMarkdown ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#22D3EE]" />}
        {copiedMarkdown ? "Markdown Report Copied!" : "Copy Bug Bounty Markdown Summary"}
      </button>

      {/* Reference Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0B0F1A] border border-[#232C42] text-[11px] text-[#8B95AD]">
        <Info className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
        <div>
          Official FIRST CVSS v3.1 specification standard calculation. All calculations happen 100% locally in your browser.
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="cvss-calculator"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
