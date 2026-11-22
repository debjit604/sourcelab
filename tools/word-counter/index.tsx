"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { processWordCounter, WordCounterProcessOutput } from "./process";
import { readFileAsText } from "@/lib/files";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Clock, Volume2, BarChart2, BookOpen } from "lucide-react";

const SAMPLE_TEXT = `SourceLab ek aisi website hai jahan 200 se zyada privacy-friendly browser tools bina kisi signup ke bilkul free me milte hain.

Sabse khas baat ye hai ki tumhari koi bhi file ya text kisi server par upload nahi hota. Sab kuch tumhare browser me hi client-side execute hota hai.

Chahe PDF compress karna ho, Base64 encode karna ho, ya strong passwords generate karna ho — SourceLab har kaam ko tezi aur suraksha ke saath karta hai.`;

export default function WordCounterToolComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<WordCounterProcessOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = (textToProcess = input) => {
    try {
      setLoading(true);
      setError(null);
      const res = processWordCounter({ text: textToProcess });
      setOutput(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
      setOutput(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const text = await readFileAsText(files[0]);
      setInput(text);
      handleAnalyze(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File padhne me error aaya.");
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_TEXT);
    handleAnalyze(SAMPLE_TEXT);
  };

  const handleClear = () => {
    setInput("");
    setOutput(null);
    setError(null);
  };

  const stats = output?.stats;

  return (
    <ToolShell
      toolId="word-counter"
      downloadFilename="text-analysis.txt"
      downloadMimeType="text/plain"
      onRunShortcut={() => handleAnalyze()}
      input={
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--sl-border)]">
            <div className="text-xs font-mono text-[var(--sl-muted)] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
              <span>Real-Time Text Statistics</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.1)] transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Sample</span>
              </button>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--sl-muted)] hover:text-[var(--sl-error)] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Text input */}
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Yahan apna text, essay ya article paste karo..."
            rows={10}
            className="font-mono text-xs md:text-sm resize-y bg-[var(--sl-bg)]"
          />

          {/* Dropzone */}
          <Dropzone
            accept=".txt,.md,.json,.csv,.log,.html"
            multiple={false}
            maxSizeMB={10}
            onFiles={handleFileDrop}
            onReject={(msg) => setError(msg)}
            label="Document file drop karke word count dekho (Max 10MB)"
          />

          {/* Run button */}
          <Button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={loading || !input.trim()}
            className="w-full font-heading font-semibold"
          >
            {loading ? "Analyze ho raha hai..." : "Analyze Text (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={
        stats ? (
          <div className="space-y-4">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--sl-muted)] uppercase block">Words</span>
                <span className="text-2xl font-heading font-bold text-[var(--sl-accent)] mt-0.5 block">
                  {stats.words.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--sl-muted)] uppercase block">Characters</span>
                <span className="text-2xl font-heading font-bold text-[var(--sl-text)] mt-0.5 block">
                  {stats.characters.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] font-mono text-[var(--sl-muted)] uppercase block">No Spaces</span>
                <span className="text-2xl font-heading font-bold text-[var(--sl-success)] mt-0.5 block">
                  {stats.charactersNoSpaces.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Structure Details Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-center font-mono text-xs">
              <div>
                <span className="text-[var(--sl-muted)] block text-[10px]">Sentences</span>
                <span className="font-semibold text-[var(--sl-text)]">{stats.sentences}</span>
              </div>
              <div className="border-x border-[var(--sl-border)]">
                <span className="text-[var(--sl-muted)] block text-[10px]">Paragraphs</span>
                <span className="font-semibold text-[var(--sl-text)]">{stats.paragraphs}</span>
              </div>
              <div>
                <span className="text-[var(--sl-muted)] block text-[10px]">Lines</span>
                <span className="font-semibold text-[var(--sl-text)]">{stats.lines}</span>
              </div>
            </div>

            {/* Time Estimates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono">
                  <span className="text-[var(--sl-muted)] block text-[11px]">Reading Time</span>
                  <span className="font-bold text-[var(--sl-text)]">{stats.readingTime}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(251,191,36,0.1)] text-[var(--sl-warning)]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono">
                  <span className="text-[var(--sl-muted)] block text-[11px]">Speaking Time</span>
                  <span className="font-bold text-[var(--sl-text)]">{stats.speakingTime}</span>
                </div>
              </div>
            </div>

            {/* Top Keywords Density */}
            {stats.topKeywords.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-heading font-semibold text-[var(--sl-text)]">
                  <BarChart2 className="w-3.5 h-3.5 text-[var(--sl-accent)]" />
                  <span>Keyword Density (Top {stats.topKeywords.length})</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {stats.topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono p-1.5 rounded hover:bg-[var(--sl-surface)] transition-colors">
                      <span className="text-[var(--sl-text)] font-medium truncate max-w-[50%]">
                        {kw.word}
                      </span>
                      <div className="flex items-center gap-3 text-[var(--sl-muted)]">
                        <span>{kw.count}x</span>
                        <span className="text-[var(--sl-accent)] font-semibold w-12 text-right">
                          {kw.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null
      }
      error={error}
      loading={loading}
    />
  );
}
