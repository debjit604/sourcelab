"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import {
  convertUnits,
  UNIT_CONFIG,
  UnitCategory,
} from "./process";
import { ArrowRightLeft, Copy, Check, Scale } from "lucide-react";

export default function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("ft");
  const [copied, setCopied] = useState<boolean>(false);

  const availableUnits = useMemo(() => {
    return Object.values(UNIT_CONFIG[category].units);
  }, [category]);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = Object.keys(UNIT_CONFIG[cat].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const { result, error } = useMemo(() => {
    try {
      const res = convertUnits(value, fromUnit, toUnit, category);
      return { result: res, error: null };
    } catch (err: unknown) {
      return {
        result: null,
        error: err instanceof Error ? err.message : "Conversion error",
      };
    }
  }, [value, fromUnit, toUnit, category]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#121828] border border-[#232C42] rounded-lg">
        {(Object.keys(UNIT_CONFIG) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-all capitalize ${
              category === cat
                ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
                : "text-[#8B95AD] hover:text-[#E6EAF2]"
            }`}
          >
            {UNIT_CONFIG[cat].name}
          </button>
        ))}
      </div>

      {/* Value Input */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">Value to Convert</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full px-3 py-2 text-lg font-mono font-bold bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
        />
      </div>

      {/* From and To Selector Grid */}
      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
        <div className="space-y-1">
          <label className="text-xs text-[#8B95AD]">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-2.5 py-2 text-xs font-medium bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          >
            {availableUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="p-2.5 rounded-lg bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE] hover:border-[#22D3EE] transition-all self-end mb-0.5"
          title="Swap Units"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <label className="text-xs text-[#8B95AD]">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-2.5 py-2 text-xs font-medium bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
          >
            {availableUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Primary Result Card */}
      <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] text-center space-y-2">
        <div className="text-xs text-[#8B95AD] uppercase tracking-wider font-medium">
          {result?.fromUnitName} → {result?.toUnitName}
        </div>
        <div className="text-4xl font-black font-mono text-[#22D3EE] break-all">
          {result ? result.formattedResult : "--"}
        </div>
        <div className="text-xs text-[#8B95AD]">
          {value} {fromUnit} = {result?.formattedResult} {toUnit}
        </div>
        {result && (
          <button
            type="button"
            onClick={() => handleCopy(result.formattedResult)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-[#0B0F1A] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Result"}
          </button>
        )}
      </div>

      {/* All Units Comparison Table */}
      {result && result.allConversions.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#E6EAF2]">
            <Scale className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Equivalent in all {category} units:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {result.allConversions.map((item) => (
              <div
                key={item.unitId}
                className="p-2 rounded bg-[#0B0F1A] border border-[#232C42] flex justify-between items-center"
              >
                <span className="text-[#8B95AD] text-[11px] truncate">{item.unitName}:</span>
                <span className="font-mono font-bold text-[#E6EAF2] ml-2">
                  {item.formatted}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="unit-converter"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
