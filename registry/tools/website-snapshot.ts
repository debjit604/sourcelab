import { Tool } from "../types";

export const websiteSnapshot: Tool = {
  id: "website-snapshot",
  slug: "/security/website-snapshot",
  category: "security",
  name: "Website Snapshot",
  tagline: "URL ka deep snapshot, assets, screenshots aur security recon",
  icon: "camera",
  keywords: [
    "website snapshot",
    "recon",
    "web scraper",
    "site clone",
    "asset downloader",
    "security scanner",
    "site audit",
    "subdomain finder",
  ],
  seo: {
    title: "Website Snapshot & Asset Downloader | SourceLab",
    description: "Analyze any website with deep asset mirroring, desktop and mobile screenshots, passive DNS, SSL, SEO audit, and hidden paths.",
  },
  inputs: ["url"],
  outputs: ["zip", "image", "json"],
  engine: "wasm",
  wave: 2,
  heavy: true,
  privacy: "server",
  related: ["header-analyzer", "csp-evaluator", "dns-lookup", "js-analyzer"],
  chainTo: ["js-analyzer"],
  faq: [
    {
      q: "Website Snapshot kya karta hai?",
      a: "Ye kisi bhi public website ka desktop aur mobile screenshot leta hai, JS/CSS/image assets collect karta hai, DNS/SSL check karta hai aur downloadable ZIP banata hai.",
    },
    {
      q: "Kya ye tool client-side chalta hai?",
      a: "Nahi, ye server-assisted tool hai jismein headless browser securely page fetch karta hai. Files 10 minute baad automatically delete ho jaati hain.",
    },
    {
      q: "Kya internal IPs ya localhost scan kar sakte hain?",
      a: "Bilkul nahi. Strict SSRF protection active hai jo private IP ranges aur internal networks ko block karti hai.",
    },
    {
      q: "Kya downloaded JS files mein secrets check hote hain?",
      a: "Haan, downloaded JavaScript aur source maps ko automatically security analyzer scan karta hai API keys aur endpoints ke liye.",
    },
  ],
  popular: 95,
  status: "live",
  addedOn: "2026-11-23",
};

export default websiteSnapshot;
