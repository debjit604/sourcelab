import { Tool } from "../types";

export const magicDecoderTool: Tool = {
  id: "magic-decoder",
  slug: "/security/magic-decoder",
  category: "security",
  name: "Magic Multi-Layer Decoder",
  tagline: "Unknown encoded text ko automatically pehchano aur decode karo",
  icon: "sparkles",
  keywords: [
    "magic decoder",
    "cyberchef",
    "auto decode",
    "multi layer decode",
    "base64 hex binary",
    "ctf decoder",
    "payload decoder",
    "rot13 decode",
  ],
  seo: {
    title: "Magic Decoder Online - Multi-Layer CTF Decoder | SourceLab",
    description:
      "Automatically detect and recursively decode unknown encoded text, Base64, Hex, Binary, and ROT13. 100% private in browser.",
  },
  inputs: ["text"],
  outputs: ["text", "table"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "hash-identifier"],
  chainTo: ["base64"],
  faq: [
    {
      q: "Magic Decoder kaise kaam karta hai?",
      a: "CyberChef ke 'Magic' recipe ki tarah, ye aapke input text par Base64, Hex, URL, Binary, Decimal ASCII aur ROT13 decoders run karke readable text automatically dhundhta hai.",
    },
    {
      q: "Kya ye nested (ek ke andar ek) encoding decode kar sakta hai?",
      a: "Haan! Agar koi string pehle Hex aur fir Base64 me encode ki gayi hai, toh tool recursively dono layers ko unwrap karke step-by-step dikhata hai.",
    },
    {
      q: "Kaun-kaun se encoding formats test hote hain?",
      a: "Base64, Hexadecimal (0x / space / raw), URL encoding (%20), Binary 8-bit, Decimal ASCII codes, Reverse text aur ROT13 ciphers.",
    },
    {
      q: "Kya mera secret payload kisi server pe upload hota hai?",
      a: "Nahi, saari recursive decoding aapke local browser ki memory me hoti hai. Zero network requests, 100% safe for CTFs and private tokens.",
    },
  ],
  popular: 93,
  status: "live",
  addedOn: "2026-11-23",
};

export default magicDecoderTool;
