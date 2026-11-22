"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { readFileAsText } from "@/lib/files";
import { convertCase, CaseType } from "./process";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

const CASE_OPTIONS: Array<{ id: CaseType; label: string; example: string }> = [
  { id: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { id: "lower", label: "lowercase", example: "hello world" },
  { id: "title", label: "Title Case", example: "Hello World" },
  { id: "sentence", label: "Sentence case", example: "Hello world. Example." },
  { id: "camel", label: "camelCase", example: "helloWorld" },
  { id: "pascal", label: "PascalCase", example: "HelloWorld" },
  { id: "snake", label: "snake_case", example: "hello_world" },
  { id: "kebab", label: "kebab-case", example: "hello-world" },
  { id: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { id: "alternating", label: "aLtErNaTiNg", example: "hElLo WoRlD" },
];

const SAMPLE_TEXT =
  "SourceLab is a 100% private developer toolbox. Your files never leave your browser RAM! Try converting this sample text into different programming and writing casing formats.";

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("title");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ wordCount: 0, charCount: 0 });

  const handleConvert = (textToConvert = input, caseToUse = activeCase) => {
    const res = convertCase(textToConvert, caseToUse);
    setOutput(res.output);
    setStats({ wordCount: res.wordCount, charCount: res.charCount });
  };

  const handleCaseChange = (newCase: CaseType) => {
    setActiveCase(newCase);
    if (input.trim()) {
      handleConvert(input, newCase);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) {
      handleConvert(val, activeCase);
    } else {
      setOutput("");
      setStats({ wordCount: 0, charCount: 0 });
    }
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    handleConvert(SAMPLE_TEXT, activeCase);
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setStats({ wordCount: 0, charCount: 0 });
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const text = await readFileAsText(files[0]);
      setInput(text);
      handleConvert(text, activeCase);
    } catch {
      // ignore
    }
  };

  return (
    <ToolShell
      toolId="case-converter"
      downloadFilename={`case-converted-${activeCase}.txt`}
      downloadMimeType="text/plain"
      onRunShortcut={() => handleConvert()}
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="case-input"
              className="text-xs font-mono font-medium text-[var(--sl-muted)] uppercase tracking-wider"
            >
              Input Text
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[var(--sl-accent)] bg-[rgba(34,211,238,0.1)] hover:bg-[rgba(34,211,238,0.2)] rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample Load Karo</span>
              </button>
              {input && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-error)] hover:bg-[rgba(248,113,113,0.1)] rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            id="case-input"
            rows={8}
            value={input}
            onChange={handleInputChange}
            placeholder="Yahan apna text paste ya type karo... (Ctrl + Enter se run karo)"
            className="w-full p-4 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-[var(--sl-text)] placeholder:text-[var(--sl-muted)] font-mono text-sm resize-y leading-relaxed outline-none transition-colors"
          />

          {/* Case Selection Pills */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[var(--sl-muted)] block">
              Case Format Select Karo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CASE_OPTIONS.map((c) => {
                const isActive = activeCase === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCaseChange(c.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? "bg-[rgba(34,211,238,0.15)] border-[var(--sl-accent)] text-[var(--sl-text)] shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        : "bg-[var(--sl-surface)] border-[var(--sl-border)] text-[var(--sl-muted)] hover:border-[rgba(34,211,238,0.4)] hover:text-[var(--sl-text)]"
                    }`}
                  >
                    <span className="text-xs font-medium font-sans truncate w-full">
                      {c.label}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--sl-muted)] truncate w-full mt-0.5">
                      {c.example}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Dropzone
            accept=".txt,.md,.json,.csv,.log,.html,.js,.ts"
            multiple={false}
            maxSizeMB={10}
            onFiles={handleFileDrop}
            label="Text file drag-and-drop karo ya click karke upload karo"
          />
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--sl-border)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-[var(--sl-accent)] uppercase tracking-wider">
                Output ({CASE_OPTIONS.find((c) => c.id === activeCase)?.label})
              </span>
            </div>
            {output && (
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--sl-muted)]">
                <span>{stats.wordCount} words</span>
                <span>•</span>
                <span>{stats.charCount} characters</span>
              </div>
            )}
          </div>

          {output ? (
            <textarea
              readOnly
              rows={8}
              value={output}
              className="w-full p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-text)] font-mono text-sm resize-y leading-relaxed outline-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 rounded-xl bg-[var(--sl-bg)] border border-dashed border-[var(--sl-border)]">
              <div className="p-3 rounded-full bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
                <ArrowRight className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[var(--sl-text)]">
                Output yahan dikhega
              </p>
              <p className="text-xs text-[var(--sl-muted)] max-w-xs">
                Left panel me text likho ya &quot;Sample Load Karo&quot; dabao. Real-time conversion live hogi.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
