import { Tool } from "../types";

export const percentageCalculatorTool: Tool = {
  id: "percentage-calculator",
  slug: "/calc/percentage-calculator",
  category: "calc",
  name: "Percentage Calculator",
  tagline: "Percentage, discount, growth aur difference instantly calculate karo",
  icon: "percent",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage increase",
    "percentage decrease",
    "discount calculator",
    "what percent of",
  ],
  seo: {
    title: "Percentage Calculator Online, Fast & Free | SourceLab",
    description:
      "Calculate percentage of numbers, percentage change (increase/decrease), discount markups, and ratios online with zero upload.",
  },
  inputs: ["number"],
  outputs: ["number", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["gst-calculator", "emi-calculator", "sip-calculator"],
  chainTo: ["gst-calculator"],
  faq: [
    {
      q: "Kaun kaun se percentage modes support hote hain?",
      a: "Char popular modes: 'What is P% of X', 'X is what % of Y', '% Increase/Decrease', aur 'Shopping Discount & Final Price'.",
    },
    {
      q: "Negative percentage change ka kya matlab hai?",
      a: "Negative value percentage decrease ya loss darshata hai, jabki positive value growth ya increase darshata hai.",
    },
    {
      q: "Formula sath me display hota hai?",
      a: "Haan, calculation ke sath mathematical formula aur calculation steps bhi dikhte hain taaki clarity bani rahe.",
    },
    {
      q: "Kya calculations server par compute hoti hain?",
      a: "Nahi, 100% calculation aapke browser ke high-speed JavaScript engine me calculate hoti hai.",
    },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-23",
};

export default percentageCalculatorTool;
