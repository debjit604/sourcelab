"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  calculateCompoundInterest,
  CompoundingFrequency,
} from "./process";
import { TrendingUp, DollarSign, Table } from "lucide-react";

export default function CompoundInterestTool() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [ratePct, setRatePct] = useState<number>(8.5);
  const [years, setYears] = useState<number>(5);
  const [frequency, setFrequency] = useState<CompoundingFrequency>(1);

  const { result, error } = useMemo(() => {
    try {
      const res = calculateCompoundInterest(principal, ratePct, years, frequency);
      return { result: res, error: null };
    } catch (err: unknown) {
      return {
        result: null,
        error: err instanceof Error ? err.message : "Calculation error",
      };
    }
  }, [principal, ratePct, years, frequency]);

  const inputPanel = (
    <div className="space-y-4">
      {/* Principal Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#8B95AD] font-medium">Principal Amount (₹)</span>
          <span className="font-mono text-base font-bold text-[#E6EAF2]">
            ₹{principal.toLocaleString("en-IN")}
          </span>
        </div>
        <input
          type="range"
          min={5000}
          max={2000000}
          step={5000}
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
          className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
        />
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-1.5 text-xs font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Annual Rate (%) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#8B95AD] font-medium">Annual Interest Rate (%)</span>
          <span className="font-mono text-base font-bold text-[#E6EAF2]">
            {ratePct}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          step={0.1}
          value={ratePct}
          onChange={(e) => setRatePct(Number(e.target.value))}
          className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
        />
      </div>

      {/* Time Period (Years) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#8B95AD] font-medium">Time Period (Years)</span>
          <span className="font-mono text-base font-bold text-[#E6EAF2]">
            {years} {years === 1 ? "Year" : "Years"}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={35}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
        />
      </div>

      {/* Compounding Frequency */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">
          Compounding Frequency
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "Annually (1/yr)", val: 1 as CompoundingFrequency },
            { label: "Semi-Annually (2/yr)", val: 2 as CompoundingFrequency },
            { label: "Quarterly (4/yr)", val: 4 as CompoundingFrequency },
            { label: "Monthly (12/yr)", val: 12 as CompoundingFrequency },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => setFrequency(item.val)}
              className={`py-2 px-2.5 rounded-lg border text-left transition-all ${
                frequency === item.val
                  ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-medium"
                  : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Total Maturity Value Card */}
      <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] text-center space-y-1.5">
        <div className="text-xs text-[#8B95AD] uppercase tracking-wider font-medium">
          Total Maturity Value
        </div>
        <div className="text-4xl font-black font-mono text-[#22D3EE]">
          ₹{result?.finalAmount.toLocaleString("en-IN") || "--"}
        </div>
        <div className="text-xs text-green-400 font-medium">
          {result?.growthMultiple}x Wealth Multiplier
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD] flex items-center justify-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Invested Principal</span>
          </div>
          <div className="text-lg font-bold font-mono text-[#E6EAF2] mt-1">
            ₹{result?.principal.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD] flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span>Total Compound Interest</span>
          </div>
          <div className="text-lg font-bold font-mono text-green-400 mt-1">
            ₹{result?.totalInterest.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Yearly Growth Schedule Table */}
      {result && result.breakdown.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#E6EAF2]">
            <Table className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Year-by-Year Growth Table</span>
          </div>
          <div className="max-h-48 overflow-y-auto border border-[#232C42] rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0B0F1A] text-[#8B95AD] sticky top-0">
                <tr>
                  <th className="py-2 px-3">Year</th>
                  <th className="py-2 px-3">Interest Earned</th>
                  <th className="py-2 px-3">End Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232C42]/50 text-[#E6EAF2]">
                {result.breakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-[#0B0F1A]/50">
                    <td className="py-1.5 px-3 text-[#8B95AD]">Yr {row.year}</td>
                    <td className="py-1.5 px-3 text-green-400">
                      +₹{row.interestEarned.toLocaleString("en-IN")}
                    </td>
                    <td className="py-1.5 px-3 font-semibold">
                      ₹{row.closingBalance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="compound-interest"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
