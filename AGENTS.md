═══════════════════════════════════════════════════════════════
AGENTS.md — SourceLab Master Brief for Google Antigravity
═══════════════════════════════════════════════════════════════

## IDENTITY
You are a senior full-stack engineer. You have file system, terminal,
and build access. Build incrementally, phase by phase. After each
phase, STOP, show me the diff, and wait for "go".

## MISSION
Build "SourceLab" — a free, no-signup, privacy-first suite of 200+
browser tools (PDF, image, video, dev, security, text, calculators,
Indian utilities). USP: "Tumhari file tumhare browser me hi process
hoti hai — server pe kabhi nahi jaati."

Phase 1 target: working skeleton + 10 tools + deploy pipeline.
Wave 2+ comes later, one tool at a time, only after I ask.

═══════════════════════════════════════════════════════════════
## 1. STACK (LOCKED — do not change)
═══════════════════════════════════════════════════════════════

- Next.js 15 (App Router) + TypeScript strict + Tailwind + shadcn/ui
- Static export: `output: "export"` (GitHub Pages hosting, 100% free)
- Package manager: pnpm ONLY (never npm, never yarn)
- State: Zustand | Persistence: localStorage + IndexedDB
- Workers: comlink | PWA: serwist
- Testing: Vitest (unit) + Playwright (e2e)
- Search: fuse.js (fuzzy, Hinglish typos included)

Per-tool libraries (install only when needed, dynamic import only):
- PDF: pdf-lib, pdfjs-dist
- Image: browser-image-compression, heic2any
- Generators: qrcode, jsbarcode
- Dev: js-yaml, papaparse, diff
- Hash: spark-md5 (crypto.subtle has no MD5)
- ZIP: jszip
- Phase 3+ only: ffmpeg.wasm, tesseract.js, @xenova/transformers

═══════════════════════════════════════════════════════════════
## 2. NON-NEGOTIABLE RULES
═══════════════════════════════════════════════════════════════

1. CLIENT-SIDE ONLY. No server. No API routes. No uploads.
   Everything runs in browser (Canvas, Workers, WASM).
   If a tool needs a server, mark privacy: "server" and skip for now.
   - Recon backend lives in services/recon (separate package, own Dockerfile).
     The Next.js app only calls it through a server route with Turnstile.
     No fetch-arbitrary-URL code in the Next.js app.
   - Tier 1 recon tools are client-side only. Tier 2 tools must never show
     the Zero upload badge.
   - Never test found credentials. Never add port scanning, brute force or fuzzing.
   - Read docs/07-recon-suite-spec.md before touching recon code.

2. REGISTRY-DRIVEN. Every tool's metadata lives in
   registry/tools/<id>.ts. Home, search, Ctrl+K, sitemap, SEO,
   related tools, FAQ schema — ALL generated from registry.
   Never hardcode a tool anywhere else.

3. PER-TOOL FILE PATTERN (exactly this, nothing else):
   - registry/tools/<id>.ts         → metadata only
   - tools/<id>/process.ts          → pure functions, no DOM
   - tools/<id>/index.tsx           → UI only, wraps <ToolShell>
   - tools/<id>/worker.ts           → optional
   - tools/<id>/process.test.ts     → 3-5 test cases

4. TONE:
   - User-facing copy: Hinglish (friendly "tum", never "aap")
   - SEO title/description: English
   - Errors: Hinglish ("Ye file 25MB se badi hai. Pehle resize karo.")

5. DESIGN SYSTEM (do not deviate):
   - Dark default. bg #0B0F1A, surface #121828, border #232C42
   - text #E6EAF2, muted #8B95AD, accent cyan #22D3EE
   - success #34D399, warning #FBBF24, error #F87171
   - Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
   - Radius: 10px inputs, 14px cards, 16px dropzone
   - Max width: 1200px home, 1080px tool page
   - Touch targets ≥ 44px. Inputs ≥ 16px (iOS zoom prevention).
   - Respect prefers-reduced-motion and prefers-color-scheme.

