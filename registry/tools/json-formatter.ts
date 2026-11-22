import { Tool } from "../types";

export const jsonFormatterTool: Tool = {
  id: "json-formatter",
  slug: "/dev/json-formatter",
  category: "dev",
  name: "JSON Formatter",
  tagline: "Beautify, minify aur error dhundo",
  icon: "braces",
  keywords: ["json", "format", "beautify", "minify", "validate", "jodo", "sahi karo"],
  seo: {
    title: "JSON Formatter & Validator Online, Free | SourceLab",
    description: "JSON beautify, minify aur validate karo. Error ki exact line dikhti hai. Zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64"],
  chainTo: ["base64"],
  faq: [
    { q: "Kya mera JSON upload hota hai?", a: "Nahi, sab browser me process hota hai." },
    { q: "Invalid JSON ka error kaise dikhta hai?", a: "Line aur column ke saath exact message." },
    { q: "Kitna bada JSON handle kar sakte ho?", a: "5MB tak aaram se." },
    { q: "Free hai?", a: "Haan, no signup, no watermark." },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-22",
};

export default jsonFormatterTool;
