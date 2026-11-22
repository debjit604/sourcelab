import { Tool } from "../types";

export const colorPickerTool: Tool = {
  id: "color-picker",
  slug: "/dev/color-picker",
  category: "dev",
  name: "Color Converter & Palette",
  tagline: "HEX, RGB, HSL aur CMYK convert karo, contrast aur shades dekho",
  icon: "sparkles",
  keywords: [
    "color picker",
    "hex to rgb",
    "rgb to hex",
    "hsl converter",
    "cmyk",
    "color palette",
    "contrast checker",
    "wcag",
    "color shade",
  ],
  seo: {
    title: "Color Converter & Palette Generator Online | SourceLab",
    description:
      "Convert between HEX, RGB, HSL, and CMYK colors. Generate tints, shades, and check WCAG contrast ratios in your browser.",
  },
  inputs: ["text"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["json-formatter", "base64"],
  chainTo: ["json-formatter"],
  faq: [
    {
      q: "Kaunse color formats supported hain?",
      a: "HEX (#22D3EE), RGB (rgb(34, 211, 238)), HSL (hsl(188, 86%, 53%)) aur CMYK (86%, 11%, 0%, 7%) formats supported hain.",
    },
    {
      q: "WCAG contrast ratio kya hota hai?",
      a: "WCAG contrast ratio ye batata hai ki text aur background ke beech kitna visual difference hai, taaki readable aur accessible design banaya ja sake (min 4.5:1 for AA).",
    },
    {
      q: "Kya shades aur tints palette generate ho sakti hai?",
      a: "Haan, kisi bhi color ke 100 se lekar 900 tak ke tints aur shades automatically create hote hain.",
    },
    {
      q: "Kya koi color data server pe jata hai?",
      a: "Nahi, saara color math calculation local browser JavaScript me hota hai.",
    },
  ],
  popular: 91,
  status: "live",
  addedOn: "2026-11-23",
};

export default colorPickerTool;
