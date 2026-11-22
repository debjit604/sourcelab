import { Tool } from "../types";

export const cvssCalculatorTool: Tool = {
  id: "cvss-calculator",
  slug: "/security/cvss-calculator",
  category: "security",
  name: "CVSS v3.1 Severity Calculator",
  tagline: "Security vulnerability ka CVSS 3.1 score aur vector string banao",
  icon: "shield-check",
  keywords: [
    "cvss calculator",
    "cvss 3.1",
    "vulnerability score",
    "vector string",
    "bug bounty severity",
    "cve score",
    "security severity",
  ],
  seo: {
    title: "CVSS v3.1 Calculator Online - Severity Score & Vector | SourceLab",
    description:
      "Calculate CVSS v3.1 base score, severity ratings (Low, Medium, High, Critical), and vector strings for bug bounty reports.",
  },
  inputs: ["text"],
  outputs: ["stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["hash-identifier", "password-strength"],
  chainTo: ["hash-identifier"],
  faq: [
    {
      q: "CVSS v3.1 kya hota hai?",
      a: "CVSS (Common Vulnerability Scoring System) FIRST aur NIST dwara banaya gaya international standard hai jo software security bugs ki severity 0.0 se 10.0 scale par measure karta hai.",
    },
    {
      q: "CVSS Vector String kya hota hai?",
      a: "Ye vulnerability ke metrics ka standard condensed representation hota hai (jaise CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H) jise CVE aur bug bounty platforms me submit kiya jata hai.",
    },
    {
      q: "Severity levels kaise divide hote hain?",
      a: "0.0: None, 0.1–3.9: Low, 4.0–6.9: Medium, 7.0–8.9: High, aur 9.0–10.0: Critical maana jata hai.",
    },
    {
      q: "Kya mera vulnerability data kisi server par record hota hai?",
      a: "Nahi! Calculation 100% official FIRST CVSS v3.1 mathematical formulas ke through aapke browser me hi execute hoti hai. Zero tracking.",
    },
  ],
  popular: 94,
  status: "live",
  addedOn: "2026-11-23",
};

export default cvssCalculatorTool;
