# Changelog 📋

All notable changes to SourceLab are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-22

### Phase 4: Polish & Production Launch
- **PWA Integration**: Offline caching and service worker lifecycle configured via `@serwist/next` with custom runtime caching strategies.
- **Privacy Inspector**: Added live interactive Network Tab simulation and browser LocalStorage inspector in `/privacy` with one-click storage wipe.
- **Documentation**: Added comprehensive `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and `LICENSE` (MIT).
- **Continuous Integration**: Configured GitHub Actions CI pipeline (`.github/workflows/ci.yml`) for linting, testing, and static production exports.

### Phase 3: Wave 1 Tools (10 Production Client-Side Tools)
- **JSON Formatter & Validator (`/dev/json-formatter`)**: Beautify (2 or 4 spaces), minify, and detect syntax errors with line/column pointers.
- **Base64 Encode & Decode (`/dev/base64`)**: Text and binary encoding/decoding with URL-safe RFC 4648 formatting.
- **URL Encoder & Decoder (`/dev/url-encoder`)**: Full URI and URI component encoding with component-mode toggles.
- **JWT Decoder (`/dev/jwt-decoder`)**: Inspect JWT headers, claims, signature, and expiration statuses with countdown badges.
- **Hash Generator (`/security/hash-generator`)**: Compute MD5, SHA-1, SHA-256, and SHA-512 hashes client-side with upper/lowercase toggles.
- **Password Generator (`/security/password-generator`)**: Cryptographically secure generator using `crypto.getRandomValues()` with entropy assessment and preset options.
- **Word & Character Counter (`/text/word-counter`)**: Real-time word, character, sentence, paragraph, reading time, and speaking time counter with top keyword frequency analysis.
- **QR Code Generator (`/gen/qr-code`)**: Client-side QR generation with customizable colors, error correction levels (L, M, Q, H), and SVG/PNG download.
- **EMI Loan Calculator (`/calc/emi-calculator`)**: Interactive principal, interest rate, and tenure sliders with monthly amortization schedules and total interest breakdowns.
- **Image Compressor (`/image/image-compress`)**: Pure client-side Canvas and Web Worker compression with real-time quality sliders, size reduction badges, and instant download.

### Phase 2: Home, Category & Discovery Routes
- **Server-Rendered Home Page**: Category discovery grid, most popular tools list, new tools list, and trust badges.
- **Dynamic Category Pages (`/[category]`)**: Statically exported category listings with dynamic metadata.
- **Dynamic Tool Pages (`/[category]/[tool]`)**: Registry-driven routing with automatic dynamic component resolution.
- **Discovery Components**: Search trigger button, `RecentAndFavs` localStorage-backed tool shelves, and custom 404 page with fuzzy tool suggestions.
- **SEO & Structured Data**: Automated sitemap generation (`/sitemap.xml`), robots config (`/robots.txt`), and per-tool JSON-LD FAQ schema.

### Phase 1: Registry Engine & Component Shell
- **Registry Engine**: Declarative metadata types, automated registry code generator (`scripts/gen-registry.mjs`), and strict static validator (`scripts/validate-registry.ts`).
- **ToolShell (`<ToolShell />`)**: Standardized 2-column layout with responsive stacking, action bars (Copy, Download, Reset), keyboard shortcuts (`Ctrl + Enter`), and JSON-LD FAQ accordion.
- **Dropzone (`<Dropzone />`)**: Universal drag-and-drop file receiver with type validation, file size limits, paste support, and camera capture.
- **Command Palette (`<CommandPalette />`)**: Fuzzy search dialog powered by `fuse.js` accessible via `Ctrl + K` or `/`.

### Phase 0: Project Scaffold
- Next.js 15 App Router setup with static HTML export (`output: "export"`).
- Dark cyber-slate design tokens in `styles/tokens.css`.
- Typography configuration with Space Grotesk, Inter, and JetBrains Mono.
- Vitest testing framework and test utilities setup.
