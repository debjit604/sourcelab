import { Tool } from "../types";

export const headerAnalyzerTool: Tool = {
  id: "header-analyzer",
  slug: "/security/header-analyzer",
  category: "security",
  name: "HTTP Security Header Analyzer",
  tagline: "HTTP response headers check karo aur security grade (A+ to F) nikalo",
  icon: "shield-check",
  keywords: [
    "http headers",
    "security headers",
    "header analyzer",
    "hsts check",
    "csp check",
    "x-frame-options",
    "bug bounty recon headers",
  ],
  seo: {
    title: "HTTP Security Header Analyzer Online | SourceLab",
    description:
      "Analyze HTTP response headers and get security grades (A+ to F). Check HSTS, CSP, X-Frame-Options, CORS, and info leaks with zero upload.",
  },
  inputs: ["text"],
  outputs: ["table", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["csp-evaluator", "cookie-analyzer", "js-analyzer"],
  chainTo: ["csp-evaluator"],
  faq: [
    {
      q: "Security headers grade kaise calculate hota hai?",
      a: "HSTS, CSP, X-Frame-Options, X-Content-Type-Options aur Referrer-Policy ke presence aur safe configuration ke basis par 0 se 100 score aur A+ se F grade calculate hota hai.",
    },
    {
      q: "Info leaks (Server, X-Powered-By) ka kya issue hai?",
      a: "Server version ya backend framework (Express, PHP, ASP.NET) reveal hone se attackers ko targetted CVE exploits plan karne me aasani hoti hai.",
    },
    {
      q: "Fix recommendations milti hain?",
      a: "Haan! Har missing ya weak header ke liye plain-language explanation aur copy-paste ready web server config (Nginx/Apache/Caddy) suggestion milti hai.",
    },
    {
      q: "Kya mera header data kisi server par jata hai?",
      a: "Nahi, parsing aur security grading 100% aapke browser ke andar client-side JavaScript se hoti hai. Zero upload.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-23",
};

export default headerAnalyzerTool;
