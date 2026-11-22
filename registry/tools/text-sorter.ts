import { Tool } from "../types";

export const textSorterTool: Tool = {
  id: "text-sorter",
  slug: "/text/text-sorter",
  category: "text",
  name: "Text & List Sorter",
  tagline: "Lines ko alphabetically, naturally sort karo aur duplicates hatao",
  icon: "type",
  keywords: [
    "text sorter",
    "sort lines",
    "alphabetize",
    "remove duplicates",
    "reverse text",
    "natural sort",
    "list sorter",
    "deduplicate",
  ],
  seo: {
    title: "Text & List Sorter Online - Sort Lines Free | SourceLab",
    description:
      "Sort lines of text alphabetically (A-Z, Z-A), numerically, or by length. Remove duplicates and empty lines instantly in your browser.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["case-converter", "word-counter"],
  chainTo: ["word-counter"],
  faq: [
    {
      q: "Kaun-kaun se sorting methods available hain?",
      a: "Alphabetical (A-Z aur Z-A), Natural sort (numbers in text), Line length (chhota se bada), Numerical sort aur Reverse order available hain.",
    },
    {
      q: "Duplicate lines kaise hatayein?",
      a: "Sirf 'Remove Duplicates' checkbox check karein, saari repeat hone wali lines instantly deduplicate ho jayengi.",
    },
    {
      q: "Kya mera text kisi server par save hota hai?",
      a: "Nahi, sabhi sorting aur deduplication aapke browser ki memory me locally execute hoti hai.",
    },
    {
      q: "Kitni lines tak sort kiya ja sakta hai?",
      a: "Hazaron lines (10,000+ items) bina kisi lag ke kuch hi milliseconds me sort ho jaati hain.",
    },
  ],
  popular: 89,
  status: "live",
  addedOn: "2026-11-23",
};

export default textSorterTool;
