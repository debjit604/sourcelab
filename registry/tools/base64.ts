import { Tool } from "../types";

export const base64Tool: Tool = {
  id: "base64",
  slug: "/dev/base64",
  category: "dev",
  name: "Base64 Encoder / Decoder",
  tagline: "Text aur files ko Base64 me convert karo",
  icon: "binary",
  keywords: ["base64", "encode", "decode", "binary", "text", "badlo", "convert"],
  seo: {
    title: "Base64 Encode & Decode Online, Free | SourceLab",
    description: "Text aur files ko Base64 me encode aur decode karo. 100% client-side privacy, zero server uploads.",
  },
  inputs: ["text", "file"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["json-formatter"],
  chainTo: ["json-formatter"],
  faq: [
    { q: "Kya file server pe upload hoti hai?", a: "Nahi, encoding tumhare browser me FileReader se hoti hai." },
    { q: "Kitni badi file Base64 kar sakte hain?", a: "Browser memory ke hisaab se 20MB tak safely hoti hai." },
    { q: "Data URL format support karta hai?", a: "Haan, standard Base64 aur Data URL dono output milte hain." },
    { q: "Bina internet ke chalega?", a: "PWA install karne ke baad offline bhi chalta hai." },
  ],
  popular: 85,
  status: "live",
  addedOn: "2026-11-22",
};

export default base64Tool;
