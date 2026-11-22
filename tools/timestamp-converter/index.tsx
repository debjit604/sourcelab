"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Clock, Play, Pause, RefreshCw } from "lucide-react";
import {
  parseTimestamp,
  parseDateString,
  generateTimestampSummary,
  TimestampConversionResult,
} from "./process";

export default function TimestampConverterTool() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState<boolean>(true);
  const [direction, setDirection] = useState<"epochToDate" | "dateToEpoch">("epochToDate");
  const [epochInput, setEpochInput] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<"auto" | "sec" | "ms">("auto");
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString().slice(0, 16));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live ticking clock
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const result: TimestampConversionResult | null = useMemo(() => {
    if (direction === "epochToDate") {
      return parseTimestamp(epochInput, unit);
    } else {
      return parseDateString(dateInput);
    }
  }, [direction, epochInput, unit, dateInput]);

  const copyToClipboard = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {}
  }, []);

  const handleUseCurrent = () => {
    const nowSec = Math.floor(Date.now() / 1000);
    setEpochInput(String(nowSec));
    setDateInput(new Date().toISOString().slice(0, 16));
  };

  const inputPanel = (
    <div className="space-y-5">
      {/* Live Ticker */}
      <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#22D3EE]" />
          <div>
            <div className="text-[11px] text-[#8B95AD]">Current Unix Epoch</div>
            <div className="font-mono text-base font-bold text-[#22D3EE]">{currentEpoch}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLive((prev) => !prev)}
            className="border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2] h-8 px-2.5"
          >
            {isLive ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isLive ? "Pause" : "Resume"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleUseCurrent}
            className="border-[#232C42] text-[#22D3EE] hover:bg-[#1A2234] h-8 px-2.5"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Use Now
          </Button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
        <button
          type="button"
          onClick={() => setDirection("epochToDate")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            direction === "epochToDate" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Epoch → Date
        </button>
        <button
          type="button"
          onClick={() => setDirection("dateToEpoch")}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
            direction === "dateToEpoch" ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold" : "text-[#8B95AD]"
          }`}
        >
          Date → Epoch
        </button>
      </div>

      {/* Inputs */}
      {direction === "epochToDate" ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8B95AD]">Unix Timestamp</label>
            <Input
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1700000000 or 1700000000000"
              className="bg-[#121828] border-[#232C42] font-mono text-sm text-[#E6EAF2]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B95AD]">Unit:</span>
            {(["auto", "sec", "ms"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  unit === u
                    ? "bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]"
                    : "border-[#232C42] text-[#8B95AD]"
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8B95AD]">Date & Time (Picker or ISO String)</label>
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="bg-[#121828] border-[#232C42] text-sm text-[#E6EAF2]"
            />
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: "Now", action: handleUseCurrent },
          { label: "+1 Day", action: () => setEpochInput(String(Math.floor(Date.now() / 1000) + 86400)) },
          { label: "+1 Year", action: () => setEpochInput(String(Math.floor(Date.now() / 1000) + 31536000)) },
          { label: "Y2K (2000)", action: () => setEpochInput("946684800") },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={p.action}
            className="px-2.5 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );

  const outputRows = result ? [
    { label: "Local Time", value: result.localString, key: "local" },
    { label: "UTC Time", value: result.utcString, key: "utc" },
    { label: "ISO 8601", value: result.isoString, key: "iso" },
    { label: "Relative Time", value: result.relativeTime, key: "rel" },
    { label: "Epoch (Seconds)", value: String(result.epochSeconds), key: "sec" },
    { label: "Epoch (Milliseconds)", value: String(result.epochMilliseconds), key: "ms" },
    { label: "Day of Week", value: result.dayOfWeek, key: "day" },
    { label: "Leap Year", value: result.isLeapYear ? "Yes" : "No", key: "leap" },
  ] : [];

  const outputPanel = (
    <div className="space-y-4">
      {result ? (
        <>
          <div className="space-y-2">
            {outputRows.map((row) => (
              <div
                key={row.key}
                className="p-3 rounded-lg bg-[#121828] border border-[#232C42] flex items-center justify-between gap-3 hover:border-[#22D3EE]/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-[#8B95AD]">{row.label}</div>
                  <div className="text-sm font-mono text-[#E6EAF2] break-all select-all">
                    {row.value}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(row.value, row.key)}
                  className="h-8 w-8 p-0 text-[#8B95AD] hover:text-[#22D3EE] shrink-0"
                >
                  {copiedKey === row.key ? (
                    <Check className="w-4 h-4 text-[#34D399]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(generateTimestampSummary(result), "all")}
              className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
            >
              {copiedKey === "all" ? (
                <Check className="w-4 h-4 mr-1 text-[#34D399]" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copiedKey === "all" ? "All Copied!" : "Copy Full Summary"}
            </Button>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Aapne galat timestamp ya date dali hai. Kripya valid number enter karein.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="timestamp-converter"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
