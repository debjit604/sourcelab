import { Tool } from "../types";

export const typingTestTool: Tool = {
  id: "typing-test",
  slug: "/text/typing-test",
  category: "text",
  name: "Typing Speed Test",
  tagline: "Custom text paste karo aur accurate WPM aur accuracy test karo",
  icon: "keyboard",
  keywords: [
    "typing test",
    "wpm test",
    "typing speed",
    "wpm speed test",
    "hindi typing test",
    "bengali typing test",
    "typing practice",
    "speed typing",
  ],
  seo: {
    title: "Typing Speed Test Online - Free WPM & Accuracy Test | SourceLab",
    description: "Test typing speed in WPM with your own custom text. Supports English, Hindi, and Bengali with grapheme accuracy. Zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  faq: [
    {
      q: "Kya mera practice text kisi server pe jata hai?",
      a: "Nahi, typing test ka text aur calculations 100% tumhare browser me local execute hoti hain.",
    },
    {
      q: "WPM kaise calculate hota hai?",
      a: "Standard formula: Gross WPM = (typed characters / 5) / minutes. Net WPM = Gross WPM - (errors / minutes).",
    },
    {
      q: "Kya Hindi aur Bengali typing accurately evaluate hoti hai?",
      a: "Haan, browser ke Intl.Segmenter se conjuncts aur matras ko individual graphemes ki tarah accurate count kiya jata hai.",
    },
    {
      q: "Kya ye sarkari exam ka official score hai?",
      a: "Nahi, ye practice tool hai. SSC, CPCT, Court ya State exam board ke typing evaluation rules alag ho sakte hain.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-23",
};

export default typingTestTool;
