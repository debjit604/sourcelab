import { Tool } from "../types";

export const urlEncoderTool: Tool = {
  id: "url-encoder",
  slug: "/dev/url-encoder",
  category: "dev",
  name: "URL Encoder / Decoder",
  tagline: "URL aur query parameters encode ya decode karo",
  icon: "link-2",
  keywords: [
    "url",
    "encode",
    "decode",
    "uri",
    "percent-encoding",
    "link",
    "badlo",
    "sahi karo",
  ],
  seo: {
    title: "URL Encoder & Decoder Online, Free | SourceLab",
    description:
      "URLs aur URI parameters ko percent-encode ya decode karo. 100% private, client-side execution, zero server uploads.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "json-formatter"],
  chainTo: ["base64"],
  faq: [
    {
      q: "Kya URL encode karte waqt data server pe jata hai?",
      a: "Nahi, encoding 100% tumhare browser me standard encodeURIComponent se hoti hai.",
    },
    {
      q: "encodeURI aur encodeURIComponent me kya farak hai?",
      a: "encodeURI pure URL ke liye hota hai aur reserved characters ko preserve karta hai. encodeURIComponent query param values ke liye hota hai.",
    },
    {
      q: "Special characters aur emojis handle karta hai?",
      a: "Haan, UTF-8 compliant hai, sabhi emojis aur international characters safely percent-encode hote hain.",
    },
    {
      q: "Free hai ya koi limit hai?",
      a: "Bilkul free hai bina kisi character limit ya signup ke.",
    },
  ],
  popular: 80,
  status: "live",
  addedOn: "2026-11-22",
};

export default urlEncoderTool;
