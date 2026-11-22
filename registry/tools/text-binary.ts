import { Tool } from "../types";

export const textBinaryTool: Tool = {
  id: "text-binary",
  slug: "/security/text-binary",
  category: "security",
  name: "Text to Binary Converter",
  tagline: "Text aur binary (0s & 1s) ke beech instantly convert aur format karo",
  icon: "binary",
  keywords: [
    "text to binary",
    "binary to text",
    "binary converter",
    "ascii to binary",
    "utf8 binary",
    "ctf binary",
    "binary decoder",
    "bits to text",
  ],
  seo: {
    title: "Text to Binary Converter & Decoder Online | SourceLab",
    description:
      "Convert text to binary and binary to text online. Supports UTF-8, custom delimiters, bit statistics, and byte prefixes with zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "magic-decoder", "xor-tool", "morse-code"],
  chainTo: ["magic-decoder"],
  faq: [
    {
      q: "Binary conversion kaise kaam karta hai?",
      a: "Har character ko uske UTF-8 byte code me encode karke 8-bit binary representation (0s aur 1s) me badla jata hai.",
    },
    {
      q: "Kya continuous binary string (bina space ke) decode hoti hai?",
      a: "Haan! Decoder continuous stream ko automatically 8-bit ke chunks me divide karke text restore karta hai.",
    },
    {
      q: "Hindi ya emojis binary me support hote hain?",
      a: "Haan, multi-byte UTF-8 encoding ke through Hindi akshar aur emojis accurately convert aur decode hote hain.",
    },
    {
      q: "Kya mera text kisi server par jata hai?",
      a: "Nahi, saari bit-level processing tumhare browser me hoti hai. Server pe ek bhi bit nahi jata.",
    },
  ],
  popular: 85,
  status: "live",
  addedOn: "2026-11-23",
};

export default textBinaryTool;
