"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  fetchDohRecords,
  DnsRecordType,
  DnsLookupResult,
} from "./process";
import {
  Globe,
  Search,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";

export default function DnsLookupTool() {
  const [domain, setDomain] = useState<string>("github.com");
  const [selectedType, setSelectedType] = useState<DnsRecordType | "ALL">("ALL");
  const [resolver, setResolver] = useState<"cloudflare" | "google">("cloudflare");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DnsLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLookup = async () => {
    if (!domain.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDohRecords(domain, selectedType, resolver);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "DNS resolution failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.records.length) return;
    const text = result.records
      .map((r) => `${r.name}\t${r.ttl}\t${r.type}\t${r.data}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Privacy Notice Banner */}
      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-start gap-2">
        <Globe className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Third-Party DoH Notice:</strong> Encrypted DNS queries are sent directly from your browser to {resolver === "cloudflare" ? "Cloudflare (1.1.1.1)" : "Google (8.8.8.8)"} via standard HTTPS CORS.
        </div>
      </div>

      {/* Domain Input */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">Domain Name</label>
        <div className="relative">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="example.com or sub.domain.org"
            className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          />
        </div>
      </div>

      {/* Resolver Selector */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">Public DoH Resolver</label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setResolver("cloudflare")}
            className={`py-2 px-3 rounded-lg border text-left transition-all ${
              resolver === "cloudflare"
                ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-medium"
                : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
            }`}
          >
            Cloudflare (1.1.1.1)
          </button>
          <button
            type="button"
            onClick={() => setResolver("google")}
            className={`py-2 px-3 rounded-lg border text-left transition-all ${
              resolver === "google"
                ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-medium"
                : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
            }`}
          >
            Google (8.8.8.8)
          </button>
        </div>
      </div>

      {/* Record Types Selector */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">Query Record Type</label>
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {(["ALL", "A", "AAAA", "MX", "TXT", "NS", "CNAME", "CAA", "SOA"] as const).map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded border transition-all ${
                  selectedType === t
                    ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-bold"
                    : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {/* Run Button */}
      <button
        type="button"
        onClick={handleLookup}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-lg bg-[#22D3EE] text-[#0B0F1A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#22D3EE]/90 transition-all shadow-lg shadow-[#22D3EE]/10 disabled:opacity-50"
      >
        <Search className="w-4 h-4" />
        <span>{loading ? "Resolving DNS..." : "Lookup DNS Records"}</span>
      </button>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] flex items-center justify-between">
        <div>
          <div className="text-xs text-[#8B95AD]">Resolved Domain</div>
          <div className="text-lg font-bold font-mono text-[#E6EAF2]">{result?.domain || domain}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#8B95AD]">Total Records</div>
          <div className="text-xl font-bold font-mono text-[#22D3EE]">
            {result?.records.length ?? 0}
          </div>
        </div>
      </div>

      {/* Email Security (SPF & DMARC) Cards */}
      {result && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#E6EAF2]">
              {result.spf ? (
                <ShieldCheck className="w-4 h-4 text-green-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              )}
              <span>SPF Policy</span>
            </div>
            <div className="text-[11px] text-[#8B95AD] font-mono break-all select-all">
              {result.spf || "No SPF record found (Spoofing risk)"}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#E6EAF2]">
              {result.dmarc ? (
                <ShieldCheck className="w-4 h-4 text-green-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              )}
              <span>DMARC Policy</span>
            </div>
            <div className="text-[11px] text-[#8B95AD] font-mono break-all select-all">
              {result.dmarc || "No DMARC record found"}
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <span>DNS Zone Records</span>
          {result && result.records.length > 0 && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[#22D3EE] hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Records"}
            </button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto border border-[#232C42] rounded-xl bg-[#0B0F1A]">
          {!result ? (
            <div className="p-8 text-center text-xs text-[#8B95AD]">
              Enter domain and click &quot;Lookup DNS Records&quot; to fetch live DoH responses.
            </div>
          ) : result.records.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8B95AD]">
              No {selectedType} records found for this domain.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#121828] text-[#8B95AD] sticky top-0 border-b border-[#232C42]">
                <tr>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">TTL</th>
                  <th className="py-2 px-3">Data / Answer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232C42]/50 text-[#E6EAF2]">
                {result.records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#121828]/50">
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#22D3EE]/15 text-[#22D3EE] font-bold text-[10px]">
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#8B95AD]">{r.ttl}s</td>
                    <td className="py-2 px-3 break-all select-all">{r.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="dns-lookup"
      input={inputPanel}
      output={outputPanel}
      loading={loading}
      error={error}
      onRunShortcut={handleLookup}
    />
  );
}
