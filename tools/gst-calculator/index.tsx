"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { calculateGst, formatINR, generateGstSummary, GstType } from "./process";
import { RotateCcw } from "lucide-react";

const SLABS = [
  { rate: 0, label: "0%", desc: "Nil" },
  { rate: 5, label: "5%", desc: "Essentials" },
  { rate: 12, label: "12%", desc: "Standard" },
  { rate: 18, label: "18%", desc: "Services" },
  { rate: 28, label: "28%", desc: "Luxury" },
];

const PRESETS = [1000, 5000, 10000, 25000, 50000, 100000];

export default function GstCalculatorTool() {
  const [amountStr, setAmountStr] = useState("10000");
  const [rate, setRate] = useState(18);
  const [customRateStr, setCustomRateStr] = useState("");
  const [gstType, setGstType] = useState<GstType>("exclusive");
  const [transactionType, setTransactionType] = useState<"intra" | "inter">("intra");

  const parsedAmount = parseFloat(amountStr) || 0;
  const activeRate = customRateStr ? parseFloat(customRateStr) || 0 : rate;

  const result = calculateGst({
    amount: parsedAmount,
    rate: activeRate,
    type: gstType,
  });

  const summaryText = generateGstSummary(result, transactionType);

  const handleReset = () => {
    setAmountStr("10000");
    setRate(18);
    setCustomRateStr("");
    setGstType("exclusive");
    setTransactionType("intra");
  };

  return (
    <ToolShell
      toolId="gst-calculator"
      downloadFilename={`gst-breakdown-${parsedAmount}.txt`}
      downloadMimeType="text/plain"
      input={
        <div className="space-y-5">
          {/* GST Mode Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase">Mode:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGstType("exclusive")}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  gstType === "exclusive"
                    ? "bg-[rgba(34,211,238,0.15)] border-[var(--sl-accent)] text-[var(--sl-text)] font-semibold shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                <div className="text-xs font-sans font-medium">GST Exclusive</div>
                <div className="text-[10px] font-mono text-[var(--sl-muted)]">Tax jodo (+)</div>
              </button>
              <button
                type="button"
                onClick={() => setGstType("inclusive")}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  gstType === "inclusive"
                    ? "bg-[rgba(34,211,238,0.15)] border-[var(--sl-accent)] text-[var(--sl-text)] font-semibold shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                <div className="text-xs font-sans font-medium">GST Inclusive</div>
                <div className="text-[10px] font-mono text-[var(--sl-muted)]">Tax nikaalo (-)</div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="gst-amount-input" className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase">
                {gstType === "exclusive" ? "Base Amount (₹)" : "Gross MRP Amount (₹)"}
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-accent)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sl-accent)] font-bold font-mono">₹</span>
              <input
                id="gst-amount-input"
                type="number"
                min={0}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Amount enter karo..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-[var(--sl-text)] font-mono text-sm outline-none"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmountStr(p.toString())}
                  className={`px-2 py-0.5 text-xs font-mono rounded-lg transition-colors ${
                    parsedAmount === p
                      ? "bg-[var(--sl-accent)] text-slate-950 font-bold"
                      : "bg-[var(--sl-surface)] border border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                  }`}
                >
                  ₹{(p / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* GST Slabs */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase block">GST Rate (%):</label>
            <div className="grid grid-cols-5 gap-1.5">
              {SLABS.map((s) => (
                <button
                  key={s.rate}
                  type="button"
                  onClick={() => { setRate(s.rate); setCustomRateStr(""); }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    !customRateStr && rate === s.rate
                      ? "bg-[rgba(34,211,238,0.2)] border-[var(--sl-accent)] text-[var(--sl-accent)] font-bold"
                      : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
                  }`}
                >
                  <div className="text-xs font-mono font-semibold">{s.label}</div>
                  <div className="text-[9px] text-[var(--sl-muted)] truncate">{s.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-mono text-[var(--sl-muted)]">Custom:</span>
              <div className="relative w-28">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={customRateStr}
                  onChange={(e) => setCustomRateStr(e.target.value)}
                  placeholder="Rate %"
                  className="w-full px-2.5 py-1 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-xs text-[var(--sl-text)] font-mono outline-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--sl-muted)]">%</span>
              </div>
            </div>
          </div>

          {/* Territory */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--sl-border)]">
            <label className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase block">Territory:</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <button
                type="button"
                onClick={() => setTransactionType("intra")}
                className={`py-2 px-3 rounded-lg border transition-all ${
                  transactionType === "intra"
                    ? "bg-[rgba(34,211,238,0.1)] border-[var(--sl-accent)] text-[var(--sl-text)] font-medium"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                Same State (CGST + SGST)
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("inter")}
                className={`py-2 px-3 rounded-lg border transition-all ${
                  transactionType === "inter"
                    ? "bg-[rgba(34,211,238,0.1)] border-[var(--sl-accent)] text-[var(--sl-text)] font-medium"
                    : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)]"
                }`}
              >
                Inter-State (IGST)
              </button>
            </div>
          </div>
        </div>
      }
      output={
        <div className="space-y-5">
          {/* Hero Result Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[rgba(34,211,238,0.15)] via-[var(--sl-surface)] to-[var(--sl-bg)] border border-[rgba(34,211,238,0.3)] space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--sl-accent)]">
              {gstType === "exclusive" ? "Total Gross Payable" : "Net Base Amount"}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--sl-text)] tracking-tight">
              {formatINR(gstType === "exclusive" ? result.grossAmount : result.netAmount)}
            </div>
            <p className="text-xs text-[var(--sl-muted)] font-mono">
              {gstType === "exclusive" ? `Base ${formatINR(result.netAmount)} + ${result.rate}% GST` : `Total ${formatINR(result.grossAmount)} se ${result.rate}% GST nikaala`}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-0.5">
              <span className="text-[11px] font-mono text-[var(--sl-muted)]">Base Net Price</span>
              <div className="text-base font-bold font-mono text-[var(--sl-text)]">{formatINR(result.netAmount)}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-0.5">
              <span className="text-[11px] font-mono text-[var(--sl-muted)]">Total GST ({result.rate}%)</span>
              <div className="text-base font-bold font-mono text-[var(--sl-accent)]">+ {formatINR(result.gstAmount)}</div>
            </div>
          </div>

          {/* Tax Division */}
          <div className="p-4 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--sl-muted)]">
              <span>Tax Split:</span>
              <span className="text-[var(--sl-accent)] font-semibold">{formatINR(result.gstAmount)}</span>
            </div>
            {transactionType === "intra" ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]">
                  <span className="text-[var(--sl-muted)]">CGST ({(result.rate / 2).toFixed(1)}%)</span>
                  <div className="text-[var(--sl-text)] font-bold text-sm mt-0.5">{formatINR(result.cgst)}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)]">
                  <span className="text-[var(--sl-muted)]">SGST ({(result.rate / 2).toFixed(1)}%)</span>
                  <div className="text-[var(--sl-text)] font-bold text-sm mt-0.5">{formatINR(result.sgst)}</div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--sl-muted)]">IGST ({result.rate}%)</span>
                <span className="text-[var(--sl-text)] font-bold text-sm">{formatINR(result.igst)}</span>
              </div>
            )}
            {/* Proportion Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-[var(--sl-muted)]">
                <span>Base: {result.grossAmount > 0 ? ((result.netAmount / result.grossAmount) * 100).toFixed(1) : 0}%</span>
                <span>GST: {result.grossAmount > 0 ? ((result.gstAmount / result.grossAmount) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--sl-border)] overflow-hidden flex">
                <div className="h-full bg-[var(--sl-accent)]" style={{ width: `${result.grossAmount > 0 ? (result.netAmount / result.grossAmount) * 100 : 100}%` }} />
                <div className="h-full bg-[var(--sl-warning)]" style={{ width: `${result.grossAmount > 0 ? (result.gstAmount / result.grossAmount) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Copyable Summary */}
          <pre className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[11px] font-mono text-[var(--sl-muted)] overflow-x-auto whitespace-pre leading-relaxed select-all">
            {summaryText}
          </pre>
        </div>
      }
    />
  );
}
