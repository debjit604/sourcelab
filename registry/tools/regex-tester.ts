import { Tool } from "../types";

export const regexTesterTool: Tool = {
  id: "regex-tester",
  slug: "/dev/regex-tester",
  category: "dev",
  name: "Regular Expression Tester",
  tagline: "Regex pattern test karo, matches highlight aur capture groups dekho",
  icon: "code",
  keywords: [
    "regex tester",
    "regular expression",
    "regex pattern",
    "regex match",
    "capture groups",
    "regex cheat sheet",
    "regex validator",
  ],
  seo: {
    title: "Regex Tester Online Free - Real-Time Pattern Matching | SourceLab",
    description:
      "Test regular expressions with real-time match highlighting, capture groups, and common presets. 100% private in browser with zero server uploads.",
  },
  inputs: ["text"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["diff-checker", "json-formatter"],
  chainTo: ["diff-checker"],
  faq: [
    {
      q: "Regex tester kaise kaam karta hai?",
      a: "Ye aapke regex pattern aur flags (g, i, m, s, u) ko JavaScript ke native RegExp engine me run karke match hone wale text ko highlight aur capture groups me divide karta hai.",
    },
    {
      q: "Flags (g, i, m) ka kya matlab hai?",
      a: "'g' ka matlab Global (saare matches), 'i' ka matlab Case-insensitive, aur 'm' ka matlab Multiline hota hai.",
    },
    {
      q: "Kya common regex presets available hain?",
      a: "Haan! Email, URL, IPv4 address, phone numbers aur dates ke ready-to-use patterns available hain.",
    },
    {
      q: "Kya mera test data internet pe bheja jata hai?",
      a: "Nahi, saari testing 100% offline aapke browser me hi execute hoti hai.",
    },
  ],
  popular: 94,
  status: "live",
  addedOn: "2026-11-23",
};

export default regexTesterTool;
