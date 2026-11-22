import { Tool } from "../types";

export const randomPickerTool: Tool = {
  id: "random-picker",
  slug: "/util/random-picker",
  category: "util",
  name: "Random Picker & Shuffler",
  tagline: "List se winner chuno, names shuffle karo, dice roll ya coin flip karo",
  icon: "dices",
  keywords: [
    "random picker",
    "pick random item",
    "random name picker",
    "list shuffler",
    "coin flipper",
    "dice roll",
    "lucky draw",
  ],
  seo: {
    title: "Random Picker, List Shuffler & Dice Roller | SourceLab",
    description:
      "Pick random items from lists, shuffle arrays with Fisher-Yates, roll dice, and flip coins using cryptographically secure random values with zero upload.",
  },
  inputs: ["text"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["uuid-generator", "password-generator", "text-sorter"],
  chainTo: ["text-sorter"],
  faq: [
    {
      q: "Randomness kitni unbiased aur fair hai?",
      a: "Tool browser ke built-in Web Crypto API (crypto.getRandomValues) use karta hai jo cryptographically secure aur 100% mathematically unbiased hai.",
    },
    {
      q: "Kaun kaun se modes support hote hain?",
      a: "Char modes: 'Pick Random Item/Winner', 'Shuffle List' (Fisher-Yates algorithm), 'Coin Flip' (Heads/Tails), aur 'Dice Roller' (D6, D20).",
    },
    {
      q: "Duplicate items allow hote hain ya bina replacement ke pick hota hai?",
      a: "'Without Replacement' toggle se ek item do baar select nahi hota, jo lucky draw contests ke liye perfect hai.",
    },
    {
      q: "Kya data privacy guaranteed hai?",
      a: "Haan! Contestants ki list ya giveaway names aapke browser me hi rehte hain, server par zero data upload hota hai.",
    },
  ],
  popular: 88,
  status: "live",
  addedOn: "2026-11-23",
};

export default randomPickerTool;
