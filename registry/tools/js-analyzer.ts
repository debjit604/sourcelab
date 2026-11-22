import { Tool } from "../types";

export const jsAnalyzerTool: Tool = {
  id: "js-analyzer",
  slug: "/security/js-analyzer",
  category: "security",
  name: "JS Secret & Endpoint Analyzer",
  tagline: "JavaScript, HAR aur source maps me secrets aur hidden API endpoints dhundo",
  icon: "shield-alert",
  keywords: [
    "js analyzer",
    "javascript secret scanner",
    "linkfinder",
    "extract endpoints",
    "har analyzer",
    "sourcemap secret finder",
    "bug bounty js recon",
  ],
  seo: {
    title: "JS Secret & Endpoint Analyzer Online | SourceLab",
    description:
      "Client-side scanner for JavaScript, HTML, .map and HAR files. Detect API keys, tokens, endpoints, and parameters with zero upload.",
  },
  inputs: ["file", "text"],
  outputs: ["table", "stats"],
  engine: "js",
  wave: 1,
  heavy: true,
  privacy: "client",
  related: ["jwt-decoder", "hash-identifier", "cvss-calculator"],
  chainTo: ["cvss-calculator"],
  faq: [
    {
      q: "Kaun kaun se files analyze kiye ja sakte hain?",
      a: "Aap JavaScript (.js), HTML (.html), Source Maps (.map), aur HTTP Archive (.har) files paste ya drag & drop kar sakte ho.",
    },
    {
      q: "Kaun se secrets detect hote hain?",
      a: "AWS keys, Google Cloud API keys, GitHub tokens, Slack/Discord webhooks, Stripe live keys, JWT tokens, private keys aur high-entropy credentials.",
    },
    {
      q: "LinkFinder style endpoints kaise nikalte hain?",
      a: "Tool code ko parse karke relative API routes (/api/v1/...), full domains, URL query parameters aur cloud storage buckets (S3, GCS) categorize karta hai.",
    },
    {
      q: "Kya mera source code kahi upload hota hai?",
      a: "Nahi! FileReader aur Web Workers ke jariye saari analysis 100% aapke local browser me execute hoti hai. Zero upload.",
    },
  ],
  popular: 95,
  status: "live",
  addedOn: "2026-11-23",
};

export default jsAnalyzerTool;
