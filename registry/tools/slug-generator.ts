import { Tool } from "../types";

export const slugGeneratorTool: Tool = {
  id: "slug-generator",
  slug: "/text/slug-generator",
  category: "text",
  name: "URL Slug Generator",
  tagline: "SEO-friendly clean URL slugs aur kebab-case generate karo",
  icon: "link",
  keywords: [
    "slug generator",
    "url slug",
    "kebab case",
    "seo slug",
    "permalink generator",
    "clean url",
    "text to slug",
  ],
  seo: {
    title: "URL Slug Generator Online, Free & Fast | SourceLab",
    description:
      "Generate SEO-friendly URL slugs from text online. Clean special characters, transliterate accents, and customize delimiters with zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["case-converter", "url-encoder", "html-entity"],
  chainTo: ["url-encoder"],
  faq: [
    {
      q: "URL slug kya hota hai?",
      a: "Slug URL ka wo part hota hai jo webpage ke content ko human-readable aur SEO-friendly format me describe karta hai, jaise /text/slug-generator.",
    },
    {
      q: "Special characters aur accents ka kya hota hai?",
      a: "Accents (jaise é, ü) ko unke basic English characters me transliterate kiya jata hai aur special characters ko clean hyphen se replace kiya jata hai.",
    },
    {
      q: "Stop words remove karne ka option hai?",
      a: "Haan, 'the, a, and, for' jaise extra words ko toggle karke URL ko concise aur search engines ke liye optimized bana sakte ho.",
    },
    {
      q: "Kya data server par store hota hai?",
      a: "Nahi, saara text processing tumhare browser me local JavaScript se hoti hai. Zero data transmission.",
    },
  ],
  popular: 84,
  status: "live",
  addedOn: "2026-11-23",
};

export default slugGeneratorTool;
