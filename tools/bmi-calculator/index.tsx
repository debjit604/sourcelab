"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { calculateBmi, imperialToMetric } from "./process";
import { Activity, Heart, Info } from "lucide-react";

export default function BmiCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(172);

  // Imperial states
  const [weightLbs, setWeightLbs] = useState<number>(150);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);

  const [useAsianCutoff, setUseAsianCutoff] = useState<boolean>(true);

  const effectiveMetrics = useMemo(() => {
    if (unit === "metric") {
      return { weight: weightKg, height: heightCm };
    } else {
      const converted = imperialToMetric(weightLbs, feet, inches);
      return { weight: converted.weightKg, height: converted.heightCm };
    }
  }, [unit, weightKg, heightCm, weightLbs, feet, inches]);

  const { result, error } = useMemo(() => {
    try {
      const res = calculateBmi(
        effectiveMetrics.weight,
        effectiveMetrics.height,
        useAsianCutoff
      );
      return { result: res, error: null };
    } catch (err: unknown) {
      return {
        result: null,
        error: err instanceof Error ? err.message : "Calculation error",
      };
    }
  }, [effectiveMetrics, useAsianCutoff]);

  const categoryLabel = useMemo(() => {
    if (!result) return "";
    return useAsianCutoff ? result.asianCategory : result.category;
  }, [result, useAsianCutoff]);

  const inputPanel = (
    <div className="space-y-4">
      {/* Unit Switcher */}
      <div className="flex gap-2 p-1 bg-[#121828] border border-[#232C42] rounded-lg">
        <button
          type="button"
          onClick={() => setUnit("metric")}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
            unit === "metric"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Metric (kg, cm)
        </button>
        <button
          type="button"
          onClick={() => setUnit("imperial")}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
            unit === "imperial"
              ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE]"
              : "text-[#8B95AD] hover:text-[#E6EAF2]"
          }`}
        >
          Imperial (lbs, ft/in)
        </button>
      </div>

      {/* Input Sliders / Numbers */}
      {unit === "metric" ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8B95AD]">Weight (kg)</span>
              <span className="font-mono text-base font-bold text-[#E6EAF2]">
                {weightKg} kg
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={160}
              step={0.5}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8B95AD]">Height (cm)</span>
              <span className="font-mono text-base font-bold text-[#E6EAF2]">
                {heightCm} cm
              </span>
            </div>
            <input
              type="range"
              min={120}
              max={220}
              step={1}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8B95AD]">Weight (lbs)</span>
              <span className="font-mono text-base font-bold text-[#E6EAF2]">
                {weightLbs} lbs
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={350}
              step={1}
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-[#8B95AD]">Feet</label>
              <input
                type="number"
                min={3}
                max={7}
                value={feet}
                onChange={(e) => setFeet(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#8B95AD]">Inches</label>
              <input
                type="number"
                min={0}
                max={11}
                value={inches}
                onChange={(e) => setInches(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Asian WHO Cutoff Toggle */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] flex items-center justify-between text-xs">
        <div>
          <div className="font-medium text-[#E6EAF2]">Asian Population Guidelines</div>
          <div className="text-[11px] text-[#8B95AD]">WHO South Asian recommended cutoffs (Overweight at 23+)</div>
        </div>
        <input
          type="checkbox"
          checked={useAsianCutoff}
          onChange={(e) => setUseAsianCutoff(e.target.checked)}
          className="accent-[#22D3EE] w-4 h-4 rounded"
        />
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* BMI Score Card */}
      <div className="p-5 rounded-xl bg-[#121828] border border-[#232C42] text-center space-y-2">
        <div className="text-xs text-[#8B95AD] uppercase tracking-wider font-medium">
          Body Mass Index (BMI)
        </div>
        <div
          className="text-5xl font-black font-mono tracking-tight"
          style={{ color: result?.color || "#22D3EE" }}
        >
          {result?.bmi.toFixed(1) || "--"}
        </div>
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${result?.color || "#22D3EE"}20`,
            color: result?.color || "#22D3EE",
          }}
        >
          {categoryLabel || "Calculating"}
        </div>
      </div>

      {/* Ideal Weight Range */}
      {result && (
        <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#8B95AD]">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Ideal Healthy Weight Range for your height:</span>
          </div>
          <div className="text-lg font-bold font-mono text-[#E6EAF2]">
            {result.healthyWeightMinKg} kg – {result.healthyWeightMaxKg} kg
          </div>
          <div className="text-[11px] text-[#8B95AD]">
            Calculated for a healthy BMI of 18.5 – {useAsianCutoff ? "22.9" : "24.9"}
          </div>
        </div>
      )}

      {/* BMI Range Guide */}
      <div className="p-3.5 rounded-xl bg-[#0B0F1A] border border-[#232C42] space-y-2 text-xs">
        <div className="text-[#8B95AD] font-medium flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>{useAsianCutoff ? "Asian WHO Cutoffs" : "Standard WHO Cutoffs"}:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="text-cyan-400">• Underweight: &lt; 18.5</div>
          <div className="text-green-400">• Normal: 18.5 – {useAsianCutoff ? "22.9" : "24.9"}</div>
          <div className="text-amber-400">• Overweight: {useAsianCutoff ? "23.0 – 24.9" : "25.0 – 29.9"}</div>
          <div className="text-red-400">• Obese: ≥ {useAsianCutoff ? "25.0" : "30.0"}</div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0B0F1A] border border-[#232C42] text-[11px] text-[#8B95AD]">
        <Info className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
        <div>
          BMI is a screening metric and does not directly measure body fat or muscle mass. Consult a physician for complete medical evaluations.
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="bmi-calculator"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={error}
      onRunShortcut={() => {}}
    />
  );
}
