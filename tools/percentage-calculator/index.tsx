"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentChange,
  calculateDiscount,
  CalcMode,
} from "./process";
import { Copy, Check, Calculator } from "lucide-react";

export default function PercentageCalculatorTool() {
  const [mode, setMode] = useState<CalcMode>("percent-of");
  const [val1, setVal1] = useState<string>("18");
  const [val2, setVal2] = useState<string>("5000");
  const [copied, setCopied] = useState<boolean>(false);

  const { result, error } = useMemo(() => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if (isNaN(num1) || isNaN(num2)) {
      return { result: null, error: null };
    }

    try {
      if (mode === "percent-of") {
        return { result: calculatePercentOf(num1, num2), error: null };
      } else if (mode === "what-percent") {
        return { result: calculateWhatPercent(num1, num2), error: null };
      } else if (mode === "percent-change") {
        return { result: calculatePercentChange(num1, num2), error: null };
      } else {
        return { result: calculateDiscount(num1, num2), error: null };
      }
    } catch (err: unknown) {
      return {
        result: null,
        error: err instanceof Error ? err.message : "Calculation error",
      };
    }
  }, [mode, val1, val2]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLabels = () => {
    switch (mode) {
      case "percent-of":
        return { l1: "Percentage (%)", l2: "Total Amount / Number" };
      case "what-percent":
        return { l1: "Part / Value", l2: "Total Number" };
      case "percent-change":
        return { l1: "Initial / Old Value", l2: "New / Final Value" };
      case "discount":
        return { l1: "Original Price (₹)", l2: "Discount Percentage (%)" };
    }
  };

  const labels = getLabels();

  const inputPanel = (
    <div className="space-y-4">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#121828] border border-[#232C42] rounded-lg">
        <button
          type="button"
          onClick={() => {
            setMode("percent-of");
            setVal1("18");
            setVal2("5000");
          }}
          className={`py-2 px-2 text-xs font-medium rounded transition-all ${
            mode === "percent-of"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          What is P% of X?
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("what-percent");
            setVal1("250");
            setVal2("1000");
          }}
          className={`py-2 px-2 text-xs font-medium rounded transition-all ${
            mode === "what-percent"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          X is what % of Y?
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("percent-change");
            setVal1("1000");
            setVal2("1250");
          }}
          className={`py-2 px-2 text-xs font-medium rounded transition-all ${
            mode === "percent-change"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          % Increase / Decrease
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("discount");
            setVal1("2999");
            setVal2("25");
          }}
          className={`py-2 px-2 text-xs font-medium rounded transition-all ${
            mode === "discount"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Shopping Discount
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-[#8B95AD] font-medium">{labels.l1}</label>
          <input
            type="number"
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
            className="w-full px-3 py-2 text-base font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[#8B95AD] font-medium">{labels.l2}</label>
          <input
            type="number"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
            className="w-full px-3 py-2 text-base font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Common GST/Taxes:</span>
        {[5, 12, 18, 28].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => {
              setMode("percent-of");
              setVal1(String(pct));
            }}
            className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {pct}%
          </button>
        ))}
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Result Card */}
      <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] text-center space-y-2">
        <div className="text-xs text-[#8B95AD] uppercase tracking-wider font-medium">
          Calculated Result
        </div>
        <div className="text-4xl font-black font-mono text-[#22D3EE]">
          {result ? result.formatted : "--"}
        </div>
        {result?.formula && (
          <div className="text-xs text-[#8B95AD] font-mono pt-1">
            {result.formula}
          </div>
        )}
      </div>

      {/* Breakdown Details if discount or percent change */}
      {result?.details && (
        <div className="grid grid-cols-2 gap-3 text-center">
          {Object.entries(result.details).map(([key, val]) => (
            <div key={key} className="p-3 rounded-lg bg-[#121828] border border-[#232C42]">
              <div className="text-[10px] text-[#8B95AD] capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </div>
              <div className="text-lg font-bold font-mono text-[#E6EAF2]">
                {String(val)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Copy Button */}
      {result && (
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2.5 px-3 rounded-lg bg-[#121828] border border-[#232C42] hover:border-[#22D3EE] text-xs text-[#E6EAF2] flex items-center justify-center gap-2 transition-all font-medium"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#22D3EE]" />}
          {copied ? "Result Copied!" : "Copy Result to Clipboard"}
        </button>
      )}

      {/* Info Notice */}
      <div className="p-3 rounded-lg bg-[#0B0F1A] border border-[#232C42] flex items-center gap-2 text-xs text-[#8B95AD]">
        <Calculator className="w-4 h-4 text-[#22D3EE] shrink-0" />
        <span>Results are computed instantly in your browser with mathematical precision.</span>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="percentage-calculator"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
