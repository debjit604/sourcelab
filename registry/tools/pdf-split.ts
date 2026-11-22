import { Tool } from "../types";

export const pdfSplitTool: Tool = {
  id: "pdf-split",
  slug: "/pdf/pdf-split",
  category: "pdf",
  name: "PDF Splitter",
  tagline: "PDF se pages alag karo ya specific page range extract karo",
  icon: "file-text",
  keywords: [
    "pdf split",
    "pdf splitter",
    "extract pdf pages",
    "split pdf online",
    "cut pdf",
    "pdf page separator",
    "divide pdf",
    "pdf pages alag karo",
  ],
  seo: {
    title: "Split PDF Online Free - Extract Pages from PDF | SourceLab",
    description:
      "Split PDF files or extract specific page ranges instantly in your browser. 100% private with zero file uploads to servers.",
  },
  inputs: ["application/pdf"],
  outputs: ["application/pdf"],
  engine: "pdf-lib",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["pdf-merge", "image-compress"],
  chainTo: ["pdf-merge"],
  faq: [
    {
      q: "PDF split kaise karte hain?",
      a: "Aap apni PDF file upload karein aur page range enter karein (jaise '1-3, 5') ya 'All Pages' select karein. Browser turant naya PDF generate kar dega.",
    },
    {
      q: "Kya meri sensitive PDF server pe upload hoti hai?",
      a: "Nahi! pdf-lib library ke zariye saari processing 100% aapke browser ki memory me hoti hai. File kabhi internet pe nahi jaati.",
    },
    {
      q: "Page range ka format kaisa hona chahiye?",
      a: "Aap commas aur hyphens use kar sakte hain, jaise '1-3, 5, 7-9' ya fir single page number jaise '4'.",
    },
    {
      q: "Kya password protected PDF split ho sakti hai?",
      a: "Security reasons se pehle PDF ka password remove hona chahiye.",
    },
  ],
  popular: 93,
  status: "live",
  addedOn: "2026-11-23",
};

export default pdfSplitTool;
