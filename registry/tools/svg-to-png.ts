import { Tool } from "../types";

export const svgToPngTool: Tool = {
  id: "svg-to-png",
  slug: "/image/svg-to-png",
  category: "image",
  name: "SVG to PNG Converter",
  tagline: "SVG vector graphics ko high-resolution PNG ya JPG me convert karo",
  icon: "image",
  keywords: [
    "svg to png",
    "svg converter",
    "svg to jpeg",
    "vector to raster",
    "high res png",
    "svg download",
    "transparent png",
  ],
  seo: {
    title: "SVG to PNG Converter Online Free - High Resolution | SourceLab",
    description:
      "Convert SVG files to high-resolution PNG or JPG with custom scaling (1x, 2x, 4x, 8x) and transparent background. 100% private in browser.",
  },
  inputs: ["image/svg+xml"],
  outputs: ["image/png", "image/jpeg"],
  engine: "canvas",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["image-resize", "image-compress"],
  chainTo: ["image-compress"],
  faq: [
    {
      q: "SVG ko PNG me convert karne ka kya fayda hai?",
      a: "PNG format har platform, app aur social media pe easily open hota hai, jabki SVG har jagah support nahi hota.",
    },
    {
      q: "Kya main high-resolution (4K ya 8x) export kar sakta hoon?",
      a: "Haan! Vector hone ke karan SVG bina quality loose kiye 2x, 4x ya 8x scale par crisp rasterize hota hai.",
    },
    {
      q: "Kya transparent background support hota hai?",
      a: "Haan, aap transparent background ya fir custom white/black background choose kar sakte hain.",
    },
    {
      q: "Kya mera graphic server pe upload hota hai?",
      a: "Nahi, HTML5 Canvas API ke zariye saari rendering aapke local device par hoti hai.",
    },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-23",
};

export default svgToPngTool;
