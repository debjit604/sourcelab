import { Tool } from "../types";

export const pdfMergeTool: Tool = {
  id: "pdf-merge",
  slug: "/pdf/pdf-merge",
  category: "pdf",
  name: "PDF Merge",
  tagline: "Multiple PDF files ko ek single PDF me jodo — zero upload",
  icon: "file-text",
  keywords: [
    "pdf merge",
    "merge pdf",
    "pdf combine",
    "combine pdfs",
    "pdf jodo",
    "pdf joiner",
    "multiple pdf to one",
    "private pdf merge",
  ],
  seo: {
    title: "Merge PDF Files Online Free — 100% Client-Side | SourceLab",
    description:
      "Combine multiple PDF documents into a single PDF in seconds. Drag and drop, reorder pages, 100% private in browser with zero server upload.",
  },
  inputs: ["pdf"],
  outputs: ["pdf"],
  engine: "pdf-lib",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["image-compress", "word-counter"],
  chainTo: ["image-compress"],
  faq: [
    {
      q: "Kya meri confidential PDF file server par upload hoti hai?",
      a: "Bilkul nahi! SourceLab me har PDF transformation directly tumhare browser ki RAM me pdf-lib engine se hoti hai. Ek single byte bhi server pe nahi jati.",
    },
    {
      q: "Kitni PDF files ek saath merge kar sakte hain?",
      a: "Tum 2 se lekar 50+ PDF files ek saath add karke single PDF document me combine kar sakte ho.",
    },
    {
      q: "Files ka order ya sequence change kar sakte hain?",
      a: "Haan, list me up aur down controls se files ka order aasani se rearrange kar sakte ho.",
    },
    {
      q: "Kya password-protected PDF files merge hoti hain?",
      a: "Abhi encrypted ya password-locked PDFs supported nahi hain; unka lock pehle hatana zaroori hai.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-22",
};

export default pdfMergeTool;
