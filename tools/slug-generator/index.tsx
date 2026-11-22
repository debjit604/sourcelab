"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { generateSlug, SlugOptions } from "./process";
import { Copy, Check, Link as LinkIcon } from "lucide-react";

export default function SlugGeneratorTool() {
  const [input, setInput] = useState<string>(
    "How to Build 100% Client-Side Privacy Apps in 2026!"
  );
  const [separator, setSeparator] = useState<"-" | "_" | ".">("-");
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [removeStopWords, setRemoveStopWords] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const options: SlugOptions = useMemo(
    () => ({ separator, lowercase, removeStopWords }),
    [separator, lowercase, removeStopWords]
  );

  const slug = useMemo(() => generateSlug(input, options), [input, options]);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputPanel = (
    <div className="space-y-4">
      {/* Title / Heading Input */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8B95AD] font-medium">
          Article Title / Heading / Page Name
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder="Yahan apna title ya heading paste karo..."
          className="w-full px-3 py-2 text-sm bg-[#121828] border border-[#232C42] rounded-lg text-[#E6EAF2] focus:outline-none focus:border-[#22D3EE] resize-y"
        />
      </div>

      {/* Formatting Controls */}
      <div className="p-3.5 rounded-xl bg-[#121828]/50 border border-[#232C42] space-y-3">
        <div className="text-xs font-medium text-[#8B95AD]">Slug Configuration</div>

        {/* Separator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8B95AD]">Separator:</span>
          {(["-", "_", "."] as const).map((sep) => (
            <button
              key={sep}
              type="button"
              onClick={() => setSeparator(sep)}
              className={`px-3 py-1 rounded border font-mono transition-all ${
                separator === sep
                  ? "bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE] font-bold"
                  : "bg-[#121828] border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
              }`}
            >
              {sep === "-" ? "Hyphen (-)" : sep === "_" ? "Underscore (_)" : "Dot (.)"}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-3 pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded"
            />
            <span>Lowercase Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="accent-[#22D3EE] w-4 h-4 rounded"
            />
            <span>Remove Stop Words (the, a, in, on, to...)</span>
          </label>
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#8B95AD]">Presets:</span>
        <button
          type="button"
          onClick={() => setInput("10 Best Privacy First Developer Tools in 2026")}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Blog Post
        </button>
        <button
          type="button"
          onClick={() => setInput("Crème Brûlée & Café au Lait Recipe")}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Accents
        </button>
        <button
          type="button"
          onClick={() => setInput("SourceLab: Zero-Upload Tools for High Privacy")}
          className="px-2 py-0.5 rounded bg-[#121828] border border-[#232C42] text-[#8B95AD] hover:text-[#22D3EE]"
        >
          Product
        </button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      {/* Generated Slug Box */}
      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B95AD]">
          <div className="flex items-center gap-1.5 font-medium text-[#E6EAF2]">
            <LinkIcon className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Generated URL Slug</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!slug}
            className="flex items-center gap-1 text-[#22D3EE] hover:underline disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Slug"}
          </button>
        </div>
        <div className="font-mono text-sm text-[#22D3EE] bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] break-all select-all min-h-[50px] flex items-center">
          {slug || <span className="text-[#8B95AD]">Slug yahan banega...</span>}
        </div>
      </div>

      {/* URL Preview Simulator */}
      <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232C42] space-y-2 text-xs">
        <div className="text-[#8B95AD]">Live URL Preview</div>
        <div className="font-mono text-xs text-[#8B95AD] bg-[#0B0F1A] p-2.5 rounded-lg border border-[#232C42] break-all select-all">
          <span className="text-[#8B95AD]">https://example.com/</span>
          <span className="text-[#22D3EE] font-bold">{slug || "your-slug"}</span>
          <span className="text-[#8B95AD]">/</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD]">Characters</div>
          <div className="text-xl font-bold font-mono text-[#E6EAF2]">
            {slug.length}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#121828] border border-[#232C42]">
          <div className="text-[11px] text-[#8B95AD]">Slug Words</div>
          <div className="text-xl font-bold font-mono text-[#22D3EE]">
            {slug ? slug.split(separator).filter(Boolean).length : 0}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="slug-generator"
      input={inputPanel}
      output={outputPanel}
      loading={false}
      error={null}
      onRunShortcut={() => {}}
    />
  );
}
