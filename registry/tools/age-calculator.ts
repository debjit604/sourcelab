import { Tool } from "../types";

export const ageCalculatorTool: Tool = {
  id: "age-calculator",
  slug: "/calc/age-calculator",
  category: "calc",
  name: "Age Calculator",
  tagline: "Exact umar saal, mahine, din aur agle birthday ka countdown dekho",
  icon: "calculator",
  keywords: [
    "age calculator",
    "exact age",
    "umar calculator",
    "date of birth",
    "birthday countdown",
    "how old am i",
    "age in days",
    "janmdin",
  ],
  seo: {
    title: "Age Calculator Online - Exact Age, Months & Birthday Countdown",
    description:
      "Calculate your exact age in years, months, days, hours, and next birthday countdown. 100% private in browser with zero server uploads.",
  },
  inputs: ["date"],
  outputs: ["stats"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["sip-calculator", "timestamp-converter"],
  chainTo: ["timestamp-converter"],
  faq: [
    {
      q: "Age calculator exact age kaise calculate karta hai?",
      a: "Ye aapki Date of Birth aur aaj ki tareekh ke beech calendar leap years aur days per month ko dhyan me rakhkar exact years, months aur days nikalta hai.",
    },
    {
      q: "Kya agle janamdin (birthday) ka countdown milta hai?",
      a: "Haan! Ye batata hai ki aapke agle birthday aane me kitne din aur ghante bache hain aur wo kis din (Day of week) padega.",
    },
    {
      q: "Kya meri Date of Birth server par store hoti hai?",
      a: "Nahi, sabhi calculations aapke browser me locally hoti hain. Koi bhi data kisi server par nahi jata.",
    },
    {
      q: "Kya ye total hours aur seconds bhi calculate karta hai?",
      a: "Haan, aapne apni zindagi me ab tak kitne saal, mahine, hafte, din, ghante aur seconds jiye hain, sab details milti hain.",
    },
  ],
  popular: 95,
  status: "live",
  addedOn: "2026-11-23",
};

export default ageCalculatorTool;
