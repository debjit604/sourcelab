"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Copy, Download, Trophy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TypingMetrics, generateChartPoints, PersonalBest } from "./process";

interface TypingResultsProps {
  metrics: TypingMetrics;
  history: number[];
  missedKeys: Array<{ key: string; count: number }>;
  onRetrySame: () => void;
  onRetryMistakes: () => void;
  hasMistakes: boolean;
  personalBests: PersonalBest[];
}

export function TypingResults({
  metrics,
  history,
  missedKeys,
  onRetrySame,
  onRetryMistakes,
  hasMistakes,
  personalBests,
}: TypingResultsProps) {
  const [copied, setCopied] = React.useState(false);
  const chart = generateChartPoints(history, 380, 90);

  const handleCopy = async () => {
    const text = `SourceLab Typing Test\nNet WPM: ${metrics.netWpm} | Gross WPM: ${metrics.grossWpm}\nAccuracy: ${metrics.accuracy}%\nErrors: ${metrics.errorChars}\nTime: ${metrics.elapsedSeconds}s\nMode: ${metrics.mode === "standard" ? "5 chars = 1 word" : "Actual words"}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0B0F1A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card border & fill
    ctx.fillStyle = "#121828";
    ctx.strokeStyle = "#232C42";
    ctx.lineWidth = 2;
    ctx.roundRect(24, 24, 552, 312, 16);
    ctx.fill();
    ctx.stroke();

    // Brand
    ctx.fillStyle = "#22D3EE";
    ctx.font = "bold 20px Space Grotesk, sans-serif";
    ctx.fillText("SourceLab Typing Test", 48, 64);

    ctx.fillStyle = "#8B95AD";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Privacy-first client-side speed evaluation", 48, 88);

    // Net WPM Big
    ctx.fillStyle = "#34D399";
    ctx.font = "bold 64px Space Grotesk, sans-serif";
    ctx.fillText(`${metrics.netWpm}`, 48, 170);

    ctx.fillStyle = "#8B95AD";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("NET WPM", 48, 195);

    // Accuracy
    ctx.fillStyle = "#22D3EE";
    ctx.font = "bold 44px Space Grotesk, sans-serif";
    ctx.fillText(`${metrics.accuracy}%`, 240, 165);

    ctx.fillStyle = "#8B95AD";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("ACCURACY", 240, 195);

    // Stats Grid
    ctx.fillStyle = "#E6EAF2";
    ctx.font = "16px JetBrains Mono, monospace";
    ctx.fillText(`Gross WPM: ${metrics.grossWpm}`, 420, 140);
    ctx.fillText(`Errors: ${metrics.errorChars}`, 420, 170);
    ctx.fillText(`Time: ${metrics.elapsedSeconds}s`, 420, 200);

    // Disclaimer
    ctx.fillStyle = "#8B95AD";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Practice evaluation. Exam board scoring may differ.", 48, 290);

    const a = document.createElement("a");
    a.download = `sourcelab-typing-result-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-[var(--sl-surface)] border-[var(--sl-border)] text-center p-3">
          <div className="text-3xl font-bold font-mono text-[var(--sl-success)]">{metrics.netWpm}</div>
          <div className="text-xs text-[var(--sl-muted)] uppercase tracking-wider mt-1">Net WPM</div>
        </Card>
        <Card className="bg-[var(--sl-surface)] border-[var(--sl-border)] text-center p-3">
          <div className="text-3xl font-bold font-mono text-[var(--sl-accent)]">{metrics.accuracy}%</div>
          <div className="text-xs text-[var(--sl-muted)] uppercase tracking-wider mt-1">Accuracy</div>
        </Card>
        <Card className="bg-[var(--sl-surface)] border-[var(--sl-border)] text-center p-3">
          <div className="text-3xl font-bold font-mono text-[var(--sl-text)]">{metrics.grossWpm}</div>
          <div className="text-xs text-[var(--sl-muted)] uppercase tracking-wider mt-1">Gross WPM</div>
        </Card>
        <Card className="bg-[var(--sl-surface)] border-[var(--sl-border)] text-center p-3">
          <div className="text-3xl font-bold font-mono text-[var(--sl-error)]">{metrics.errorChars}</div>
          <div className="text-xs text-[var(--sl-muted)] uppercase tracking-wider mt-1">Errors</div>
        </Card>
      </div>

      {chart.path && (
        <Card className="bg-[var(--sl-surface)] border-[var(--sl-border)] p-4">
          <div className="text-xs text-[var(--sl-muted)] font-medium mb-2 flex items-center justify-between">
            <span>Speed Over Time (WPM)</span>
            <span className="font-mono text-[10px]">Peak: {chart.max} WPM</span>
          </div>
          <div className="w-full h-24 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 380 90" className="w-full h-full stroke-[var(--sl-accent)] fill-none">
              <path d={chart.path} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Card>
      )}

      {missedKeys.length > 0 && (
        <Card className="bg-[var(--sl-surface)] border-[var(--sl-border)] p-4">
          <div className="text-xs text-[var(--sl-muted)] font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Most Missed Keys</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missedKeys.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs font-mono text-[var(--sl-text)]"
              >
                <strong className="text-[var(--sl-accent)]">{item.key}</strong> ({item.count}x)
              </span>
            ))}
          </div>
        </Card>
      )}

      {personalBests.length > 0 && (
        <div className="p-3 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs text-[var(--sl-muted)] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Personal Best: <strong className="text-[var(--sl-text)]">{personalBests[0].netWpm} Net WPM</strong> ({personalBests[0].accuracy}% acc)
          </span>
        </div>
      )}

      <div className="p-3 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] text-xs text-[var(--sl-muted)]">
        Method: <strong className="text-[var(--sl-text)]">{metrics.mode === "standard" ? "5 characters = 1 word" : "Actual words"}</strong>. Self-practice tool — government/court exam marking rules may vary.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onRetrySame} className="gap-2 bg-[var(--sl-accent)] text-[#0B0F1A] hover:bg-cyan-400">
          <RotateCcw className="w-4 h-4" /> Retry Same Text
        </Button>
        {hasMistakes && (
          <Button onClick={onRetryMistakes} variant="outline" className="gap-2">
            Retry Mistakes Only
          </Button>
        )}
        <Button onClick={handleCopy} variant="outline" className="gap-2">
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Result"}
        </Button>
        <Button onClick={handleExportImage} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Save as Image
        </Button>
      </div>
    </div>
  );
}
