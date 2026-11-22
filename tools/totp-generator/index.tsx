"use client";

import React, { useState, useEffect } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, ShieldCheck, Clock } from "lucide-react";
import { generateTotp, TotpResult } from "./process";

const PRESET_KEYS = [
  { label: "Sample Key 1", key: "JBSWY3DPEHPK3PXP" },
  { label: "Sample Key 2", key: "HXDMVJECJJWSRB3H" },
  { label: "RFC 6238 Test", key: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ" },
];

export default function TotpGeneratorTool() {
  const [secret, setSecret] = useState<string>("JBSWY3DPEHPK3PXP");
  const [period, setPeriod] = useState<number>(30);
  const [digits, setDigits] = useState<number>(6);
  const [algorithm, setAlgorithm] = useState<"SHA-1" | "SHA-256" | "SHA-512">("SHA-1");
  const [result, setResult] = useState<TotpResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!secret.trim()) {
        if (mounted) {
          setResult(null);
          setError(null);
        }
        return;
      }
      try {
        const res = await generateTotp(secret, { period, digits, algorithm });
        if (mounted) {
          setResult(res);
          setError(null);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Invalid Secret Key");
          setResult(null);
        }
      }
    };

    const timer = setTimeout(run, 0);
    const interval = setInterval(run, 1000);
    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [secret, period, digits, algorithm]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const progressPercent = result ? (result.secondsRemaining / period) * 100 : 0;

  const formattedToken = result
    ? result.digits === 6
      ? `${result.token.slice(0, 3)} ${result.token.slice(3)}`
      : `${result.token.slice(0, 4)} ${result.token.slice(4)}`
    : "--- ---";

  const inputPanel = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD]">Base32 Secret Key</label>
        <Input
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="e.g. JBSWY3DPEHPK3PXP"
          className="font-mono text-sm bg-[#121828] border-[#232C42] text-[#22D3EE] uppercase"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-[#8B95AD] self-center">Presets:</span>
        {PRESET_KEYS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setSecret(p.key)}
            className="px-2.5 py-1 text-xs rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
        <div className="text-xs text-[#8B95AD] font-medium">TOTP Parameters</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-[#8B95AD]">Digits:</span>
            <div className="flex gap-1 mt-1">
              {[6, 8].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDigits(d)}
                  className={`flex-1 py-1 rounded border text-center ${
                    digits === d ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[#8B95AD]">Period:</span>
            <div className="flex gap-1 mt-1">
              {[30, 60].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-1 rounded border text-center ${
                    period === p ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]" : "border-[#232C42] text-[#8B95AD]"
                  }`}
                >
                  {p}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[#8B95AD]">Algorithm:</span>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as "SHA-1" | "SHA-256" | "SHA-512")}
              className="w-full mt-1 bg-[#0B0F1A] border border-[#232C42] text-[#E6EAF2] rounded p-1 text-xs"
            >
              <option value="SHA-1">SHA-1 (Default)</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {result ? (
        <div className="p-5 rounded-xl bg-[#121828] border border-[#22D3EE]/40 bg-gradient-to-br from-[#22D3EE]/5 to-transparent space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#34D399] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Active 2FA Code
            </span>
            <span className="font-mono text-[#22D3EE] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {result.secondsRemaining}s left
            </span>
          </div>

          {/* Big Code */}
          <div className="text-center py-2">
            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-[#22D3EE] tracking-widest select-all">
              {formattedToken}
            </div>
          </div>

          {/* Remaining Seconds Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#0B0F1A] overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full transition-all duration-1000 ${
                result.secondsRemaining <= 5 ? "bg-[#F87171]" : "bg-[#22D3EE]"
              }`}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-[#8B95AD]">
              Next token: <span className="font-mono text-[#E6EAF2]">{result.nextToken}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
            >
              {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied!" : "Copy 2FA Code"}
            </Button>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-sm text-[#F87171] rounded-xl border border-dashed border-red-500/30">
          {error}
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-[#8B95AD] rounded-xl border border-dashed border-[#232C42]">
          Base32 secret key enter karein taaki real-time 2FA codes generate hon.
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      toolId="totp-generator"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
