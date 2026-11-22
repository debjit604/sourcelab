import { Tool } from "../types";

export const markdownPreviewTool: Tool = {
  id: "markdown-preview",
  slug: "/dev/markdown-preview",
  category: "dev",
  name: "Markdown Previewer",
  tagline: "Markdown likho aur real-time formatted HTML preview dekho",
  icon: "file-text",
  keywords: [
    "markdown",
    "markdown previewer",
    "md preview",
    "markdown to html",
    "gfm",
    "readme editor",
    "markdown editor",
    "live preview",
  ],
  seo: {
    title: "Markdown Previewer Online - Live HTML Preview | SourceLab",
    description:
      "Edit and preview Markdown in real-time with GitHub Flavored Markdown support, word stats, and HTML export. 100% private in browser.",
  },
  inputs: ["text"],
  outputs: ["text", "preview"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["diff-checker", "word-counter"],
  chainTo: ["word-counter"],
  faq: [
    {
      q: "Markdown preview kaise kaam karta hai?",
      a: "Ye aapke raw Markdown text ko standard GitHub-flavored Markdown rules ke anusar formatted HTML me parse karke live screen pe render karta hai.",
    },
    {
      q: "Kya mera draft text server pe upload hota hai?",
      a: "Nahi, sab kuch local browser me process hota hai. Aapka koi bhi personal note ya document internet pe nahi jata.",
    },
    {
      q: "Kya main formatted HTML ya markdown download kar sakta hoon?",
      a: "Haan! Aap processed HTML code copy kar sakte hain ya fir .md file download kar sakte hain.",
    },
    {
      q: "Kaunse Markdown syntax supported hain?",
      a: "Headings, bold, italic, code blocks, tables, task lists, blockquotes aur links fully supported hain.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-23",
};

export default markdownPreviewTool;
