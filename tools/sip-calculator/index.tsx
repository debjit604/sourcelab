"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import {
  calculateSip,
  formatINR,
  formatCompactINR,
  generateSipSummaryText,
  SipResult,
} from "./process";

export default function SipCalculatorTool() {
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState<number>(10000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [stepUp, setStepUp] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const result: SipResult = useMemo(() => {
    return calculateSip({
      monthlyInvestment: amount,
      expectedReturnRate: returnRate,
      timePeriodYears: tenureYears,
      mode,
      stepUpPercent: stepUp,
    });
  }, [amount, returnRate, tenureYears, mode, stepUp]);

  const investedPercent = useMemo(() => {
    if (result.totalValue === 0) return 50;
    return Math.min(100, Math.max(0, (result.investedAmount / result.totalValue) * 100));
  }, [result]);

  const returnsPercent = 100 - investedPercent;

  const handleCopySummary = async () => {
    const text = generateSipSummaryText(result, {
      mode,
      amount,
      returnRate,
      tenureYears,
      stepUp,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-5">
      <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
        <button
          type="button"
          onClick={() => setMode("sip")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            mode === "sip" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Monthly SIP
        </button>
        <button
          type="button"
          onClick={() => setMode("lumpsum")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            mode === "lumpsum" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Lumpsum (One-Time)
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <label className="text-[#E6EAF2] font-medium">
            {mode === "sip" ? "Monthly Investment" : "Total Lumpsum"}
          </label>
          <span className="text-[#22D3EE] font-mono font-bold">{formatINR(amount)}</span>
        </div>
        <Input
          type="number"
          min={100}
          max={10000000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          className="bg-[#121828] border-[#232C42] text-[#E6EAF2]"
        />
        <input
          type="range"
          min={500}
          max={mode === "sip" ? 100000 : 1000000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-[#22D3EE]"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <label className="text-[#E6EAF2] font-medium">Expected Return Rate (p.a.)</label>
          <span className="text-[#22D3EE] font-mono font-bold">{returnRate}%</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={0.5}
          value={returnRate}
          onChange={(e) => setReturnRate(Number(e.target.value))}
          className="w-full accent-[#22D3EE]"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <label className="text-[#E6EAF2] font-medium">Time Period (Years)</label>
          <span className="text-[#22D3EE] font-mono font-bold">{tenureYears} Yr</span>
        </div>
        <input
          type="range"
          min={1}
          max={40}
          step={1}
          value={tenureYears}
          onChange={(e) => setTenureYears(Number(e.target.value))}
          className="w-full accent-[#22D3EE]"
        />
      </div>

      {mode === "sip" && (
        <div className="space-y-1.5 pt-2 border-t border-[#232C42]/60">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <label className="text-[#8B95AD]">Annual Step-up (Optional)</label>
            <span className="text-[#22D3EE] font-mono font-bold">{stepUp}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={25}
            step={5}
            value={stepUp}
            onChange={(e) => setStepUp(Number(e.target.value))}
            className="w-full accent-[#22D3EE]"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: "₹5K/12%/10Y", a: 5000, r: 12, y: 10 },
          { label: "₹10K/14%/15Y", a: 10000, r: 14, y: 15 },
          { label: "₹25K/12%/20Y", a: 25000, r: 12, y: 20 },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setAmount(p.a); setReturnRate(p.r); setTenureYears(p.y); setMode("sip"); }}
            className="px-2 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
          <div className="text-xs text-[#8B95AD]">Invested Amount</div>
          <div className="text-base sm:text-lg font-bold text-[#E6EAF2] font-mono mt-1">
            {formatINR(result.investedAmount)}
          </div>
          <div className="text-[11px] text-[#8B95AD] mt-0.5">{formatCompactINR(result.investedAmount)}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
          <div className="text-xs text-[#8B95AD]">Est. Wealth Returns</div>
          <div className="text-base sm:text-lg font-bold text-[#34D399] font-mono mt-1">
            +{formatINR(result.estimatedReturns)}
          </div>
          <div className="text-[11px] text-[#34D399]/80 mt-0.5">{formatCompactINR(result.estimatedReturns)}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#22D3EE]/40 bg-gradient-to-br from-[#22D3EE]/5 to-transparent">
          <div className="text-xs text-[#22D3EE] font-medium">Total Maturity Value</div>
          <div className="text-lg sm:text-xl font-bold text-[#22D3EE] font-mono mt-1">
            {formatINR(result.totalValue)}
          </div>
          <div className="text-[11px] text-[#22D3EE]/80 mt-0.5 font-semibold">
            {formatCompactINR(result.totalValue)}
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#8B95AD] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
            Invested ({investedPercent.toFixed(1)}%)
          </span>
          <span className="text-[#34D399] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
            Returns ({returnsPercent.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#0B0F1A] overflow-hidden flex">
          <div style={{ width: `${investedPercent}%` }} className="bg-[#22D3EE] transition-all duration-300" />
          <div style={{ width: `${returnsPercent}%` }} className="bg-[#34D399] transition-all duration-300" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleCopySummary}
          variant="outline"
          size="sm"
          className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
        >
          {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? "Copied!" : "Copy Summary"}
        </Button>
        <Button
          onClick={() => setShowTable((prev) => !prev)}
          variant="outline"
          size="sm"
          className="border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2] hover:bg-[#1A2234]"
        >
          {showTable ? "Hide Yearly Table" : "Show Yearly Table"}
        </Button>
      </div>

      {showTable && (
        <div className="rounded-xl border border-[#232C42] overflow-x-auto max-h-64 scrollbar-thin">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0B0F1A] text-[#8B95AD] sticky top-0">
              <tr>
                <th className="p-2.5">Year</th>
                <th className="p-2.5">Invested</th>
                <th className="p-2.5">Est. Returns</th>
                <th className="p-2.5">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232C42]">
              {result.yearlyBreakdown.map((row) => (
                <tr key={row.year} className="hover:bg-[#1A2234]/50">
                  <td className="p-2.5 font-medium text-[#E6EAF2]">Yr {row.year}</td>
                  <td className="p-2.5 text-[#8B95AD] font-mono">{formatINR(row.invested)}</td>
                  <td className="p-2.5 text-[#34D399] font-mono">+{formatINR(row.returns)}</td>
                  <td className="p-2.5 text-[#22D3EE] font-mono font-medium">{formatINR(row.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="sip-calculator"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
