import { Tool } from "../types";

export const gstCalculatorTool: Tool = {
  id: "gst-calculator",
  slug: "/india/gst-calculator",
  category: "india",
  name: "GST Calculator India",
  tagline: "GST inclusive aur exclusive calculation karo — CGST, SGST & IGST",
  icon: "landmark",
  keywords: [
    "gst calculator",
    "gst nikaalo",
    "gst inclusive",
    "gst exclusive",
    "cgst",
    "sgst",
    "igst",
    "india gst",
    "goods and services tax",
    "tax calculator",
  ],
  seo: {
    title: "GST Calculator India: Exclusive & Inclusive Tax | SourceLab",
    description:
      "Calculate Indian GST online with standard slabs (0%, 5%, 12%, 18%, 28%). Get instant CGST, SGST, IGST breakups and total gross price. 100% private.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["emi-calculator", "word-counter"],
  chainTo: ["emi-calculator"],
  faq: [
    {
      q: "GST Inclusive aur Exclusive me kya farak hota hai?",
      a: "Exclusive GST me base amount par tax alag se add hota hai (Base + GST = Total). Inclusive GST me pehle se shamil tax ko nikaal kar actual base price bataya jata hai.",
    },
    {
      q: "CGST aur SGST kab lagta hai aur IGST kab?",
      a: "Jab purchase aur sale same state me hoti hai toh equal CGST (Central) aur SGST (State) lagta hai. Jab transaction inter-state hoti hai toh poora tax IGST banta hai.",
    },
    {
      q: "Kya standard GST slabs 5%, 12%, 18%, 28% supported hain?",
      a: "Haan, sabhi standard GST tax slabs ke quick buttons diye gaye hain, aur tum apna custom rate percentage bhi enter kar sakte ho.",
    },
    {
      q: "Kya calculation karne ke liye internet chahiye?",
      a: "Nahi, saara hisaab-kitaab tumhare phone ya laptop ke browser me offline run hota hai. Koi data kahin transmit nahi hota.",
    },
  ],
  popular: 88,
  status: "live",
  addedOn: "2026-11-22",
};

export default gstCalculatorTool;
