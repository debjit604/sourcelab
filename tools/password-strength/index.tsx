"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";
import { analyzePassword, PasswordStrengthResult } from "./process";

export default function PasswordStrengthTool() {
  const [password, setPassword] = useState<string>("S0urce!Lab#2026");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const result: PasswordStrengthResult = useMemo(() => analyzePassword(password), [password]);

  const progressPercent = ((result.score + 1) / 5) * 100;

  const inputPanel = (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs text-[#8B95AD]">Enter Password to Analyze</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste password..."
            className="font-mono text-sm bg-[#121828] border-[#232C42] text-[#E6EAF2] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Strength Bar */}
      <div className="space-y-1.5 p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#8B95AD]">Strength Level</span>
          <span style={{ color: result.color }} className="font-bold">
            {result.label} ({result.score}/4)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#0B0F1A] overflow-hidden">
          <div
            style={{ width: `${progressPercent}%`, backgroundColor: result.color }}
            className="h-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Character Checklist */}
      <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2 text-xs">
        <div className="text-[#8B95AD] font-medium">Composition Checklist</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${result.hasLowercase ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {result.hasLowercase ? "✓" : "✕"}
            </span>
            <span className={result.hasLowercase ? "text-[#E6EAF2]" : "text-[#8B95AD]"}>Lowercase (a-z)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${result.hasUppercase ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {result.hasUppercase ? "✓" : "✕"}
            </span>
            <span className={result.hasUppercase ? "text-[#E6EAF2]" : "text-[#8B95AD]"}>Uppercase (A-Z)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${result.hasNumbers ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {result.hasNumbers ? "✓" : "✕"}
            </span>
            <span className={result.hasNumbers ? "text-[#E6EAF2]" : "text-[#8B95AD]"}>Numbers (0-9)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${result.hasSymbols ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {result.hasSymbols ? "✓" : "✕"}
            </span>
            <span className={result.hasSymbols ? "text-[#E6EAF2]" : "text-[#8B95AD]"}>Special Symbols (!@#)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
          <div className="text-xs text-[#8B95AD]">Entropy</div>
          <div className="text-xl font-bold font-mono text-[#22D3EE] mt-1">{result.entropyBits} bits</div>
          <div className="text-[11px] text-[#8B95AD] mt-0.5">{result.entropyBits >= 60 ? "Strong (60+ bits)" : "Needs improvement"}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
          <div className="text-xs text-[#8B95AD]">Length</div>
          <div className="text-xl font-bold font-mono text-[#E6EAF2] mt-1">{result.length} Chars</div>
          <div className="text-[11px] text-[#8B95AD] mt-0.5">Pool: {result.poolSize} possible chars</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] col-span-2 sm:col-span-1">
          <div className="text-xs text-[#8B95AD]">Est. Crack Time</div>
          <div className="text-sm sm:text-base font-bold font-mono text-[#34D399] mt-1 truncate">
            {result.crackTimeDisplay}
          </div>
          <div className="text-[10px] text-[#8B95AD] mt-0.5">GPU brute-force estimate</div>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-[#F87171] space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Weaknesses Detected:</span>
          </div>
          <ul className="list-disc ml-5 space-y-0.5">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] text-xs text-[#8B95AD] space-y-1">
          <div className="text-[#E6EAF2] font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
            <span>Suggestions to Improve:</span>
          </div>
          <ul className="list-disc ml-5 space-y-0.5">
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="password-strength"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
