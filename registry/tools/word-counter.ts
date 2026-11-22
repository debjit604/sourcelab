import { Tool } from "../types";

export const wordCounterTool: Tool = {
  id: "word-counter",
  slug: "/text/word-counter",
  category: "text",
  name: "Word Counter",
  tagline: "Words, characters, reading time aur keyword density count karo",
  icon: "type",
  keywords: [
    "word counter",
    "character count",
    "words",
    "letters",
    "reading time",
    "shabd",
    "word count",
    "paragraph counter",
    "char count",
  ],
  seo: {
    title: "Word Counter Online - Character & Reading Time Stats | SourceLab",
    description:
      "Count words, characters, sentences, paragraphs, reading time, and keyword density instantly in your browser. 100% private, zero uploads.",
  },
  inputs: ["text", "file"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["json-formatter", "base64"],
  chainTo: ["base64"],
  faq: [
    {
      q: "Kya mera private article ya document server pe save hota hai?",
      a: "Bilkul nahi! Text analysis 100% tumhare browser me local execution se hota hai. Koi bhi draft ya text server par upload nahi hota.",
    },
    {
      q: "Reading time aur Speaking time kaise calculate hota hai?",
      a: "Average reading speed standard 200 words per minute (wpm) aur speaking speed 130 wpm ke hisaab se calculate ki jaati hai.",
    },
    {
      q: "Spaces ke saath aur bina spaces ke characters alag alag dikhte hain?",
      a: "Haan, total characters (spaces ke sath) aur characters (bina spaces ke) dono alag counts me clearly display hote hain.",
    },
    {
      q: "Kya text file drop karke direct count check kar sakte hain?",
      a: "Haan, tum .txt, .md, .csv ya code files drop karke instantly detailed statistics dekh sakte ho.",
    },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-22",
};

export default wordCounterTool;
