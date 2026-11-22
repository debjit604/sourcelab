import { Tool } from "../types";

export const cookieAnalyzerTool: Tool = {
  id: "cookie-analyzer",
  slug: "/security/cookie-analyzer",
  category: "security",
  name: "HTTP Cookie Security Analyzer",
  tagline: "Set-Cookie headers parse karo aur Secure, HttpOnly, SameSite flags check karo",
  icon: "cookie",
  keywords: [
    "cookie analyzer",
    "set-cookie checker",
    "httponly check",
    "secure cookie check",
    "samesite check",
    "cookie security audit",
  ],
  seo: {
    title: "HTTP Cookie Security Analyzer Online | SourceLab",
    description:
      "Analyze HTTP Set-Cookie headers for security flags (Secure, HttpOnly, SameSite). Detect session leakage and CSRF risks with zero upload.",
  },
  inputs: ["text"],
  outputs: ["table", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["header-analyzer", "csp-evaluator", "jwt-decoder"],
  chainTo: ["header-analyzer"],
  faq: [
    {
      q: "HttpOnly flag kyu zaroori hai?",
      a: "HttpOnly flag JavaScript ko (document.cookie ke through) cookie read karne se block karta hai, jisse XSS attack ke dauran session token chori hone se bachta hai.",
    },
    {
      q: "Secure flag ka kya kaam hai?",
      a: "Secure flag ensure karta hai ki cookie sirf encrypted HTTPS connection par hi transmit ho, plaintext HTTP par kabhi leak na ho.",
    },
    {
      q: "SameSite (Strict, Lax, None) me kya difference hai?",
      a: "SameSite cross-site requests (CSRF) se protect karta hai. 'Strict' kisi bhi external link par cookie nahi bhejta, jabki 'Lax' top-level navigation allow karta hai.",
    },
    {
      q: "Cookie prefixes (__Host-, __Secure-) kya hote hain?",
      a: "Ye special browser-enforced prefixes hain jo subdomains dwara cookie overwrite ya insecure injection rokne ke liye strict scoping ensure karte hain.",
    },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-23",
};

export default cookieAnalyzerTool;
