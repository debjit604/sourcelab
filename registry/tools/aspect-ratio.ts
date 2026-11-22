import { Tool } from "../types";

export const aspectRatioTool: Tool = {
  id: "aspect-ratio",
  slug: "/image/aspect-ratio",
  category: "image",
  name: "Aspect Ratio Calculator",
  tagline: "Dimensions ka aspect ratio nikaalo aur proportional scaling karo",
  icon: "image",
  keywords: [
    "aspect ratio",
    "ratio calculator",
    "16:9",
    "4:3",
    "9:16",
    "dimension scaler",
    "screen ratio",
    "image ratio",
    "instagram size",
  ],
  seo: {
    title: "Aspect Ratio Calculator Online Free | SourceLab",
    description:
      "Calculate aspect ratios (16:9, 4:3, 9:16), scale dimensions proportionally, and check social media presets. 100% private in browser.",
  },
  inputs: ["none"],
  outputs: ["stats"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["image-resize", "svg-to-png"],
  chainTo: ["image-resize"],
  faq: [
    {
      q: "Aspect ratio kaise calculate hota hai?",
      a: "Width aur Height ke Greatest Common Divisor (GCD) se divide karke standard ratio jaise 16:9 ya 4:3 nikalta hai.",
    },
    {
      q: "Proportional dimension scaling kya hai?",
      a: "Agar aap aspect ratio lock karke nayi width likhte hain, toh height automatically calculate ho jaati hai taaki image stretch ya distort na ho.",
    },
    {
      q: "Kaunse common presets available hain?",
      a: "16:9 (YouTube/HD), 9:16 (Instagram Reels/Stories), 1:1 (Square), 4:3, 21:9 (Ultrawide) sabhi supported hain.",
    },
    {
      q: "Kya koi image ya measurement data upload hota hai?",
      a: "Nahi, saari calculations instant client-side math se browser me hoti hain.",
    },
  ],
  popular: 87,
  status: "live",
  addedOn: "2026-11-23",
};

export default aspectRatioTool;
