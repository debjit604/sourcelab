"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Check, Eye, Code2 } from "lucide-react";
import { markdownToHtml, getMarkdownStats } from "./process";

const DEFAULT_MARKDOWN = `# SourceLab Markdown Previewer
Welcome to **SourceLab** — 100% private in-browser tools!

## Features
- [x] Zero server upload
- [x] Real-time rendering
- [ ] Advanced custom templates

### Code Example
\`\`\`javascript
function greet(name) {
  return "Namaste, " + name;
}
\`\`\`

> Tumhari file tumhare browser me hi process hoti hai!

Check out our [Documentation](https://sourcelab.dev).
`;

export default function MarkdownPreviewTool() {
  const [input, setInput] = useState<string>(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState<boolean>(false);

  const html = useMemo(() => markdownToHtml(input), [input]);
  const stats = useMemo(() => getMarkdownStats(input), [input]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(viewMode === "preview" ? input : html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const content = viewMode === "preview" ? input : html;
    const filename = viewMode === "preview" ? "document.md" : "document.html";
    const mime = viewMode === "preview" ? "text/markdown" : "text/html";
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs text-[#8B95AD] font-medium">Markdown Source</label>
        <div className="flex gap-2 text-xs text-[#8B95AD]">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.lines} lines</span>
          <span>•</span>
          <span>{stats.chars} chars</span>
        </div>
      </div>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Yahan markdown likhein ya paste karein..."
        className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[360px] text-[#E6EAF2] resize-y"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInput(DEFAULT_MARKDOWN)}
          className="border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
        >
          Load Sample
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInput("")}
          className="border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg bg-[#121828] p-1 border border-[#232C42]">
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              viewMode === "preview"
                ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold"
                : "text-[#8B95AD]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode("html")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              viewMode === "html"
                ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold"
                : "text-[#8B95AD]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            HTML Code
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
          >
            {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Copied!" : viewMode === "preview" ? "Copy Markdown" : "Copy HTML"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="border-[#232C42] text-[#22D3EE] hover:bg-[#1A2234]"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#121828] border border-[#232C42] min-h-[360px] overflow-auto">
        {viewMode === "preview" ? (
          <div
            className="prose prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="text-xs font-mono text-[#22D3EE] whitespace-pre-wrap select-all">
            {html}
          </pre>
        )}
      </div>
    </div>
  );

  return (
    <ToolShell
      toolId="markdown-preview"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
