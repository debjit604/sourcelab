import { Tool } from "../types";

export const imageCompressTool: Tool = {
  id: "image-compress",
  slug: "/image/image-compress",
  category: "image",
  name: "Image Compressor",
  tagline: "JPG, PNG aur WebP images bina quality khoye compress karo",
  icon: "image",
  keywords: [
    "image compress",
    "photo compress",
    "compress jpg",
    "reduce image size",
    "resize photo",
    "kb me badlo",
    "image chhota karo",
    "compress png",
  ],
  seo: {
    title: "Image Compressor Online - Reduce Image Size Free | SourceLab",
    description:
      "Compress JPG, PNG, and WebP images directly in your browser without quality loss. 100% private client-side processing with zero uploads.",
  },
  inputs: ["image"],
  outputs: ["image"],
  engine: "canvas",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "qr-code"],
  chainTo: ["base64"],
  faq: [
    {
      q: "Kya meri photos kisi server par upload hoti hain?",
      a: "Bilkul nahi! Compression 100% tumhare browser me local Canvas aur client-side processing se hoti hai. Photo tumhare device se bahar nahi jati.",
    },
    {
      q: "Max kitni badi image compress kar sakte hain?",
      a: "Browser memory ke hisaab se 25MB tak ki JPG, PNG aur WebP images safely aur fast compress hoti hain.",
    },
    {
      q: "Quality kitni kam hoti hai?",
      a: "Smart compression visual quality ko intact rakhte hue invisible metadata aur redundant bytes ko compress karta hai.",
    },
    {
      q: "Kya format bhi change ho jata hai?",
      a: "Original format maintain rehta hai ya phir tum maximum compression ke liye modern WebP format me bhi save kar sakte ho.",
    },
  ],
  popular: 98,
  status: "live",
  addedOn: "2026-11-22",
};

export default imageCompressTool;
