import { Tool } from "../types";

export const imageResizeTool: Tool = {
  id: "image-resize",
  slug: "/image/image-resize",
  category: "image",
  name: "Image Resizer",
  tagline: "Photo ki dimensions (width x height) ya percentage badlo instantly",
  icon: "image",
  keywords: [
    "image resize",
    "resize photo",
    "photo resize karo",
    "dimensions badlo",
    "scale image",
    "pixel resize",
    "aspect ratio resize",
    "image resizer",
  ],
  seo: {
    title: "Resize Images Online Free — Pixels & Percentage | SourceLab",
    description:
      "Resize JPG, PNG, and WebP images by exact pixel width x height or percentage. Lock aspect ratio, instant preview, 100% private in-browser tool.",
  },
  inputs: ["image"],
  outputs: ["image"],
  engine: "canvas",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["image-compress", "pdf-merge"],
  chainTo: ["image-compress"],
  faq: [
    {
      q: "Kya photo server pe upload hoti hai resize ke dauran?",
      a: "Nahi, sabhi resizing HTML5 Canvas API ke zariye tumhare browser ki local memory me perform hoti hai. Koi file internet pe nahi jati.",
    },
    {
      q: "Kya aspect ratio maintain rehta hai?",
      a: "Haan! By default aspect ratio lock rehta hai taaki photo stretch ya squeeze na ho. Chaaho toh lock unlock karke custom width/height de sakte ho.",
    },
    {
      q: "Percentage ke hisaab se resize kar sakte hain?",
      a: "Haan, tum 25%, 50%, 75% ya custom percentage choose karke photo ka size ek click me proportionally chota ya bada kar sakte ho.",
    },
    {
      q: "Konsi formats support hoti hain?",
      a: "JPG, JPEG, PNG, aur WebP formats supported hain.",
    },
  ],
  popular: 91,
  status: "live",
  addedOn: "2026-11-22",
};

export default imageResizeTool;
