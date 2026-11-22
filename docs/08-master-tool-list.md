# SOURCELAB - MASTER TOOL LIST

## A) ALREADY BUILT (30 Live Tools)
- `json-formatter`, `base64`, `url-encoder`, `jwt-decoder`, `hash-generator`
- `password-generator`, `word-counter`, `qr-code`, `emi-calculator`, `image-compress`
- `case-converter`, `uuid-generator`, `gst-calculator`, `diff-checker`, `pdf-merge`
- `image-resize`, `csv-json`, `lorem-generator`, `sip-calculator`, `timestamp-converter`
- `markdown-preview`, `color-picker`, `pdf-split`, `svg-to-png`, `age-calculator`
- `html-entity`, `text-sorter`, `aspect-ratio`, `regex-tester`, `aadhaar-masker`

---

## B) WAVE 1 REMAINING (Pure JS, ~19 Tools)
- **Security/CTF**:
  - `password-strength`
  - `hash-identifier`
  - `magic-decoder`
  - `caesar-rot`
  - `xor-tool`
  - `totp-generator`
  - `cvss-calculator`
  - `morse-code`
  - `text-binary`
- **Text**:
  - `slug-generator`
  - `remove-duplicates`
  - `find-replace`
  - `fancy-fonts`
- **Calc/Util**:
  - `percentage-calculator`
  - `bmi-calculator`
  - `compound-interest`
  - `number-to-words`
  - `unit-converter`
  - `random-picker`

---

## C) SPECIAL TOOLS (Confirmed, 17 Tools)
1. Suspicious File Inspector
2. Legacy Font Converter (Kruti Dev / Bijoy <-> Unicode)
3. KYC-Safe Document Redactor
4. Govt Exam Photo + Signature Resizer
5. QR/Link Safety Checker
6. QR with text/label + printable poster
7. Share-Safe Cleaner (hidden metadata remover)
8. PDF to Exact Size (KB target)
9. Aadhaar/ID A4 Print Sheet
10. Signature Extractor (transparent PNG)
11. Secret Leak Guard (paste code/logs, find secrets, mask)
12. Screenshot Sanitizer (auto-blur sensitive text)
13. Password-Protected ZIP Maker
14. Exact Print Size / DPI Tool
15. Calendar (.ics) Generator
16. Text to Handwriting
17. Typing / WPM Test (grapheme-based, Indian languages + English)

*Grouping idea: "Govt Form Toolkit" hub = 3, 4, 8, 9, 10 + aadhaar-masker*

---

## D) CANDIDATES (Not confirmed yet - decide later)
- Attendance Bunk Calculator
- File Integrity Verifier (checksum compare)
- Product Photo Studio (bulk, sellers)
- Time Zone Meeting Planner
- Lookalike Domain Checker
- Privacy Policy Generator
- India Tax Toolkit (HRA, gratuity, old vs new regime; verify slabs every year)
- WCAG Contrast Checker

---

## E) WAVE 2 (Libraries)
- **PDF**: rotate, reorder, delete/extract pages, page numbers, watermark, protect/unlock, sign, redact, crop, flatten, form filler, compare, metadata, PDF<->JPG
- **Image**: crop, rotate, HEIC/WebP/AVIF, text/watermark, blur, passport photo, social sizes, collage, meme, GIF, screenshot beautifier, ASCII art
- **OCR**: image to text Hindi/Bengali/English, searchable PDF, doc scanner, table extract, ID masker

---

## F) WAVE 3 (WASM/AI) & WAVE 4 (BYO-Key)
- **Wave 3 (WASM/AI)**: ffmpeg video/audio tools, background remover, upscaler, face blur, translator (in-browser models)
- **Wave 4 (BYO-Key)**: chat with PDF, AI image generator, resume writer

---

## G) RECON SUITE (~20 Tools)
- **Tier 1 (Client-Side, Zero Upload)**:
  - `js-analyzer` (JS Secret & Endpoint Analyzer)
  - `header-analyzer`
  - `csp-evaluator`
  - `cookie-analyzer`
  - `cert-decoder`
  - `url-extractor`
  - `wayback-filter`
  - `subdomain-toolbox`
  - `robots-parser`
  - `scope-helper`
  - `recon-report`
  - `dns-lookup` (DoH)
- **Tier 2 (Server-Assisted, Separate Hardened Service)**:
  - `website-recon`
  - `ssl-inspector`
  - `ct-subdomains`
  - `website-screenshot`
  - `page-extractor`
  - `shallow-crawler`
  - `js-harvester`
  - `archive-urls`
