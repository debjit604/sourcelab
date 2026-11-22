import { Tool } from "../types";

export const fancyFontsTool: Tool = {
  id: "fancy-fonts",
  slug: "/text/fancy-fonts",
  category: "text",
  name: "Fancy Unicode Fonts Generator",
  tagline: "Social media bio aur gaming tags ke liye stylish Unicode fonts banao",
  icon: "type",
  keywords: [
    "fancy fonts",
    "unicode fonts",
    "cool text fonts",
    "insta bio fonts",
    "bold text generator",
    "script font",
    "aesthetic text",
  ],
  seo: {
    title: "Fancy Unicode Fonts & Text Styles Generator | SourceLab",
    description:
      "Generate stylish Unicode fancy fonts for Instagram, Twitter, and gaming tags. Bold, script, gothic, bubble, and monospace styles with zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["case-converter", "html-entity", "slug-generator"],
  chainTo: ["case-converter"],
  faq: [
    {
      q: "Ye fancy fonts har jagah display hote hain?",
      a: "Haan! Ye koi external font files nahi hain, balki standard Unicode mathematical symbols hain jo Instagram, Twitter, WhatsApp, Discord aur games me har jagah support hote hain.",
    },
    {
      q: "Kaun kaun se font styles available hain?",
      a: "Bold, Italic, Script/Cursive, Gothic/Fraktur, Double-struck, Monospace, Bubble/Circled, Squared aur Inverted text styles available hain.",
    },
    {
      q: "Copy karne par formatting kharab hoti hai?",
      a: "Nahi, kyunki ye plain Unicode text characters hain, paste karne par exactly wahi style render hota hai bina kisi CSS ke.",
    },
    {
      q: "Kya mera text safe rehta hai?",
      a: "Haan, character mapping 100% aapke browser memory me hoti hai. Server pe koi request nahi jati.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-23",
};

export default fancyFontsTool;
