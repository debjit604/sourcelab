import { Tool } from "../types";

export const aadhaarMaskerTool: Tool = {
  id: "aadhaar-masker",
  slug: "/india/aadhaar-masker",
  category: "india",
  name: "Masked Aadhaar Card Tool",
  tagline: "Aadhaar ke pehle 8 digits mask karo privacy aur UIDAI guidelines ke liye",
  icon: "landmark",
  keywords: [
    "aadhaar mask",
    "masked aadhaar",
    "aadhaar card privacy",
    "hide aadhaar digits",
    "uidai compliant",
    "aadhaar photo mask",
    "mask aadhaar number",
  ],
  seo: {
    title: "Mask Aadhaar Card Online Free - UIDAI Compliant | SourceLab",
    description:
      "Mask the first 8 digits of your Aadhaar card (XXXX XXXX 1234) on images or text. 100% private in browser with zero server uploads.",
  },
  inputs: ["image/png", "image/jpeg", "text"],
  outputs: ["image/png", "text"],
  engine: "canvas",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["gst-calculator", "image-compress"],
  chainTo: ["image-compress"],
  faq: [
    {
      q: "Masked Aadhaar kya hota hai aur kyun zaroori hai?",
      a: "UIDAI ke rules ke anusar, identity verification ke liye pura 12-digit Aadhaar number share karna unsafe hai. Pehle 8 digits mask karke sirf aakhiri 4 digits dikhana legal aur safe hota hai.",
    },
    {
      q: "Kya meri Aadhaar photo ya number server pe upload hota hai?",
      a: "Bilkul nahi! HTML5 Canvas technology ke zariye saari photo aur text masking 100% aapke device ke browser me hi hoti hai. Server par kuch bhi upload nahi hota.",
    },
    {
      q: "Kya main photo aur text dono mask kar sakta hoon?",
      a: "Haan, aap chahein toh direct 12-digit number mask karein ya fir Aadhaar card ki photo upload karke number ke upar black privacy strip draw karein.",
    },
    {
      q: "Kya masked image download ho sakti hai?",
      a: "Haan, aap masked image ko instantly original quality me PNG ya JPG format me download kar sakte hain.",
    },
  ],
  popular: 96,
  status: "live",
  addedOn: "2026-11-23",
};

export default aadhaarMaskerTool;
