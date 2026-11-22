"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { convertNumber } from "./process";
import { Copy, Check, FileCheck, Globe, CreditCard } from "lucide-react";

export default function NumberToWordsTool() {
  const [input, setInput] = useState<string>("1250000");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: null, error: null };
    try {
      const res = convertNumber(input);
      return { result: res, error: null };
    } catch (err: unknown) {
      return {
        result: null,
        error: err instanceof Error ? err.message : "Invalid number format",
      };
    }
  }, [input]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Number Input */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">
          Enter Amount or Number
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 500000 or 12345.75"
          className="w-full px-3 py-2.5 text-lg font-mono font-bold bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* Quick Rupee Presets */}
      <div className="space-y-1.5">
        <div className="text-xs text-[#8B95AD]">Quick Presets:</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setInput("50000")}
            className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            ₹50,000 (Fifty Thousand)
          </button>
          <button
            type="button"
            onClick={() => setInput("100000")}
            className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            ₹1 Lakh (1,00,000)
          </button>
          <button
            type="button"
            onClick={() => setInput("1000000")}
            className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            ₹10 Lakh (10,00,000)
          </button>
          <button
            type="button"
            onClick={() => setInput("10000000")}
            className="px-2.5 py-1 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            ₹1 Crore (1,00,00,000)
          </button>
        </div>
      </div>

      {/* Formatted Number Display */}
      {result && (
        <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] flex items-center justify-between text-xs">
          <span className="text-[#8B95AD]">Indian Currency Separator:</span>
          <span className="font-mono text-sm font-bold text-[#22D3EE]">
            ₹{result.formattedNumber}
          </span>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Cheque / Banking Format Card */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <div className="flex items-center gap-1.5 font-medium text-[#E6EAF2]">
            <CreditCard className="w-3.5 h-3.5 text-green-400" />
            <span>Bank Cheque Format (Words)</span>
          </div>
          <button
            type="button"
            onClick={() => result && copyToClipboard(result.chequeFormat, "cheque")}
            disabled={!result}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
          >
            {copiedType === "cheque" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedType === "cheque" ? "Copied" : "Copy for Cheque"}
          </button>
        </div>
        <div className="font-medium text-sm text-green-400 bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] select-all">
          {result?.chequeFormat || "Cheque format yahan aayega..."}
        </div>
      </div>

      {/* Indian Lakhs/Crores Card */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <div className="flex items-center gap-1.5 font-medium text-[#E6EAF2]">
            <FileCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Indian Numbering System</span>
          </div>
          <button
            type="button"
            onClick={() => result && copyToClipboard(result.indian, "indian")}
            disabled={!result}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
          >
            {copiedType === "indian" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedType === "indian" ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="font-medium text-sm text-[#E6EAF2] bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] select-all">
          {result?.indian || "Indian words yahan aayenge..."}
        </div>
      </div>

      {/* International System Card */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <div className="flex items-center gap-1.5 font-medium text-[#E6EAF2]">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>International System (Millions / Billions)</span>
          </div>
          <button
            type="button"
            onClick={() => result && copyToClipboard(result.international, "intl")}
            disabled={!result}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
          >
            {copiedType === "intl" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedType === "intl" ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="font-medium text-sm text-[#E6EAF2] bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] select-all">
          {result?.international || "International words yahan aayenge..."}
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="number-to-words"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
