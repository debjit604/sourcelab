import { Tool } from "../types";

export const bmiCalculatorTool: Tool = {
  id: "bmi-calculator",
  slug: "/calc/bmi-calculator",
  category: "calc",
  name: "BMI & Ideal Weight Calculator",
  tagline: "Body Mass Index (BMI), Asian WHO guidelines aur ideal weight jano",
  icon: "activity",
  keywords: [
    "bmi calculator",
    "body mass index",
    "health calculator",
    "ideal weight",
    "asian bmi",
    "overweight calculator",
    "underweight calculator",
  ],
  seo: {
    title: "BMI Calculator Online - Standard & Asian WHO | SourceLab",
    description:
      "Calculate your Body Mass Index (BMI), Asian WHO health category, healthy weight range, and prime index with zero upload.",
  },
  inputs: ["number"],
  outputs: ["stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["age-calculator", "percentage-calculator"],
  chainTo: ["age-calculator"],
  faq: [
    {
      q: "Asian WHO BMI cutoffs me kya farq hai?",
      a: "Asian population me body fat percentage aur diabetes risk kam BMI par bhi zyada hota hai, isliye Asian WHO normal cutoff 18.5–22.9 kg/m² rakhta hai aur 23+ ko overweight maanta hai.",
    },
    {
      q: "BMI ka formula kya hota hai?",
      a: "BMI = Weight (kg) / [Height (meters)]² hota hai. Metric aur Imperial (lbs, feet/inches) dono support hain.",
    },
    {
      q: "Ideal weight range kaise calculate hota hai?",
      a: "Aapki height ke anusaar 18.5 se 22.9 (Asian) ya 24.9 (International) BMI produce karne wala minimum aur maximum safe weight calculate kiya jata hai.",
    },
    {
      q: "Kya mera health data kahi send hota hai?",
      a: "Bilkul nahi! Aapka weight aur height aapke browser ke andar hi rehta hai, koi server call nahi hoti.",
    },
  ],
  popular: 91,
  status: "live",
  addedOn: "2026-11-23",
};

export default bmiCalculatorTool;
