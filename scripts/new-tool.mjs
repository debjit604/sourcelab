import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const id = process.argv[2];
const category = process.argv[3] || "dev";

if (!id) {
  console.error("Usage: pnpm new-tool <id> [category]");
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error("Error: <id> must be kebab-case (e.g. url-encoder)");
  process.exit(1);
}

function toPascalCase(str) {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const pascalName = toPascalCase(id);
const readableName = id
  .split("-")
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join(" ");

// 1. registry/tools/<id>.ts
const registryFile = path.join(rootDir, `registry/tools/${id}.ts`);
if (!fs.existsSync(registryFile)) {
  const registryContent = `import { Tool } from "../types";

export const ${pascalName.charAt(0).toLowerCase() + pascalName.slice(1)}Tool: Tool = {
  id: "${id}",
  slug: "/${category}/${id}",
  category: "${category}",
  name: "${readableName}",
  tagline: "TODO: Hinglish tagline",
  icon: "wrench",
  keywords: ["${id.replace(/-/g, '", "')}"],
  seo: {
    title: "${readableName} Online, Free | SourceLab",
    description: "TODO: English SEO description under 160 characters. Zero upload."
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  faq: [
    { q: "Kya data server pe jata hai?", a: "Nahi, sab tumhare browser me process hota hai." },
    { q: "Free hai?", a: "Haan, bilkul free bina kisi signup ke." },
    { q: "Offline chalta hai?", a: "Haan, browser cache ke saath offline support hai." },
    { q: "Koi file size limit hai?", a: "Browser memory ke hisaab se large files handle hoti hain." }
  ],
  popular: 70,
  status: "live",
  addedOn: new Date().toISOString().split("T")[0]
};

export default ${pascalName.charAt(0).toLowerCase() + pascalName.slice(1)}Tool;
`;
  fs.writeFileSync(registryFile, registryContent, "utf-8");
  console.log(`Created: registry/tools/${id}.ts`);
}

// 2. tools/<id>/process.ts
const toolDir = path.join(rootDir, `tools/${id}`);
if (!fs.existsSync(toolDir)) {
  fs.mkdirSync(toolDir, { recursive: true });
}

const processFile = path.join(toolDir, "process.ts");
if (!fs.existsSync(processFile)) {
  const processContent = `export interface ProcessInput {
  text?: string;
  file?: File;
  options?: Record<string, unknown>;
}

export interface ProcessOutput {
  result: string;
  metadata?: Record<string, unknown>;
}

export async function process(input: ProcessInput): Promise<ProcessOutput> {
  const raw = input.text ?? "";
  if (!raw.trim()) {
    throw new Error("Input khali hai. Kripya data daalein.");
  }
  return {
    result: raw,
  };
}
`;
  fs.writeFileSync(processFile, processContent, "utf-8");
  console.log(`Created: tools/${id}/process.ts`);
}

// 3. tools/<id>/index.tsx
const indexFile = path.join(toolDir, "index.tsx");
if (!fs.existsSync(indexFile)) {
  const indexContent = `"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { process as processAction } from "./process";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ${pascalName}ToolComponent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await processAction({ text: input });
      setOutput(res.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kuch gadbad ho gayi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      toolId="${id}"
      input={
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Yahan data enter karo..."
            rows={10}
            className="font-mono text-base resize-y"
          />
          <Button onClick={handleRun} disabled={loading} className="w-full">
            {loading ? "Process ho raha hai..." : "Run (Ctrl + Enter)"}
          </Button>
        </div>
      }
      output={output}
      error={error}
      loading={loading}
      onRunShortcut={handleRun}
    />
  );
}
`;
  fs.writeFileSync(indexFile, indexContent, "utf-8");
  console.log(`Created: tools/${id}/index.tsx`);
}

// 4. tools/<id>/process.test.ts
const testFile = path.join(toolDir, "process.test.ts");
if (!fs.existsSync(testFile)) {
  const testContent = `import { describe, it, expect } from "vitest";
import { process } from "./process";

describe("${readableName} Process", () => {
  it("processes standard input successfully", async () => {
    const res = await process({ text: "test input" });
    expect(res.result).toBe("test input");
  });

  it("throws error for empty input", async () => {
    await expect(process({ text: "" })).rejects.toThrow("Input khali hai");
  });

  it("handles whitespace input gracefully", async () => {
    await expect(process({ text: "   " })).rejects.toThrow();
  });
});
`;
  fs.writeFileSync(testFile, testContent, "utf-8");
  console.log(`Created: tools/${id}/process.test.ts`);
}

// 5. Update tools/index.ts
const toolsIndexFile = path.join(rootDir, "tools/index.ts");
let currentToolsIndex = "";
if (fs.existsSync(toolsIndexFile)) {
  currentToolsIndex = fs.readFileSync(toolsIndexFile, "utf-8");
}

const componentExportLine = `  "${id}": dynamic(() => import("@/tools/${id}")),`;
if (!currentToolsIndex.includes(`"${id}":`)) {
  if (!currentToolsIndex.includes("toolComponents")) {
    currentToolsIndex = `import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const toolComponents: Record<string, ComponentType<unknown>> = {
${componentExportLine}
};
`;
  } else {
    currentToolsIndex = currentToolsIndex.replace(
      /export const toolComponents: Record<string, ComponentType<[^>]+>> = \{/,
      `export const toolComponents: Record<string, ComponentType<Record<string, unknown>>> = {\n${componentExportLine}`
    );
  }
  fs.writeFileSync(toolsIndexFile, currentToolsIndex, "utf-8");
  console.log(`Updated: tools/index.ts with "${id}" component`);
}

// 6. Regenerate registry
try {
  execSync("node scripts/gen-registry.mjs", { stdio: "inherit", cwd: rootDir });
} catch (e) {
  console.error("Failed to run gen-registry:", e);
}

