import { Tool } from "../types";

export const caseConverterTool: Tool = {
  id: "case-converter",
  slug: "/text/case-converter",
  category: "text",
  name: "Case Converter",
  tagline: "UPPER, lower, Title, camelCase aur snake_case me text convert karo",
  icon: "type",
  keywords: [
    "case converter",
    "text case",
    "uppercase",
    "lowercase",
    "title case",
    "camelcase",
    "snake case",
    "kebab case",
    "bada akshar",
    "chota akshar",
    "capitalizer",
    "sentence case",
  ],
  seo: {
    title: "Case Converter: Upper, Lower, Title & Camel Case | SourceLab",
    description:
      "Convert text case instantly to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case. 100% private, client-side, zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["word-counter", "url-encoder"],
  chainTo: ["word-counter"],
  faq: [
    {
      q: "Kya mera text kisi server par jata hai?",
      a: "Nahi, sab kuch tumhare browser me pure JavaScript se convert hota hai. Internet band karke bhi use kar sakte ho.",
    },
    {
      q: "Konsi-konsi case conversions available hain?",
      a: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE aur Alternating Case.",
    },
    {
      q: "Kitna bada text convert kar sakte hain?",
      a: "Ye tool direct tumhare browser ki memory me chalta hai, isliye bade articles, essays ya code files bhi instant convert ho jati hain.",
    },
    {
      q: "Code identifiers ke liye camelCase ya snake_case kaam karega?",
      a: "Haan! Spaces, hyphens aur underscores ko automatically parse karke clean programming variables me badalta hai.",
    },
  ],
  popular: 85,
  status: "live",
  addedOn: "2026-11-22",
};

export default caseConverterTool;
