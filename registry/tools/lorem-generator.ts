import { Tool } from "../types";

export const loremGeneratorTool: Tool = {
  id: "lorem-generator",
  slug: "/text/lorem-generator",
  category: "text",
  name: "Lorem Ipsum Generator",
  tagline: "Dummy placeholder text generate karo — paragraphs, sentences ya words",
  icon: "type",
  keywords: [
    "lorem ipsum",
    "lorem generator",
    "dummy text",
    "placeholder text",
    "nakli text",
    "lorem ipsum banao",
    "filler text",
    "dummy paragraph",
  ],
  seo: {
    title: "Lorem Ipsum Generator: Paragraphs, Words & HTML | SourceLab",
    description:
      "Generate customizable dummy placeholder text by paragraphs, sentences, or words. Add HTML tags, start with standard Lorem Ipsum. 100% private, free.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["word-counter", "case-converter"],
  chainTo: ["word-counter"],
  faq: [
    {
      q: "Lorem Ipsum text kya hota hai aur kyun use hota hai?",
      a: "Ye ek standard placeholder dummy text hai jo designers aur developers layout, typography aur UI templates test karne ke liye use karte hain.",
    },
    {
      q: "Kya HTML tags ke sath generate ho sakta hai?",
      a: "Haan! Tum <p>, <li>, ya plain text choose kar sakte ho taaki directly web page ya code me paste kar sako.",
    },
    {
      q: "Kitna lamba text generate kar sakte hain?",
      a: "Tum 1 se lekar 50 paragraphs, sentences ya hazaron words instantly generate kar sakte ho.",
    },
    {
      q: "Kya iske liye internet connection zaroori hai?",
      a: "Nahi, sara dummy text generation pure offline algorithm se tumhare browser me local run hota hai.",
    },
  ],
  popular: 84,
  status: "live",
  addedOn: "2026-11-23",
};

export default loremGeneratorTool;
