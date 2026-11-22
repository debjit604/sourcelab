"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cake, Copy, Check } from "lucide-react";
import { calculateAge, AgeResult } from "./process";

export default function AgeCalculatorTool() {
  const [dob, setDob] = useState<string>("2000-01-01");
  const [copied, setCopied] = useState<boolean>(false);

  const result: AgeResult | null = useMemo(() => calculateAge(dob), [dob]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      `SourceLab Age Summary:`,
      `Date of Birth: ${dob}`,
      `Exact Age: ${result.years} Years, ${result.months} Months, ${result.days} Days`,
      `Born On: ${result.dayOfWeekBorn}`,
      `Next Birthday: In ${result.nextBirthdayDays} Days (${result.nextBirthdayDayOfWeek})`,
      `Zodiac Sign: ${result.zodiacSign}`,
      `Total Days Lived: ${result.totalDays.toLocaleString()}`,
      `Total Hours: ${result.totalHours.toLocaleString()}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs text-[#8B95AD]">Date of Birth (Janamdin)</label>
        <Input
          type="date"
          value={dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDob(e.target.value)}
          className="bg-[#121828] border-[#232C42] text-sm text-[#E6EAF2]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "1995 (30s)", d: "1995-05-15" },
          { label: "2000 (Y2K)", d: "2000-01-01" },
          { label: "2005 (Gen-Z)", d: "2005-08-20" },
          { label: "1980 (40s)", d: "1980-10-10" },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setDob(p.d)}
            className="px-2.5 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {p.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#22D3EE]">
            <Cake className="w-4 h-4" />
            <span className="font-semibold">Birthday Insights</span>
          </div>
          <div className="text-xs text-[#8B95AD] space-y-1">
            <div>
              Aapka janam <span className="text-[#E6EAF2] font-medium">{result.dayOfWeekBorn}</span> ko hua tha.
            </div>
            <div>
              Agla janamdin aane me: <span className="text-[#34D399] font-bold font-mono">{result.nextBirthdayDays} Days</span> ({result.nextBirthdayDayOfWeek})
            </div>
            <div>
              Zodiac Sign: <span className="text-[#22D3EE] font-semibold">{result.zodiacSign}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const outputPanel = (
    <div className="space-y-5">
      {result ? (
        <>
          {/* Main 3 big stat boxes */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#121828] border border-[#22D3EE]/40 bg-gradient-to-br from-[#22D3EE]/5 to-transparent text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#22D3EE]">{result.years}</div>
              <div className="text-xs text-[#8B95AD] mt-1 font-medium">Years</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#E6EAF2]">{result.months}</div>
              <div className="text-xs text-[#8B95AD] mt-1 font-medium">Months</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#E6EAF2]">{result.days}</div>
              <div className="text-xs text-[#8B95AD] mt-1 font-medium">Days</div>
            </div>
          </div>

          {/* Granular Lifetime Metrics */}
          <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
            <div className="text-xs text-[#8B95AD] font-medium">Total Lifetime Lived</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#0B0F1A] border border-[#232C42]">
                <div className="text-[#8B95AD]">Total Weeks</div>
                <div className="text-sm font-mono font-bold text-[#E6EAF2] mt-1">{result.totalWeeks.toLocaleString()}</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B0F1A] border border-[#232C42]">
                <div className="text-[#8B95AD]">Total Days</div>
                <div className="text-sm font-mono font-bold text-[#E6EAF2] mt-1">{result.totalDays.toLocaleString()}</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B0F1A] border border-[#232C42]">
                <div className="text-[#8B95AD]">Total Hours</div>
                <div className="text-sm font-mono font-bold text-[#E6EAF2] mt-1">{result.totalHours.toLocaleString()}</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B0F1A] border border-[#232C42]">
                <div className="text-[#8B95AD]">Total Minutes</div>
                <div className="text-sm font-mono font-bold text-[#E6EAF2] mt-1">{result.totalMinutes.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
          >
            {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Copied!" : "Copy Age Summary"}
          </Button>
        </>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Kripya valid Date of Birth enter karein.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="age-calculator"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
