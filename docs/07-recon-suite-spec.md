# RECON SUITE (BUG BOUNTY) - FULL SPEC & GUARDRAILS

## 1. Principle
PASSIVE recon + single, browser-like requests. No port scanning, no brute forcing, no fuzzing, no exploit checks.
Two tiers, because they have different privacy promises:

---

## 2. TIER 1 - CLIENT-SIDE (Zero upload, keeps the SourceLab promise)

1. **JS Secret & Endpoint Analyzer** (paste / drop JS, HTML, .map, HAR)
   - Secret patterns: AWS access key id, Google API key (AIza...), GitHub tokens (ghp_/gho_/ghs_...), Slack (xox...), Stripe live keys, Twilio, SendGrid, Mailgun, Telegram bot tokens, Discord webhooks, Firebase URLs, JWTs, private key blocks, generic high-entropy strings next to words like key/secret/token/password
   - Shannon entropy score to cut false positives
   - Endpoints, API paths, full URLs, parameters (LinkFinder style)
   - Internal hostnames, S3/GCS buckets, staging URLs, TODO/comments
   - sourceMappingURL detection (exposed source maps)
   - Output: findings table with severity, snippet (masked), line, JSON/CSV/Markdown export

2. **HTTP Header Analyzer** (paste raw response headers)
   - Security header grade, CSP parser (flags unsafe-inline, unsafe-eval, wildcards, missing base-uri/object-src), CORS hints, cookie flags (Secure, HttpOnly, SameSite), cache and info leaks

3. **CSP Evaluator** (offline)
4. **Cookie Analyzer**
5. **Certificate (PEM) Decoder**: subject, SAN, issuer, validity, key, fingerprint (local x509 parsing)
6. **URL / Parameter Extractor** from text, HAR, Burp exports; filter by extension and interesting params
7. **Wayback-style URL list filter** (paste a list, find .env, .bak, .sql, admin, api, id= patterns)
8. **Subdomain list toolbox**: dedupe, sort, extract from text, convert to tool input formats, wildcard cleanup
9. **robots.txt / sitemap.xml / security.txt parser** (paste)
10. **Scope Helper**: paste a program scope text, extract domains/wildcards
11. **Recon Report Builder + Diff**: combine results into a Markdown report, compare two JSON exports to see what changed (stored locally)
12. **DNS lookup over HTTPS** (browser to a public DoH resolver, CORS works): A, AAAA, MX, TXT, NS, CNAME, CAA, SOA, SPF/DMARC/DKIM check.
    *LABEL HONESTLY*: "queries go to Cloudflare/Google DoH", not "zero upload".

---

## 3. TIER 2 - SERVER-ASSISTED (Separate hardened service, clearly labeled)
*Do NOT show the "Zero upload" badge on these.*

13. **Website Recon Report**: one target -> DNS, RDAP/WHOIS, IP + ASN of the target, redirect chain, response headers, cookies, title/meta, tech fingerprint (wappalyzer-style rules), favicon hash, robots.txt, sitemap.xml, security.txt
14. **SSL/TLS Inspector**: chain, issuer, SAN, expiry, key size, protocol versions (light), HSTS, OCSP stapling, grade
15. **Certificate Transparency Subdomain Finder** (passive: CT log sources, cached, rate limited)
16. **Website Screenshot**: headless browser, desktop + mobile, shown on the site, with strict timeouts
17. **Page Extractor** ("advanced scraper", single page): links, forms, inputs, hidden fields, emails, phones, social handles, comments, meta tags, iframes, JS files, third-party domains; export JSON/CSV/Markdown
18. **Shallow Crawler**: same origin only, max 25 pages, polite delay, robots.txt respected by default, depth limit
19. **JS Harvester + Remote Secret Scan**: fetch the JS files a page loads (cap 30 files, 2 MB each), run the Tier 1 ruleset, flag exposed source maps, list endpoints. Nothing stored.
20. **Archive URL Discovery** (passive, web archive CDX API)

*NOT INCLUDED ON PURPOSE*: port scanning, directory brute force, subdomain brute force, vulnerability scanning, credential testing.

---

## 4. RECON GUARDRAILS (Non-Negotiable)

### Legal & Ethics
- Show a notice on every recon page: use only on targets you own, are authorized to test, or for public passive information.
- Require a checkbox "I am authorized / this is public info" before Tier 2 requests.
- NEVER validate or test discovered keys/tokens against the provider. That is using credentials without authorization. Only report "possible secret" and advise responsible disclosure.
- Check your host's acceptable use policy (Vercel, Render, etc.) for security-testing tools before launching. Many restrict scanning.
- Add an abuse contact page and a target-owner opt-out blocklist.
- Optionally block .gov / .mil / critical infrastructure domains.
- Not legal advice. Check local law (India IT Act etc.) and the terms of any third-party APIs you call.

### SSRF Defense (Tier 2 service)
- http/https only; ports 80/443 (maybe 8080/8443)
- Resolve DNS first, reject private/loopback/link-local/multicast ranges, cloud metadata (169.254.169.254), and IPv6 equivalents, IPv4-mapped IPv6, and odd IP forms (decimal, octal, hex)
- Connect to the resolved IP (pin it) to stop DNS rebinding
- Re-validate on EVERY redirect, max 5 redirects
- Timeouts (8-10 s), max response size, content-type allowlist
- Never forward the user's cookies/headers; fixed identifying User-Agent: `SourceLabBot/1.0 (+https://yourdomain/bot)`
- Network-level egress firewall: deny RFC1918 and metadata ranges even if the code has a bug

### Infrastructure Isolation
- Separate service and subdomain (recon.yourdomain), separate container/host from the main site (reputation, blast radius)
- Run unprivileged, memory/CPU/time limits, no secrets in its env
- Headless browser: fresh context per request, no GPU, sandbox on, block downloads, block local file URLs, cap page size and time

### Abuse Control
- Cloudflare Turnstile on every Tier 2 request
- Per-IP rate limit AND per-target-domain limit (e.g. 5 req/min)
- Global concurrency cap and queue
- No result storage. Minimal logs with short retention (e.g. 7 days), stated in the privacy policy
- Do not claim "zero logging" if you keep abuse logs