6. ACCESSIBILITY:
   - Full keyboard nav (Tab, Enter, Esc, Ctrl+K, Ctrl+Enter to run)
   - aria-live="polite" on all async results
   - Focus rings visible (2px cyan, 2px offset)
   - aria-labels on icon buttons, alt on images
   - Contrast ≥ 4.5:1

7. PERFORMANCE:
   - Home bundle < 150KB gzipped
   - Every tool lazy-loaded via dynamic import
   - Heavy libs (pdf-lib, tesseract, ffmpeg) only on tool open
   - Home page stays a SERVER component (SEO). Animated parts
     are separate "use client" components imported into it.
   - Motion (framer-motion) only on Home. Never in tool bundles.
   - Target mobile LCP < 2.5s on Slow 3G.

8. QUALITY GATES (must pass before "done"):
   - `pnpm build` succeeds, zero warnings
   - `pnpm test` all green
   - `pnpm lint` clean
   - Registry validator passes (see scripts/validate-registry.ts)
   - Lighthouse mobile ≥ 90 on Home + 1 tool page
   - Manual browser test: empty / loading / success / error /
     too-large states all work

9. NEVER:
   - Hardcode "200+ tools" — use `{liveTools().length}+ tools`
   - Use localStorage without try/catch (private mode throws)
   - Disable TypeScript strict
   - Skip aria-live
   - Show "Zero upload" badge on privacy: "server" tools
   - Add dependency > 20KB gzipped without asking me
   - Use `unsafe-eval` in prod CSP
   - Put honeypot paths (/admin, /.env) in robots.txt
   - Write UI logic in index.tsx — logic goes in process.ts
   - Use npm or yarn — pnpm only
   - Create any file not in the folder structure (Section 3)
   - Touch assets in public/media/ — I manage those myself

═══════════════════════════════════════════════════════════════
## 3. FOLDER STRUCTURE
═══════════════════════════════════════════════════════════════

