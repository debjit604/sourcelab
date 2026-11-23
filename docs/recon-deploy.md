# SourceLab Recon Service: Deployment Guide

This document outlines how to deploy the hardened **Website Snapshot** reconnaissance microservice (`services/recon`) to Render, Fly.io, or a dedicated Linux VPS.

---

## 1. Architecture Overview

```
[ Browser / User ]
       │
       ├── (HTTPS / Static Assets) ──> [ Next.js Frontend @ Vercel / Custom Domain ]
       │                                     │
       └── (HTTPS + Turnstile Token) ────────┴──> [ Recon Microservice @ Render / Fly.io / VPS ]
                                                        │
                                                        ├── SSRF & Rebinding Request Guard
                                                        ├── Headless Chromium (Playwright)
                                                        └── Ephemeral In-Memory Store (10m TTL)
```

- **Frontend:** Hosted on Vercel with your custom `.io` domain. Static and fast, zero scraping code runs here.
- **Recon Service:** Independent Dockerized Node.js service running headless Chromium with persistent process capacity.
- **Egress Boundary:** The recon service only communicates with public web targets; all RFC1918, link-local, loopback, and cloud metadata (`169.254.169.254`) requests are strictly rejected.

---

## 2. Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `4000` | Port the HTTP server binds to. |
| `NODE_ENV` | No | `production` | Node environment. |
| `TURNSTILE_SECRET_KEY` | Yes (Prod) | - | Cloudflare Turnstile server-side secret key. |
| `ALLOWED_ORIGINS` | Yes (Prod) | `*` | Comma-separated list of allowed frontends (e.g. `https://sourcelab.io`). |
| `AUDIT_IP_SALT` | Yes (Prod) | - | Salt used for one-way SHA-256 hashing of client IPs in audit logs. |

---

## 3. Option A: Render Deployment (Docker)

1. Connect your GitHub repository to [Render](https://render.com).
2. Choose **New Web Service** and select **Docker** as the runtime.
3. Configure settings:
   - **Root Directory:** Repository root (`.`)
   - **Dockerfile Path:** `services/recon/Dockerfile`
   - **Instance Type:** Standard (minimum 1 GB RAM, 2 GB recommended for headless Chromium).
   - **Health Check Path:** `/health`
4. Set Environment Variables in the Render dashboard:
   - `PORT`: `4000`
   - `TURNSTILE_SECRET_KEY`: `<your-turnstile-secret>`
   - `ALLOWED_ORIGINS`: `https://yourdomain.io`
   - `AUDIT_IP_SALT`: `<random-secret-salt>`
5. Deploy and attach your subdomain (e.g., `recon.yourdomain.io`).

---

## 4. Option B: Fly.io Deployment

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Launch app from root directory:
   ```bash
   fly launch --dockerfile services/recon/Dockerfile
   ```
3. Set VM memory to at least 1GB (headless browser requires shared memory):
   ```bash
   fly scale memory 1024
   ```
4. Configure secrets:
   ```bash
   fly secrets set TURNSTILE_SECRET_KEY="<secret>" AUDIT_IP_SALT="<salt>" ALLOWED_ORIGINS="https://yourdomain.io"
   ```
5. Deploy:
   ```bash
   fly deploy
   ```

---

## 5. Option C: Dedicated Linux VPS (Docker + UFW / iptables)

For optimal isolation and performance on a small VPS (Ubuntu 24.04 / Debian 12):

### 5.1 Docker Run
```bash
docker build -t sourcelab-recon -f services/recon/Dockerfile .
docker run -d \
  --name sourcelab-recon \
  --restart unless-stopped \
  --memory 2g \
  --shm-size 1g \
  -p 4000:4000 \
  -e PORT=4000 \
  -e TURNSTILE_SECRET_KEY="<secret>" \
  -e ALLOWED_ORIGINS="https://yourdomain.io" \
  sourcelab-recon
```

### 5.2 Host Egress Firewall Rule (Defense in Depth)
While the application-level SSRF guard rejects private IPs, enforce network-layer defense-in-depth:
```bash
# Block container egress to RFC1918 and Cloud Metadata
iptables -I FORWARD -d 10.0.0.0/8 -j DROP
iptables -I FORWARD -d 172.16.0.0/12 -j DROP
iptables -I FORWARD -d 192.168.0.0/16 -j DROP
iptables -I FORWARD -d 169.254.169.254/32 -j DROP
```

---

## 6. Verification & Health Monitoring

### Health Probe
```bash
curl -I https://recon.yourdomain.io/health
# Expected: HTTP/1.1 200 OK
# Content-Type: application/json
# {"status":"ok","timestamp":"..."}
```

### Verify SSRF Protection
```bash
curl -X POST https://recon.yourdomain.io/snapshot \
  -H "Content-Type: application/json" \
  -d '{"url":"http://169.254.169.254/latest/meta-data"}'
# Expected: HTTP/1.1 400 Bad Request
# {"error":"Target IP address 169.254.169.254 is within a restricted or private network range"}
```
