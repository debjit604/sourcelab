import { Tool } from "../types";

export const numberToWordsTool: Tool = {
  id: "number-to-words",
  slug: "/calc/number-to-words",
  category: "calc",
  name: "Number to Words Converter",
  tagline: "Numbers ko Indian (Lakhs/Crores) aur Cheque words me instantly convert karo",
  icon: "file-text",
  keywords: [
    "number to words",
    "cheque amount words",
    "rupees in words",
    "indian number to words",
    "lakh crore converter",
    "amount in words",
  ],
  seo: {
    title: "Number to Words Converter - Indian & International | SourceLab",
    description:
      "Convert numbers and currency to words online in Indian format (Lakhs, Crores) and International format (Millions, Billions) with zero upload.",
  },
  inputs: ["number"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["gst-calculator", "emi-calculator", "sip-calculator"],
  chainTo: ["gst-calculator"],
  faq: [
    {
      q: "Indian numbering system (Lakhs, Crores) kaise kaam karta hai?",
      a: "Indian system me pehle 3 digits ke baad har 2 digits par comma lagta hai (Thousands, Lakhs, Crores) aur words me usi anusaar convert hota hai.",
    },
    {
      q: "Cheque aur banking format support hai?",
      a: "Haan, 'Rupees ... and ... Paise Only' format generate hota hai jise directly bank cheques aur official invoices me copy kar sakte ho.",
    },
    {
      q: "International format (Millions, Billions) bhi milta hai?",
      a: "Haan! Ek hi click me Indian system ke sath International system (Millions, Billions) ka representation bhi display hota hai.",
    },
    {
      q: "Decimal values aur paise kaise convert hote hain?",
      a: "Decimals ko accurate paise ya fractional words me convert kiya jata hai, jaise 50.75 -> Fifty Rupees and Seventy-Five Paise.",
    },
  ],
  popular: 91,
  status: "live",
  addedOn: "2026-11-23",
};

export default numberToWordsTool;
