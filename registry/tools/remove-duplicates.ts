import { Tool } from "../types";

export const removeDuplicatesTool: Tool = {
  id: "remove-duplicates",
  slug: "/text/remove-duplicates",
  category: "text",
  name: "Remove Duplicate Lines",
  tagline: "Text list aur lines se duplicates hatao aur clean list banao",
  icon: "list-filter",
  keywords: [
    "remove duplicates",
    "duplicate lines remover",
    "dedupe list",
    "unique lines",
    "clean list",
    "remove duplicate text",
  ],
  seo: {
    title: "Remove Duplicate Lines Online, Free & Fast | SourceLab",
    description:
      "Remove duplicate lines and list items from text online. Case-sensitive toggle, whitespace trimming, sorting, and duplicate counts with zero upload.",
  },
  inputs: ["text"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["text-sorter", "word-counter", "diff-checker"],
  chainTo: ["text-sorter"],
  faq: [
    {
      q: "Duplicate lines kaise detect hoti hain?",
      a: "Har line ko individually check kiya jata hai. Pehli occurrence preserve rehti hai aur baad ki repeated copies remove ho jati hain.",
    },
    {
      q: "Kya uppercase aur lowercase me farq padta hai?",
      a: "By default case-insensitive mode rehta hai taaki 'Apple' aur 'apple' dono duplicate count ho, par tum Case Sensitive switch on kar sakte ho.",
    },
    {
      q: "Whitespace aur spaces ka kya hota hai?",
      a: "Trim Whitespace option on karne par har line ke aage aur peeche ke extra spaces automatically hat jate hain.",
    },
    {
      q: "Kitna bada text deduplicate kar sakte hain?",
      a: "Client-side processing hone ki wajah se 50,000+ lines ka data bhi bina browser freeze huye kuch hi milliseconds me process ho jata hai.",
    },
  ],
  popular: 86,
  status: "live",
  addedOn: "2026-11-23",
};

export default removeDuplicatesTool;
