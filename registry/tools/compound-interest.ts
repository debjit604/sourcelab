import { Tool } from "../types";

export const compoundInterestTool: Tool = {
  id: "compound-interest",
  slug: "/calc/compound-interest",
  category: "calc",
  name: "Compound Interest Calculator",
  tagline: "Investment ka compound interest aur yearly wealth growth calculate karo",
  icon: "trending-up",
  keywords: [
    "compound interest",
    "ci calculator",
    "compound interest formula",
    "investment growth",
    "fixed deposit interest",
    "interest calculator",
  ],
  seo: {
    title: "Compound Interest Calculator Online | SourceLab",
    description:
      "Calculate compound interest with annual, semi-annual, quarterly, or monthly compounding. Detailed growth table and wealth breakdown with zero upload.",
  },
  inputs: ["number"],
  outputs: ["stats", "table"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["sip-calculator", "emi-calculator", "percentage-calculator"],
  chainTo: ["sip-calculator"],
  faq: [
    {
      q: "Compound interest kaise calculate hota hai?",
      a: "Formula A = P(1 + r/n)^(nt) use hota hai, jahan P principal hai, r annual interest rate, n compounding frequency, aur t time in years hai.",
    },
    {
      q: "Compounding frequency me kya options hain?",
      a: "Yearly (Annual), Half-Yearly (Semi-Annual), Quarterly (har 3 mahine me), aur Monthly compounding support hai.",
    },
    {
      q: "Year-by-year breakdown table milta hai?",
      a: "Haan! Har saal ka opening balance, us saal ka accrued interest aur closing balance ek structured table me generate hota hai.",
    },
    {
      q: "Kya mera financial data private rehta hai?",
      a: "100% private! Koi financial detail ya amounts kisi bhi remote server par store ya send nahi hoti.",
    },
  ],
  popular: 93,
  status: "live",
  addedOn: "2026-11-23",
};

export default compoundInterestTool;
