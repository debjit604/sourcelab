"use client";

import React, { useState, useCallback } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { processEmi, EmiProcessOutput, formatInr } from "./process";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Calendar, Percent, IndianRupee } from "lucide-react";

export default function EmiCalculatorToolComponent() {
  const [principal, setPrincipal] = useState(2500000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);

  const [output, setOutput] = useState<EmiProcessOutput | null>(() => {
    try {
      return processEmi({ principal: 2500000, annualRate: 8.5, tenureYears: 15 });
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string | null>(null);

  const handleCompute = useCallback(
    (p = principal, r = annualRate, y = tenureYears) => {
      try {
        setError(null);
        const res = processEmi({ principal: p, annualRate: r, tenureYears: y });
        setOutput(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
        setOutput(null);
      }
    },
    [principal, annualRate, tenureYears]
  );

  const presets = [
    { label: "Home Loan", p: 5000000, r: 8.5, y: 20 },
    { label: "Car Loan", p: 1000000, r: 9.0, y: 5 },
    { label: "Personal Loan", p: 300000, r: 12.0, y: 3 },
  ];

  return (
    <ToolShell
      toolId="emi-calculator"
      downloadFilename="loan-amortization-schedule.txt"
      downloadMimeType="text/plain"
      onRunShortcut={() => handleCompute()}
      input={
        <div className="space-y-5">
          {/* Controls Bar & Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--sl-muted)]">
              <Calculator className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
              <span>Loan EMI Calculator</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPrincipal(2500000);
                setAnnualRate(8.5);
                setTenureYears(15);
                handleCompute(2500000, 8.5, 15);
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-[var(--sl-muted)] hover:text-[var(--sl-text)] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[var(--sl-muted)] text-[11px] mr-1">Presets:</span>
            {presets.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPrincipal(item.p);
                  setAnnualRate(item.r);
                  setTenureYears(item.y);
                  handleCompute(item.p, item.r, item.y);
                }}
                className="px-2 py-0.5 rounded bg-[var(--sl-surface)] hover:text-[var(--sl-accent)] border border-[var(--sl-border)] text-[11px] text-[var(--sl-muted)] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Controls */}
          <div className="space-y-4 p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs">
            {/* Principal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="flex items-center gap-1 text-[var(--sl-text)] font-medium">
                  <IndianRupee className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                  Loan Amount (Principal)
                </span>
                <span className="px-2 py-0.5 rounded bg-[var(--sl-surface)] text-[var(--sl-accent)] font-bold text-sm">
                  {formatInr(principal)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={20000000}
                step={50000}
                value={principal}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPrincipal(val);
                  handleCompute(val, annualRate, tenureYears);
                }}
                className="w-full accent-[var(--sl-accent)] cursor-pointer"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between font-mono">
                <span className="flex items-center gap-1 text-[var(--sl-text)] font-medium">
                  <Percent className="w-3.5 h-3.5 text-[var(--sl-warning)]" />
                  Annual Interest Rate
                </span>
                <span className="px-2 py-0.5 rounded bg-[var(--sl-surface)] text-[var(--sl-warning)] font-bold text-sm">
                  {annualRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.1}
                value={annualRate}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAnnualRate(val);
                  handleCompute(principal, val, tenureYears);
                }}
                className="w-full accent-[var(--sl-warning)] cursor-pointer"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between font-mono">
                <span className="flex items-center gap-1 text-[var(--sl-text)] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[var(--sl-success)]" />
                  Loan Tenure
                </span>
                <span className="px-2 py-0.5 rounded bg-[var(--sl-surface)] text-[var(--sl-success)] font-bold text-sm">
                  {tenureYears} Years ({tenureYears * 12} Mos)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTenureYears(val);
                  handleCompute(principal, annualRate, val);
                }}
                className="w-full accent-[var(--sl-success)] cursor-pointer"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={() => handleCompute()}
            className="w-full font-heading font-semibold"
          >
            Calculate EMI (Ctrl + Enter)
          </Button>
        </div>
      }
      output={
        output ? (
          <div className="space-y-4">
            {/* Primary Monthly EMI Banner */}
            <div className="p-5 rounded-2xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center space-y-1">
              <span className="text-xs font-mono text-[var(--sl-muted)] uppercase tracking-wider block">
                Monthly Loan EMI
              </span>
              <span className="text-3xl md:text-4xl font-heading font-bold text-[var(--sl-accent)] block">
                {formatInr(output.monthlyEmi)}
              </span>
              <span className="text-xs font-mono text-[var(--sl-muted)] block">
                per month for {output.tenureMonths} months
              </span>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-1">
                <span className="text-[11px] font-mono text-[var(--sl-muted)] block">Total Interest</span>
                <span className="text-lg font-heading font-bold text-[var(--sl-warning)] block">
                  {formatInr(output.totalInterest)}
                </span>
                <span className="text-[10px] font-mono text-[var(--sl-muted)] block">
                  {output.interestRatio}% of total
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-1">
                <span className="text-[11px] font-mono text-[var(--sl-muted)] block">Total Amount Payable</span>
                <span className="text-lg font-heading font-bold text-[var(--sl-text)] block">
                  {formatInr(output.totalPayment)}
                </span>
                <span className="text-[10px] font-mono text-[var(--sl-muted)] block">
                  Principal + Interest
                </span>
              </div>
            </div>

            {/* Principal vs Interest Ratio Bar */}
            <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--sl-accent)]">Principal ({output.principalRatio}%)</span>
                <span className="text-[var(--sl-warning)]">Interest ({output.interestRatio}%)</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--sl-surface)]">
                <div style={{ width: `${output.principalRatio}%` }} className="bg-[var(--sl-accent)] h-full" />
                <div style={{ width: `${output.interestRatio}%` }} className="bg-[var(--sl-warning)] h-full" />
              </div>
            </div>

            {/* Amortization Table */}
            <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-2">
              <span className="text-xs font-heading font-semibold text-[var(--sl-text)] block">
                Yearly Amortization Schedule
              </span>
              <div className="overflow-x-auto max-h-[220px]">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-[var(--sl-border)] text-[var(--sl-muted)] text-[10px]">
                      <th className="py-1.5 px-2">Year</th>
                      <th className="py-1.5 px-2">Principal</th>
                      <th className="py-1.5 px-2">Interest</th>
                      <th className="py-1.5 px-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--sl-border)]">
                    {output.schedule.map((row) => (
                      <tr key={row.year} className="hover:bg-[var(--sl-surface)] transition-colors">
                        <td className="py-1.5 px-2 text-[var(--sl-muted)]">{row.year}</td>
                        <td className="py-1.5 px-2 text-[var(--sl-accent)]">{formatInr(row.principalPaid)}</td>
                        <td className="py-1.5 px-2 text-[var(--sl-warning)]">{formatInr(row.interestPaid)}</td>
                        <td className="py-1.5 px-2 text-right text-[var(--sl-text)]">{formatInr(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null
      }
      error={error}
    />
  );
}
