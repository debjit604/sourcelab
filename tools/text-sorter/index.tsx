"use client";

import React, { useState, useMemo } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { sortTextLines, SortOrder } from "./process";

const SAMPLE_TEXT = `Delhi
Mumbai
Bengaluru
mumbai
Kolkata
Chennai
Hyderabad
delhi
Pune`;

export default function TextSorterTool() {
  const [input, setInput] = useState<string>(SAMPLE_TEXT);
  const [order, setOrder] = useState<SortOrder>("az");
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const output = useMemo(() => {
    return sortTextLines(input, {
      order,
      removeDuplicates,
      trimWhitespace,
      removeEmptyLines,
      caseSensitive,
    });
  }, [input, order, removeDuplicates, trimWhitespace, removeEmptyLines, caseSensitive]);

  const beforeCount = input ? input.split("\n").length : 0;
  const afterCount = output ? output.split("\n").length : 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const inputPanel = (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs text-[#8B95AD]">
        <span>Input Lines: {beforeCount}</span>
        <button
          type="button"
          onClick={() => setInput(SAMPLE_TEXT)}
          className="hover:text-[#22D3EE]"
        >
          Load Sample
        </button>
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Yahan text lines paste karein..."
        className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[200px] text-[#E6EAF2]"
      />

      <div className="space-y-2 p-3.5 rounded-xl bg-[#121828] border border-[#232C42]">
        <div className="text-xs text-[#8B95AD] font-medium">Sorting Order</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
          {[
            { id: "az", label: "A → Z" },
            { id: "za", label: "Z → A" },
            { id: "natural", label: "Natural (1, 2, 10)" },
            { id: "length-asc", label: "Shortest First" },
            { id: "length-desc", label: "Longest First" },
            { id: "numeric", label: "Numeric Value" },
            { id: "reverse", label: "Reverse Order" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setOrder(m.id as SortOrder)}
              className={`p-1.5 rounded border text-center transition-colors ${
                order === m.id
                  ? "bg-[#22D3EE] text-[#0B0F1A] font-semibold border-[#22D3EE]"
                  : "border-[#232C42] text-[#8B95AD] hover:text-[#E6EAF2]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-[#232C42] grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="accent-[#22D3EE]"
            />
            Remove Duplicates
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="accent-[#22D3EE]"
            />
            Trim Spaces
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="accent-[#22D3EE]"
            />
            Remove Empty Lines
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[#E6EAF2]">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="accent-[#22D3EE]"
            />
            Case Sensitive
          </label>
        </div>
      </div>
    </div>
  );

  const outputPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#8B95AD]">
          Result: <span className="text-[#22D3EE] font-mono font-bold">{afterCount} Lines</span>
          {beforeCount > afterCount && (
            <span className="text-[#34D399] ml-1">({beforeCount - afterCount} removed)</span>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="border-[#232C42] text-[#E6EAF2] hover:bg-[#1A2234]"
        >
          {copied ? <Check className="w-4 h-4 mr-1 text-[#34D399]" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? "Copied!" : "Copy Sorted Text"}
        </Button>
      </div>

      <Textarea
        readOnly
        value={output}
        placeholder="Sorted lines yahan aayengi..."
        className="font-mono text-xs sm:text-sm bg-[#121828] border-[#232C42] min-h-[340px] text-[#22D3EE] select-all"
      />
    </div>
  );

  return (
    <ToolShell
      toolId="text-sorter"
      input={inputPanel}
      output={outputPanel}
    />
  );
}