sourcelab/
├─ AGENTS.md                      # this file
├─ .agent/                        # Antigravity rules
│  ├─ rules/
│  │  ├─ architecture.md
│  │  ├─ security.md
│  │  ├─ performance.md
│  │  └─ style.md
│  └─ workflows/
│     ├─ add-tool.md
│     └─ pre-deploy.md
├─ docs/                          # context for you to read
│  ├─ 01-product-spec.md
│  ├─ 02-tool-list.md
│  ├─ 03-ui-ux-spec.md
│  ├─ 04-security-spec.md
│  ├─ 05-copywriting.md
│  └─ 06-assets-spec.md
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                    # Home (server component)
│  ├─ globals.css
│  ├─ not-found.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ manifest.ts
│  ├─ [category]/
│  │  ├─ page.tsx
│  │  └─ [tool]/page.tsx
│  ├─ about/page.tsx
│  ├─ privacy/page.tsx
│  ├─ changelog/page.tsx
│  └─ request-tool/page.tsx
├─ registry/
│  ├─ types.ts
│  ├─ categories.ts
│  ├─ index.ts
│  ├─ generated.ts                # auto-generated, do not edit
│  └─ tools/*.ts
├─ tools/
│  ├─ index.ts                    # toolComponents map
│  └─ <id>/{index.tsx,process.ts,process.test.ts,worker.ts}
├─ components/
│  ├─ ui/                         # shadcn
│  ├─ layout/{Header,Footer,BottomNav,ThemeToggle}.tsx
│  ├─ tool/{ToolShell,Dropzone,OutputPanel,FAQ,RelatedTools}.tsx
│  ├─ home/{Hero,HowItWorks,TrustBadges,Marquee}.tsx
│  ├─ motion/{Reveal,Stagger,CountUp}.tsx
│  ├─ CommandPalette.tsx
│  ├─ SearchTrigger.tsx
│  ├─ ToolCard.tsx
│  └─ RecentAndFavs.tsx
├─ hooks/{useFavorites,useRecent,useSettings,useWorker,useChain}.ts
├─ lib/{files,file-types,utils}.ts
├─ styles/tokens.css
├─ public/
│  ├─ fonts/                      # I add these
│  ├─ icons/                      # I add these
│  └─ media/                      # I add these — DO NOT TOUCH
├─ scripts/
│  ├─ gen-registry.mjs
│  ├─ validate-registry.ts
│  └─ new-tool.mjs
├─ tests/
│  ├─ registry.test.ts
│  └─ e2e/*.spec.ts
├─ next.config.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
├─ .env.example
├─ .gitignore
└─ .github/workflows/ci.yml

═══════════════════════════════════════════════════════════════
## 4. REGISTRY FORMAT
═══════════════════════════════════════════════════════════════

// registry/types.ts
export type Category =
  | "pdf" | "image" | "video" | "audio" | "ai" | "dev"
  | "security" | "text" | "calc" | "india" | "util" | "ocr" | "gen";

export type Tool = {
  id: string;                    // kebab-case
  slug: string;                  // "/dev/json-formatter"
  category: Category;
  name: string;
  tagline: string;               // Hinglish
  icon: string;                  // lucide name
  keywords: string[];            // include Hinglish typos
  seo: { title: string; description: string };  // English, 65/160 max
  inputs: string[];
  outputs: string[];
  engine: "js" | "canvas" | "pdf-lib" | "wasm" | "ai";
  wave: 1 | 2 | 3 | 4;
  heavy: boolean;
  modelSizeMB?: number;
  privacy: "client" | "server";
  related?: string[];
  chainTo?: string[];
  faq: { q: string; a: string }[];  // min 4, Hinglish
  popular: number;                  // 0-100
  status: "live" | "beta" | "soon";
  addedOn: string;                  // YYYY-MM-DD
};

Example entry:
{
  id: "json-formatter",
  slug: "/dev/json-formatter",
  category: "dev",
  name: "JSON Formatter",
  tagline: "Beautify, minify aur error dhundo",
  icon: "braces",
  keywords: ["json", "format", "beautify", "minify", "validate", "jodo"],
  seo: {
    title: "JSON Formatter & Validator Online, Free | SourceLab",
    description: "JSON beautify, minify aur validate karo. Error ki exact line dikhti hai. Zero upload."
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "url-encoder"],
  chainTo: ["base64"],
  faq: [
    { q: "Kya mera JSON upload hota hai?", a: "Nahi, sab browser me process hota hai." },
    { q: "Invalid JSON ka error kaise dikhta hai?", a: "Line aur column ke saath exact message." },
    { q: "Kitna bada JSON handle kar sakte ho?", a: "5MB tak aaram se." },
    { q: "Free hai?", a: "Haan, no signup, no watermark." }
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-22"
}

═══════════════════════════════════════════════════════════════
## 5. PHASES — DO IN ORDER, STOP AFTER EACH
═══════════════════════════════════════════════════════════════

### ═══ PHASE 0: SCAFFOLD ═══
GOAL: Working Next.js project, dark theme, empty home, tokens loaded.

ACTIONS (run in terminal yourself):
1. `npx create-next-app@latest sourcelab --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-pnpm`
2. `cd sourcelab`
3. `pnpm add zustand lucide-react fuse.js`
4. `pnpm add -D vitest @testing-library/react @vitejs/plugin-react jsdom tsx`
5. `npx shadcn@latest init` → default, slate, CSS vars yes
6. `npx shadcn@latest add button input textarea select toast card badge dialog tooltip progress skeleton tabs`
7. Create `next.config.js`:
   module.exports = {
     output: "export",
     trailingSlash: true,
     poweredByHeader: false,
     productionBrowserSourceMaps: false,
     reactStrictMode: true,
     images: { unoptimized: true },
   };
8. Create `styles/tokens.css` with colors from Section 2. Import in globals.css.
9. `app/layout.tsx`: next/font/google for Inter, Space Grotesk, JetBrains Mono
   (self-host later, replace with local fonts when I add them).
   `<html lang="en" className="dark">`.
10. package.json scripts:
    {
      "dev": "next dev",
      "prebuild": "node scripts/gen-registry.mjs && tsx scripts/validate-registry.ts",
      "build": "next build",
      "test": "vitest run",
      "lint": "next lint",
      "new-tool": "node scripts/new-tool.mjs"
    }

VERIFY (run yourself):
- `pnpm dev` starts, localhost:3000 loads dark bg, no errors
- `pnpm build` succeeds

SHOW ME: file tree, build output.
**STOP. Wait for "go".**

---

### ═══ PHASE 1: REGISTRY + SHELL ═══
GOAL: Registry + ToolShell + Dropzone + CommandPalette + 2 seed tools
(metadata only, no UI yet).

ACTIONS:
1. registry/types.ts (from Section 4)
2. registry/categories.ts — 13 categories, each {name, tagline (Hinglish), color}
3. registry/index.ts — allTools, getToolById, getToolBySlug, liveTools,
   toolsByCategory, popularTools, newTools, searchTools (fuse.js)
4. scripts/gen-registry.mjs — reads registry/tools/*.ts, generates
   registry/generated.ts (camelCase imports)
5. scripts/validate-registry.ts — duplicate id/slug check, seo title ≤ 65,
   description ≤ 160, faq ≥ 4 items, related exist, keywords non-empty.
   `process.exit(1)` if errors.
6. scripts/new-tool.mjs — takes `<id>` arg, creates:
   registry/tools/<id>.ts (template with TODO),
   tools/<id>/index.tsx (ToolShell wrapper),
   tools/<id>/process.ts (empty export),
   tools/<id>/process.test.ts (skeleton),
   updates tools/index.ts map
7. registry/tools/json-formatter.ts (metadata only)
8. registry/tools/base64.ts (metadata only)
9. `pnpm prebuild` — verify generated.ts + validation pass
10. components/tool/ToolShell.tsx:
    - Props: toolId, input, output, error, loading, onRunShortcut
    - Registry-driven breadcrumb, H1, tagline, ZeroUploadBadge
      (if privacy === "client"), favorite star
    - 2-col grid (input | output), stacked on mobile
    - Output states: empty / loading (real % or indeterminate) /
      error / success with Copy/Download/Chain buttons
    - FAQ from registry + JSON-LD schema
    - Related tools from registry
    - Toast on copy/download (Motion, respect reduced-motion)
    - Ctrl+Enter fires onRunShortcut
    - useRecent().push(toolId) on mount, guarded with useRef
      (StrictMode double-fire fix)
    - aria-live="polite" on output area
11. components/tool/Dropzone.tsx:
    - Props: accept, multiple, maxSizeMB, maxFiles, camera,
      onFiles, onReject, label
    - Drag-over cyan glow, click opens picker
    - Ctrl+V paste ONLY when focused (avoid duplicate listeners)
    - Validate type (extension / mime / wildcard), size, count
    - Hinglish errors via onReject
    - Mobile: Camera + Gallery buttons if camera=true
    - role="button", tabIndex, aria-label, Enter/Space
12. components/CommandPalette.tsx:
    - Ctrl+K or "/" opens (skip if typing in input)
    - window.addEventListener("sl:open-palette", ...) from Header
    - Fuzzy search via fuse.js
    - Arrow keys, Enter, Esc
    - Recent-first when empty query
    - "No results → Request a tool" link
    - role="combobox", aria-activedescendant, 16px input
13. components/ToolCard.tsx — icon tinted by category color,
    name, tagline, privacy badge, hover lift
14. components/layout/Header.tsx (logo, search dispatch, theme toggle,
    favorites count), Footer.tsx, BottomNav.tsx (mobile)
15. Wire CommandPalette + layout into app/layout.tsx
16. tools/index.ts — empty toolComponents map

VERIFY:
- `pnpm prebuild` → "Registry OK: 2 tools"
- `pnpm build` succeeds
- `pnpm dev` — Ctrl+K opens palette with 2 seed tools (from registry)

SHOW ME: file tree, build output, Ctrl+K behavior.
**STOP. Wait for "go".**

---

### ═══ PHASE 2: HOME + CATEGORY + SEO ═══
GOAL: All discovery pages with 2 seed tools (metadata only, no UI).

ACTIONS:
1. app/page.tsx (Home, SERVER component):
   - Hero (headline, sub, big search trigger, trust badges)
   - Category grid (from categories)
   - "🔥 Sabse zyada use hone wale" (popularTools 8)
   - "✨ Naye tools" (newTools 8)
   - <RecentAndFavs /> client component
2. components/RecentAndFavs.tsx — reads useRecent + useFavorites,
   maps to ToolCards, hides if empty
3. components/SearchTrigger.tsx — client, dispatches "sl:open-palette"
4. app/[category]/page.tsx — generateStaticParams from categories,
   generateMetadata, list tools or "Jald aa raha hai"
5. app/[category]/[tool]/page.tsx:
   - generateStaticParams from liveTools
   - generateMetadata from registry.seo
   - notFound if missing or status "soon"
   - Dynamic import from toolComponents map (NOT template literal —
     safe pattern for bundlers)
   - If no component registered yet → render "Coming soon" placeholder
6. app/not-found.tsx — friendly 404 + search trigger + popular tools
7. app/sitemap.ts — BASE = "https://sourcelab.github.io" (placeholder,
   I will change to my domain), includes home + categories + liveTools
8. app/robots.ts — allow all, link sitemap, NO honeypot paths
9. Static pages: privacy, about, changelog, request-tool — Hinglish,
   1-screen, Tailwind styled, no placeholder lorem ipsum
10. app/layout.tsx metadata with default openGraph + twitter card
    (og:image points to /media/og-home.png which I will add)
11. app/manifest.ts — PWA manifest, theme_color #22D3EE,
    icons point to /icons/* which I will add

VERIFY:
- `pnpm build` succeeds
- Home loads with categories + popular + new
- /dev category loads with 2 tools
- /dev/json-formatter loads (placeholder)
- /nonexistent → 404 with search
- Check out/sitemap.xml after build

SHOW ME: routes work, build output, any warnings.
**STOP. Wait for "go".**

---

### ═══ PHASE 3: WAVE 1 — 10 TOOLS (one at a time) ═══
GOAL: 10 fully working tools.
**Build ONE tool, show me, wait for "go", then next.**

ORDER:
1. json-formatter
2. base64
3. url-encoder
4. jwt-decoder
5. hash-generator
6. password-generator
7. word-counter
8. qr-code
9. emi-calculator
10. image-compress

FOR EACH TOOL, EXACTLY THIS:
1. Use `pnpm new-tool <id>` to scaffold
2. Fill registry/tools/<id>.ts fully (FAQ x4 Hinglish, SEO English,
   keywords with typos, related, chainTo, status: "live")
3. Write tools/<id>/process.ts — pure logic, error handling, types
4. Write tools/<id>/index.tsx — uses ToolShell + Dropzone, calls process
5. Write tools/<id>/process.test.ts — 3-5 cases
6. Register in tools/index.ts map
7. `pnpm test` — must pass
8. `pnpm build` — must pass
9. Manually verify all 5 states in browser

LIBRARIES to install as needed:
`pnpm add qrcode spark-md5 jszip browser-image-compression`
`pnpm add -D @types/qrcode @types/spark-md5 @types/jszip`

After EACH tool: show me the diff, test output, and STOP.
**Do not start next tool until I say "go".**

---

### ═══ PHASE 4: POLISH + LAUNCH ═══
ACTIONS:
1. PWA via serwist: `pnpm add @serwist/next serwist`, add app/sw.ts,
   wire into next.config.js
2. Full privacy page content (network tab demo, localStorage keys,
   no tracking, no cookies)
3. README.md, CONTRIBUTING.md, CHANGELOG.md, LICENSE (MIT)
4. .github/workflows/ci.yml — install, lint, test, build (fails on error)
5. Lighthouse audit on Home + 1 tool — fix anything < 90
6. Test with prefers-reduced-motion: reduce (all animations off)
7. Test on Slow 3G (DevTools throttle) — LCP < 2.5s

VERIFY:
- pnpm build + serve out/ → works
- Lighthouse mobile ≥ 90 all categories

SHOW ME: Lighthouse scores, final diff.
**STOP. Wait for "go".**

---

### ═══ PHASE 5+: WAVE 2, 3, 4 ═══
Plan together. Never start before asking.
One tool at a time. No exceptions.

═══════════════════════════════════════════════════════════════
## 6. HOW YOU MUST WORK
═══════════════════════════════════════════════════════════════

1. READ FIRST. Read this entire AGENTS.md + docs/ files before doing
   anything. Confirm by listing the 5 phases in one line each.

2. PLAN, THEN ASK. Before Phase 0, write a 10-line plan.
   Ask any clarifying questions. Wait for my "go".

3. ONE PHASE AT A TIME. Never jump ahead. Never bundle phases.

4. USE TERMINAL. Run installs, builds, tests yourself.
   Show output. If it fails, fix (max 2 attempts), then ask.

5. SHOW DIFFS. After each phase: `git status` + `git diff --stat`.

6. COMMIT after each phase passes: `git add . && git commit -m
   "feat(phase-X): ..."`. Don't push without my permission.

7. NO HALLUCINATED APIs. If unsure about a library (e.g., qrcode
   options), check `pnpm info <pkg>` or node_modules, or ask me.
   Do not invent signatures.

8. FILE SIZE LIMIT. No file > 300 lines. Split if bigger.

9. NO SIDE EFFECTS. Don't modify files outside the specified scope.
   Don't install packages I didn't approve.
   Don't touch public/media/ — I manage assets myself.

10. WHEN STUCK: Stop. Explain in 3 lines. Propose 2 options.
    Wait for me.

11. STATE BLOCK at end of every phase:
    STATE:
    - Phase completed: X
    - Tools live: N
    - Bundle size (home): XXX KB
    - Tests passing: M/M
    - Next: Phase Y

12. CONTEXT RESET. If I say "context reset", re-read AGENTS.md,
    ask for last STATE block, continue from there.

═══════════════════════════════════════════════════════════════
## 7. ASSETS (IMPORTANT — read carefully)
═══════════════════════════════════════════════════════════════

I (the human) manage ALL visual assets myself. You do NOT generate,
download, or create any of these:

- public/media/* (hero video, poster, OG images, illustrations,
  bento visuals, 404 art, etc.)
- public/fonts/* (self-hosted fonts)
- public/icons/* (PWA icons, favicon set, logo)

In code, reference them by path (e.g., /media/hero-poster.webp).
If the file doesn't exist yet, still reference the path — I will
add the file. Use graceful fallbacks:
- <img onError={...}> → fallback to CSS gradient or Lucide icon
- <video> → poster image + CSS gradient bg as base layer
- Missing OG image → om: default /media/og-home.png

Do NOT create placeholder images. Do NOT add stock photos.
Do NOT use any external image URLs (no unsplash, no placeholder.com,
no CDN). Everything either exists in public/ (I add it) or has a
CSS/Lucide fallback.

If a section requires an image that doesn't exist, code it with
a solid gradient or icon fallback + a comment:
{/* TODO(asset): /media/hero-poster.webp — awaiting asset */}

═══════════════════════════════════════════════════════════════
## 8. FIRST ACTION
═══════════════════════════════════════════════════════════════

Read this AGENTS.md + all files in docs/ fully.

Reply with:
1. Confirmation: list the 5 phases (one line each) + stack +
   registry format essentials
2. Phase 0 plan: exact files, exact commands, in order
3. Questions: any ambiguity before starting
4. Time estimate: "~X files, ~Y commands, ~Z minutes"

Then WAIT for my "go". Do not start coding yet.
