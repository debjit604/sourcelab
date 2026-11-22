import { Tool } from "../types";

export const findReplaceTool: Tool = {
  id: "find-replace",
  slug: "/text/find-replace",
  category: "text",
  name: "Find and Replace Text",
  tagline: "Plain text ya Regex patterns dhundo aur replace karo",
  icon: "replace",
  keywords: [
    "find and replace",
    "text replace",
    "regex replace",
    "search and replace",
    "batch replace",
    "find replace online",
  ],
  seo: {
    title: "Find and Replace Text & Regex Online, Free | SourceLab",
    description:
      "Find and replace text or regular expressions online. Real-time match counting, regex support, whole-word matching, and case toggles with zero upload.",
  },
  inputs: ["text"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["regex-tester", "diff-checker", "case-converter"],
  chainTo: ["diff-checker"],
  faq: [
    {
      q: "Regex (Regular Expression) support kaise kaam karta hai?",
      a: "Regex mode on karke aap complex patterns (jaise \\d+, [a-z]+) search aur replace kar sakte ho with capture group references like $1, $2.",
    },
    {
      q: "Whole Word matching ka kya fayda hai?",
      a: "Agar aap 'cat' search karte ho, to 'caterpillar' ya 'scat' replace nahi hoga, sirf standalone word 'cat' replace hoga.",
    },
    {
      q: "Kitne matches replace hue ye kaise pata chalega?",
      a: "Tool automatically real-time me total match count calculate karke result box ke upar highlight karta hai.",
    },
    {
      q: "Kya mera text safe hai?",
      a: "Bilkul! Replacement aapke browser ke andar local JavaScript se hoti hai, koi bhi data server pe nahi jata.",
    },
  ],
  popular: 87,
  status: "live",
  addedOn: "2026-11-23",
};

export default findReplaceTool;
