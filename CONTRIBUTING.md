# Contributing to SourceLab 🧪

Thank you for your interest in contributing to SourceLab! Before you get started, please review our core architectural rules and development workflow.

---

## 🔒 Non-Negotiable Core Rules

1. **Client-Side Only**: SourceLab has **zero backend servers**. Every single calculation, parsing step, or file transform MUST execute inside the client's browser (HTML5 Canvas, pure JavaScript, Web Workers, or WebAssembly). Never create API routes or remote upload endpoints.
2. **Registry-Driven**: All routing, discovery, SEO metadata, Command Palette indexing, and JSON-LD structured data are generated from declarative registry files in `registry/tools/<id>.ts`.
3. **Strict Separation of Concerns**:
   - `tools/<id>/process.ts` MUST contain pure functions with zero DOM or React dependencies.
   - `tools/<id>/index.tsx` contains only React UI components wrapping `<ToolShell>`.
   - `tools/<id>/process.test.ts` contains comprehensive unit tests (3-5 tests minimum).
4. **Copy & Tone Guidelines**:
   - User-facing UI copy and error messages: Friendly Hinglish (*"tum"*, never *"aap"*). E.g., *"File 25MB se badi hai. Pehle resize karo."*
   - SEO metadata (`seo.title` $\le 65$ chars, `seo.description` $\le 160$ chars): Clear English.
5. **Quality Gates**:
   - Every file must be under 300 lines of code.
   - `pnpm test` must be 100% green.
   - `pnpm lint` and `pnpm build` must pass with zero errors.

---

## 🛠️ Step-by-Step: Adding a New Tool

### Step 1: Scaffold Tool Files

Run the automated scaffolding script:

```bash
pnpm new-tool <tool-id> <category>
# Example:
# pnpm new-tool text-diff dev
```

This creates:
- `registry/tools/<tool-id>.ts`
- `tools/<tool-id>/process.ts`
- `tools/<tool-id>/index.tsx`
- `tools/<tool-id>/process.test.ts`
- And adds the tool mapping to `tools/index.ts`.

### Step 2: Define Tool Metadata

Edit `registry/tools/<tool-id>.ts`:
- Provide accurate `name`, `tagline`, and `icon` (Lucide icon name).
- Include comprehensive keywords (including common typos and Hinglish terms).
- Write `seo.title` ($\le 65$ characters) and `seo.description` ($\le 160$ characters).
- Include at least 4 FAQ items in Hinglish.
- Set `privacy: "client"`.

### Step 3: Implement Pure Business Logic

Write your core logic in `tools/<tool-id>/process.ts`:

```typescript
export interface ToolResult {
  output: string;
  error?: string;
}

export function processTool(input: string): ToolResult {
  if (!input.trim()) return { output: "" };
  try {
    // Pure calculation here
    return { output: transformed };
  } catch (err: any) {
    return { output: "", error: err.message || "Process karne me error aaya." };
  }
}
```

### Step 4: Write Unit Tests

Add at least 3-5 unit test cases in `tools/<tool-id>/process.test.ts` covering:
- Standard expected input
- Empty or whitespace input
- Invalid or edge case input (graceful error handling)

Run your tests:

```bash
pnpm test
```

### Step 5: Implement UI in `index.tsx`

Use `<ToolShell>` to wrap your input and output sections:

```tsx
"use client";

import React, { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { processTool } from "./process";

export default function MyTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    const res = processTool(input);
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.output);
      setError(null);
    }
  };

  return (
    <ToolShell
      toolId="my-tool-id"
      error={error}
      onRunShortcut={handleRun}
      inputSlot={/* Your input controls */}
      outputSlot={/* Your output controls */}
    />
  );
}
```

### Step 6: Verify Quality Gates

Ensure all automated checks pass:

```bash
pnpm prebuild
pnpm test
pnpm lint
pnpm build
```

---

## 📦 Pull Request Process

1. Create a feature branch: `git checkout -b feat/tool-<id>`.
2. Commit your changes with conventional commit messages: `git commit -m "feat(tool): add <id>"`.
3. Open a Pull Request with a clear description and screenshots of the empty, loading, success, and error states.
