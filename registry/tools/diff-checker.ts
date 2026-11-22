import { Tool } from "../types";

export const diffCheckerTool: Tool = {
  id: "diff-checker",
  slug: "/dev/diff-checker",
  category: "dev",
  name: "Text & Code Diff Checker",
  tagline: "Do text ya code files ka difference dhundo side-by-side",
  icon: "code",
  keywords: [
    "diff checker",
    "text diff",
    "code diff",
    "compare text",
    "file diff",
    "difference dhundo",
    "git diff",
    "side by side diff",
    "unified diff",
  ],
  seo: {
    title: "Text & Code Diff Checker Online, Free | SourceLab",
    description:
      "Compare two text files or code snippets side-by-side or inline. Find additions, deletions, and character changes. 100% private, client-side.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["json-formatter", "case-converter"],
  chainTo: ["case-converter"],
  faq: [
    {
      q: "Kya mera code ya sensitive text server pe upload hota hai?",
      a: "Nahi! Sari comparison algorithm directly tumhare browser ke andar memory me run hoti hai. Internet disconnect karke bhi run kar sakte ho.",
    },
    {
      q: "Konsi diff comparison types available hain?",
      a: "Line-by-line diff, word-by-word diff aur exact character-level diff teeno supported hain.",
    },
    {
      q: "Diff results ko kaise view kar sakte hain?",
      a: "Tum side-by-side 2-column view ya unified inline git-style view choose kar sakte ho.",
    },
    {
      q: "Diff patch ko copy ya download kar sakte hain?",
      a: "Haan, tum standard Unified Diff (.patch ya .diff) format me pura output copy ya download kar sakte ho.",
    },
  ],
  popular: 86,
  status: "live",
  addedOn: "2026-11-22",
};

export default diffCheckerTool;
