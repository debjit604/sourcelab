"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Dropzone } from "@/components/tool/Dropzone";
import { readFileAsText } from "@/lib/files";
import { convertCsvToJson, convertJsonToCsv } from "./process";
import { ArrowLeftRight, Sparkles, RotateCcw } from "lucide-react";

const SAMPLE_CSV = `id,name,role,experience_years,remote
1,Aarav Sharma,Frontend Engineer,4,true
2,Diya Patel,Product Designer,6,false
3,Rohan Verma,DevOps Specialist,5,true
4,Ananya Iyer,Data Analyst,3,false`;

const SAMPLE_JSON = `[
  { "id": 1, "product": "MacBook Pro", "category": "Electronics", "price": 199990 },
  { "id": 2, "product": "Mechanical Keyboard", "category": "Accessories", "price": 8500 },
  { "id": 3, "product": "4K Monitor", "category": "Electronics", "price": 32000 }
]`;

export default function CsvJsonTool() {
  const [direction, setDirection] = useState<"csv2json" | "json2csv">("csv2json");
  const [input, setInput] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState(",");
  const [header, setHeader] = useState(true);
  const [dynamicTyping, setDynamicTyping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCsv2Json = direction === "csv2json";

  const result = isCsv2Json
    ? convertCsvToJson(input, { delimiter, header, dynamicTyping })
    : convertJsonToCsv(input, { delimiter });

  const handleToggleDirection = () => {
    if (isCsv2Json) {
      setDirection("json2csv");
      setInput(result.output || SAMPLE_JSON);
    } else {
      setDirection("csv2json");
      setInput(result.output || SAMPLE_CSV);
    }
    setError(null);
  };

  const handleSample = () => {
    setInput(isCsv2Json ? SAMPLE_CSV : SAMPLE_JSON);
    setError(null);
  };

  const handleClear = () => {
    setInput("");
    setError(null);
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const text = await readFileAsText(files[0]);
      setInput(text);
      if (files[0].name.endsWith(".json")) {
        setDirection("json2csv");
      } else if (files[0].name.endsWith(".csv") || files[0].name.endsWith(".tsv")) {
        setDirection("csv2json");
      }
      setError(null);
    } catch {
      setError("File load karne me error aaya.");
    }
  };

  const downloadExt = isCsv2Json ? "json" : "csv";
  const downloadMime = isCsv2Json ? "application/json" : "text/csv";

  return (
    <ToolShell
      toolId="csv-json"
      error={error || result.error}
      downloadFilename={`converted-data.${downloadExt}`}
      downloadMimeType={downloadMime}
      input={
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleToggleDirection}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] text-xs font-mono text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.2)] transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Mode: {isCsv2Json ? "CSV → JSON" : "JSON → CSV"}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[var(--sl-accent)] hover:bg-[rgba(34,211,238,0.1)] rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample</span>
              </button>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2 py-1 text-xs font-mono text-[var(--sl-muted)] hover:text-[var(--sl-error)] rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Textarea Input */}
          <textarea
            rows={9}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isCsv2Json
                ? "CSV data paste karo (e.g. name,age\\nAlice,25)..."
                : "JSON array paste karo (e.g. [ { \"name\": \"Alice\" } ])..."
            }
            className="w-full p-3.5 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] focus:border-[var(--sl-accent)] text-xs font-mono text-[var(--sl-text)] outline-none leading-relaxed resize-y"
          />

          <Dropzone
            accept=".csv,.tsv,.json,.txt"
            multiple={false}
            maxSizeMB={25}
            onFiles={handleFileDrop}
            label="CSV ya JSON file drag-and-drop karo"
          />

          {/* Format Options */}
          <div className="space-y-3 pt-2 border-t border-[var(--sl-border)]">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[var(--sl-muted)] block">Delimiter:</span>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-xs text-[var(--sl-text)] outline-none"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="&#9;">Tab (\t)</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>

              {isCsv2Json && (
                <div className="flex flex-col justify-end space-y-1.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[var(--sl-muted)]">
                    <input
                      type="checkbox"
                      checked={header}
                      onChange={(e) => setHeader(e.target.checked)}
                      className="accent-[var(--sl-accent)]"
                    />
                    <span>First Row is Header</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[var(--sl-muted)]">
                    <input
                      type="checkbox"
                      checked={dynamicTyping}
                      onChange={(e) => setDynamicTyping(e.target.checked)}
                      className="accent-[var(--sl-accent)]"
                    />
                    <span>Parse Numbers / Booleans</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3 text-xs font-mono">
            <span className="text-[var(--sl-accent)] font-semibold uppercase">
              Output ({isCsv2Json ? "JSON Array" : "CSV Format"})
            </span>
            {result.rowCount > 0 && (
              <div className="flex items-center gap-2 text-[var(--sl-muted)]">
                <span>{result.rowCount} rows</span>
                {result.colCount > 0 && <span>• {result.colCount} cols</span>}
              </div>
            )}
          </div>

          {result.output ? (
            <textarea
              readOnly
              rows={16}
              value={result.output}
              className="w-full p-4 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)] font-mono text-xs text-[var(--sl-text)] leading-relaxed resize-y outline-none select-all"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-14 text-center space-y-3 rounded-xl bg-[var(--sl-bg)] border border-dashed border-[var(--sl-border)]">
              <div className="p-3 rounded-full bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--sl-text)]">
                Converted output yahan dikhega
              </p>
              <p className="text-xs text-[var(--sl-muted)] max-w-xs">
                Left panel me CSV data ya JSON array paste karo. Instant transformation live hogi.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
