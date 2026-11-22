# RECON GUARDRAILS & SECURITY RULES

## 1. Core Threat Model
A tool that fetches arbitrary URLs for strangers gets abused (attacks, scraping, probing) and can be turned against our own infrastructure (SSRF).

## 2. Legal & Ethical Rules
- **Notice on every recon page**: Explicitly state that tools are for targets the user owns, is authorized to test, or for public passive information.
- **Mandatory Authorization Checkbox**: Require "I am authorized / this is public info" checkbox before submitting any Tier 2 request.
- **NEVER validate or test discovered credentials**: Do NOT make outbound calls with extracted tokens/keys against AWS, Google, GitHub, Slack, etc. Only report "possible secret found" and provide responsible disclosure guidance.
- **Abuse Contact & Opt-Out**: Provide an abuse contact page and a domain owner opt-out blocklist.
- **Restricted Domains**: Block `.gov`, `.mil`, and critical infrastructure targets from automated crawling/recon.

## 3. SSRF Defense (Tier 2 Service)
- Allow only `http:` and `https:` protocols.
- Restrict destination ports strictly to `80`, `443` (and optionally `8080`, `8443`).
- **DNS Resolution First**: Resolve hostname before making any TCP connection.
- **Reject Forbidden Ranges**:
  - Private networks (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
  - Loopback (`127.0.0.0/8`, `::1`)
  - Link-local (`169.254.0.0/16`, `fe80::/10`)
  - Cloud metadata endpoint (`169.254.169.254`)
  - IPv4-mapped IPv6 (`::ffff:127.0.0.1`)
  - Odd IP formats (decimal, octal, hex)
- **IP Pinning**: Connect directly to the verified resolved IP to prevent DNS rebinding attacks.
- **Redirect Re-validation**: Re-run the full IP check on every redirect (max 5 redirects).
- **Hard Constraints**: Strict timeouts (8-10 seconds), maximum response body size limits, strict content-type allowlists.
- **No User Cookies/Headers**: Never pass through the client's session or cookies.
- **Fixed User-Agent**: Always identify requests as `SourceLabBot/1.0 (+https://yourdomain/bot)`.
- **Egress Firewall**: Network-level firewall rule blocking RFC 1918 and cloud metadata endpoints even if application logic is bypassed.

## 4. Infrastructure Isolation
- Run Tier 2 recon service on a separate subdomain (`recon.yourdomain`) and separate isolated container/host.
- Run process as unprivileged user with strictly capped CPU, memory, and timeout limits.
- No sensitive environment variables or secrets stored in the recon service environment.
- Headless browser: fresh ephemeral context per request, sandboxed, no GPU, downloads blocked, local file access (`file://`) blocked.

## 5. Abuse Control
- Cloudflare Turnstile token required on every Tier 2 request.
- Per-IP rate limiting AND per-target-domain rate limiting (e.g. 5 requests/minute).
- Global concurrency queue.
- Zero result storage; minimal operational logs retained for $\le 7$ days solely for abuse mitigation.
