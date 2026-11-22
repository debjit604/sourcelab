# SourceLab 🧪

> **Tumhari file tumhare browser me hi process hoti hai — server pe kabhi nahi jaati.**

SourceLab is a 100% client-side, privacy-first developer and utility toolkit. Every PDF transformation, image compression, hash generation, and calculation runs directly inside your browser using HTML5 Canvas, Web Workers, and WebAssembly.

---

## ⚡ Core Features

- 🔒 **Zero Server Uploads**: No backend servers, no file transfers, no database. Everything executes in client memory.
- 🚀 **Blazing Fast**: Near-instant execution with Web Workers and pure client-side algorithms.
- 📱 **Progressive Web App (PWA)**: Installable on Desktop and Mobile via Serwist for true offline usage.
- ⌨️ **Keyboard First**: Global Command Palette (`Ctrl + K` or `/`), quick shortcuts, and accessible tab flows.
- 🎨 **Modern Cyber-Slate Design**: Space Grotesk + JetBrains Mono typography with accessible contrast and reduced-motion support.
- 🧪 **Registry-Driven Architecture**: Fully modular tool system where all routes, discovery, metadata, and FAQ JSON-LD schemas are generated from a single declarative registry.

---

## 🛠️ Live Tools (Wave 1)

| Tool | Category | Engine | Description |
| :--- | :--- | :--- | :--- |
| **JSON Formatter** | Dev | Pure JS | Beautify, minify, and validate JSON with exact syntax line indicators |
| **Base64 Encode/Decode** | Dev | Pure JS / Buffer | Fast text and binary data encoder/decoder with URL-safe mode |
| **URL Encoder/Decoder** | Dev | Pure JS | Percent-encode and decode URIs and query strings cleanly |
| **JWT Decoder** | Dev | Pure JS | Inspect JSON Web Token headers, payload claims, and expiration timestamps |
| **Hash Generator** | Security | Web Crypto / MD5 | Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes in real-time |
| **Password Generator** | Security | Web Crypto | Cryptographically secure password generator with customizable character sets |
| **Word & Char Counter** | Text | Pure JS | Real-time word, character, sentence, paragraph, reading, and speaking time counter |
| **QR Code Generator** | Utilities | Canvas / qrcode | Generate downloadable PNG/SVG QR codes with configurable error correction |
| **EMI Loan Calculator** | Calculator | Pure JS | Compute monthly EMIs, total interest, and amortization breakups with monthly sliders |
| **Image Compressor** | Image | Canvas / Workers | Compress JPEG, PNG, and WebP images client-side with side-by-side preview |

---

## 🏗️ Architecture & Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router, Static HTML Export `output: "export"`)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Radix UI primitives
- **Icons**: Lucide React
- **State**: Zustand (with localStorage persistence)
- **Search**: Fuse.js (Client-side fuzzy search with Hinglish phonetic support)
- **Offline / PWA**: Serwist Service Worker
- **Testing**: Vitest & Testing Library

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (`npm i -g pnpm`)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/your-username/sourcelab.git
cd sourcelab

# Install dependencies
pnpm install

# Start local development server
pnpm dev
```

Visit `http://localhost:3000` in your browser.

### Building & Testing

```bash
# Run test suite
pnpm test

# Run code linter
pnpm lint

# Build static production export
pnpm build
```

The static output will be generated into `out/`, ready for zero-cost hosting on GitHub Pages, Cloudflare Pages, or Vercel.

---

## 🤝 Contributing

We welcome community contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to add new tools using our automated scaffolding CLI (`pnpm new-tool <id> <category>`).

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
