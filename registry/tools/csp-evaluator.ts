import { Tool } from "../types";

export const cspEvaluatorTool: Tool = {
  id: "csp-evaluator",
  slug: "/security/csp-evaluator",
  category: "security",
  name: "Content Security Policy (CSP) Evaluator",
  tagline: "CSP directives parse karo aur XSS / bypass vulnerabilities dhundo",
  icon: "shield",
  keywords: [
    "csp evaluator",
    "content security policy",
    "csp checker",
    "csp xss bypass",
    "unsafe-inline checker",
    "csp parser",
  ],
  seo: {
    title: "CSP Evaluator Online - Content Security Policy Audit | SourceLab",
    description:
      "Evaluate and test Content Security Policy (CSP) headers offline. Detect unsafe-inline, unsafe-eval, wildcard sources, and clickjacking risks with zero upload.",
  },
  inputs: ["text"],
  outputs: ["table", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["header-analyzer", "cookie-analyzer", "js-analyzer"],
  chainTo: ["header-analyzer"],
  faq: [
    {
      q: "CSP Evaluator kya check karta hai?",
      a: "Directives me 'unsafe-inline' (XSS execution), 'unsafe-eval' (eval calls), wildcard domains (*), missing object-src, base-uri aur frame-ancestors flags check karta hai.",
    },
    {
      q: "unsafe-inline itna risky kyu maana jata hai?",
      a: "'unsafe-inline' allow karne par attacker injected <script> tags ya inline event handlers (onerror, onload) run kar sakta hai jisse CSP ka main purpose defeat ho jata hai.",
    },
    {
      q: "Kya ye tool offline chalta hai?",
      a: "Haan! Google CSP Evaluator ki tarah ye local browser me pure syntax tree banakar evaluate karta hai bina kisi remote network call ke.",
    },
    {
      q: "Strict CSP policy kaise banayein?",
      a: "Non-critical external domains hatakar nonce-based ('nonce-...') ya hash-based ('sha256-...') CSP adopt karein aur 'object-src \\'none\\'' enforce karein.",
    },
  ],
  popular: 93,
  status: "live",
  addedOn: "2026-11-23",
};

export default cspEvaluatorTool;
