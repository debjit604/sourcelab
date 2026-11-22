import { Tool } from "../types";

export const emiCalculatorTool: Tool = {
  id: "emi-calculator",
  slug: "/calc/emi-calculator",
  category: "calc",
  name: "EMI Calculator",
  tagline: "Home, car aur personal loan ki monthly EMI aur interest calculate karo",
  icon: "calculator",
  keywords: [
    "emi calculator",
    "loan emi",
    "home loan",
    "car loan",
    "interest calculator",
    "hisaab",
    "kist calculator",
    "emi nikaalo",
    "monthly emi",
  ],
  seo: {
    title: "EMI Calculator Online - Home, Car & Personal Loan EMI | SourceLab",
    description:
      "Calculate monthly loan EMI, total interest payable, and amortization schedule in your browser. 100% private financial planning with zero ads.",
  },
  inputs: ["none"],
  outputs: ["stats", "table"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["word-counter", "json-formatter"],
  chainTo: ["json-formatter"],
  faq: [
    {
      q: "EMI kaise calculate hoti hai?",
      a: "Standard formula use hota hai: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], jahan P = Principal Amount, R = Monthly Rate, aur N = Total Months.",
    },
    {
      q: "Kya financial data ya loan details server pe upload hote hain?",
      a: "Nahi, bilkul nahi! Sara hisaab-kitaab tumhare browser me local execution se hota hai bina kisi server request ya tracking ke.",
    },
    {
      q: "Kya yearly amortization schedule dekh sakte hain?",
      a: "Haan, tool me har saal ka principal paid, interest paid aur bacha hua loan balance clearly breakdown hota hai.",
    },
    {
      q: "Different loan types ke rates alag hote hain?",
      a: "Haan, Home loan (usually 8-10%), Car loan (8.5-11%) aur Personal loan (10-18%) me interest rates alag hote hain jinhe tum slider se adjust kar sakte ho.",
    },
  ],
  popular: 95,
  status: "live",
  addedOn: "2026-11-22",
};

export default emiCalculatorTool;
