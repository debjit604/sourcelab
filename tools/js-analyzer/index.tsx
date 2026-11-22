"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { scanSource, AnalysisSummary, FindingSeverity } from "@/lib/analyzers";
import { exportToJson, exportToCsv, exportToMarkdown } from "./process";
import {
  Eye,
  EyeOff,
  Download,
  Search,
  AlertTriangle,
  Link as LinkIcon,
  Cloud,
} from "lucide-react";

const SAMPLE_JS = `// Application Configuration
const config = {
  apiBase: "https://api.internal.corp/v1/auth",
  cdnUrl: "https://assets-corp.s3.amazonaws.com/bundles",
  timeoutMs: 5000
};

// Endpoints
function loadUserData(userId) {
  return fetch(\`/api/v2/users/\${userId}?expand=profile&active=true\`);
}

// TODO: Remove staging authorization headers before prod
const devToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M";
`;

export default function JsAnalyzerTool() {
  const [sourceCode, setSourceCode] = useState<string>(SAMPLE_JS);
  const [filename, setFilename] = useState<string>("sample.js");
  const [activeTab, setActiveTab] = useState<"secrets" | "endpoints" | "buckets">("secrets");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const summary: AnalysisSummary = useMemo(() => {
    return scanSource(sourceCode);
  }, [sourceCode]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFiles = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setSourceCode(content);
      }
    };
    reader.readAsText(file);
  };

  const filteredFindings = useMemo(() => {
    return summary.findings.filter((f) => {
      if (severityFilter !== "all" && f.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.ruleName.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.match.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [summary.findings, severityFilter, searchQuery]);

  const downloadReport = (format: "json" | "csv" | "md") => {
    let content = "";
    let mime = "";
    let ext = "";

    if (format === "json") {
      content = exportToJson(summary);
      mime = "application/json";
      ext = "json";
    } else if (format === "csv") {
      content = exportToCsv(summary.findings);
      mime = "text/csv";
      ext = "csv";
    } else {
      content = exportToMarkdown(summary, filename);
      mime = "text/markdown";
      ext = "md";
    }

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recon-report-${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadgeClass = (s: FindingSeverity) => {
    switch (s) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "low":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Legal & Authorization Notice */}
      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Notice:</strong> Use only on files and targets you own or are explicitly authorized to test. Found credentials are never verified against remote servers.
        </div>
      </div>

      {/* File Dropzone */}
      <Dropzone
        accept=".js,.html,.map,.har,text/javascript,application/json"
        onFiles={handleFiles}
        label="Drop .js, .html, .map or .har file here"
      />

      {/* Paste Area */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8B95AD]">
          <span>Or Paste Source Code</span>
          <span>{summary.scannedLines} lines</span>
        </div>
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          rows={7}
          placeholder="Paste JS here..."
          className="w-full px-3 py-2 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] resize-y focus:outline-none focus:border-[#22D3EE]"
        />
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[#8B95AD]">Secrets Found</div>
          <div className="text-xl font-bold font-mono text-red-400">{summary.findings.length}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[#8B95AD]">Endpoints</div>
          <div className="text-xl font-bold font-mono text-[#22D3EE]">{summary.endpoints.length}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[#8B95AD]">Cloud Buckets</div>
          <div className="text-xl font-bold font-mono text-amber-400">{summary.buckets.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#232C42] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("secrets")}
          className={`pb-1 px-2 font-medium border-b-2 transition-all ${
            activeTab === "secrets"
              ? "border-[#22D3EE] text-[#22D3EE]"
              : "border-transparent text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Secrets & Tokens ({summary.findings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("endpoints")}
          className={`pb-1 px-2 font-medium border-b-2 transition-all ${
            activeTab === "endpoints"
              ? "border-[#22D3EE] text-[#22D3EE]"
              : "border-transparent text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Endpoints ({summary.endpoints.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("buckets")}
          className={`pb-1 px-2 font-medium border-b-2 transition-all ${
            activeTab === "buckets"
              ? "border-[#22D3EE] text-[#22D3EE]"
              : "border-transparent text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Cloud Buckets ({summary.buckets.length})
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "secrets" && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex gap-2 items-center text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B95AD]" />
              <input
                type="text"
                placeholder="Search secrets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none"
              />
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Findings List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredFindings.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8B95AD]">
                No secrets matching criteria.
              </div>
            ) : (
              filteredFindings.map((f) => {
                const isRevealed = revealedIds.has(f.id);
                return (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl bg-[#121828] border border-[#232C42] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(
                            f.severity
                          )}`}
                        >
                          {f.severity}
                        </span>
                        <span className="font-semibold text-[#E6EAF2]">{f.ruleName}</span>
                      </div>
                      <span className="text-[11px] text-[#8B95AD]">Line {f.line}:{f.column}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#0B0F1A] border border-[#232C42] font-mono text-xs">
                      <span className="text-[#22D3EE] break-all select-all">
                        {isRevealed ? f.match : f.masked}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(f.id)}
                        className="text-[#8B95AD] hover:text-[#E6EAF2] shrink-0"
                        title={isRevealed ? "Hide secret" : "Reveal secret"}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === "endpoints" && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs">
          {summary.endpoints.map((ep, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-[#121828] border border-[#232C42] flex items-center justify-between font-mono"
            >
              <div className="flex items-center gap-1.5 truncate">
                <LinkIcon className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
                <span className="text-[#E6EAF2] select-all truncate">{ep.url}</span>
              </div>
              <span className="text-[10px] text-[#8B95AD] shrink-0 ml-2">L:{ep.line}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "buckets" && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs">
          {summary.buckets.map((b, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-[#121828] border border-[#232C42] flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[#E6EAF2]">{b.name}</span>
              </div>
              <span className="text-[10px] uppercase text-[#8B95AD]">{b.provider}</span>
            </div>
          ))}
        </div>
      )}

      {/* Export Bar */}
      <div className="flex gap-2 pt-2 border-t border-[#232C42] text-xs">
        <span className="text-[#8B95AD] self-center">Export:</span>
        <button
          type="button"
          onClick={() => downloadReport("json")}
          className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE] flex items-center gap-1"
        >
          <Download className="w-3 h-3" /> JSON
        </button>
        <button
          type="button"
          onClick={() => downloadReport("csv")}
          className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE] flex items-center gap-1"
        >
          <Download className="w-3 h-3" /> CSV
        </button>
        <button
          type="button"
          onClick={() => downloadReport("md")}
          className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE] flex items-center gap-1"
        >
          <Download className="w-3 h-3" /> Markdown
        </button>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="js-analyzer"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
