import { Tool } from "../types";

export const unitConverterTool: Tool = {
  id: "unit-converter",
  slug: "/util/unit-converter",
  category: "util",
  name: "Universal Unit Converter",
  tagline: "Length, weight, temperature, area aur data bytes instantly convert karo",
  icon: "scale",
  keywords: [
    "unit converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "data storage converter",
    "meter to feet",
    "kg to lbs",
  ],
  seo: {
    title: "Universal Unit Converter Online, Free | SourceLab",
    description:
      "Convert units of length, weight, temperature, digital data bytes, and area online with high precision and zero upload.",
  },
  inputs: ["number"],
  outputs: ["number", "table"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["aspect-ratio", "percentage-calculator"],
  chainTo: ["percentage-calculator"],
  faq: [
    {
      q: "Kaun kaun si categories support hoti hain?",
      a: "Length (meter, feet, km, miles), Weight (kg, grams, pounds, ounces), Temperature (Celsius, Fahrenheit, Kelvin), Digital Data (Bytes, KB, MB, GB, TB), aur Area support hain.",
    },
    {
      q: "Digital data storage conversion kis base par hoti hai?",
      a: "Standard binary computing base 1024 (1 KB = 1024 Bytes) par conversion hoti hai jo RAM aur disk sizes me standard hai.",
    },
    {
      q: "Kya ek sath saare units ka comparison dikhta hai?",
      a: "Haan! Output panel me entered value ke corresponding category ke saare units ka instant table generate hota hai.",
    },
    {
      q: "Kya calculations server par run hoti hain?",
      a: "Nahi, pure conversion calculations aapke browser me client-side execute hoti hain with high floating-point precision.",
    },
  ],
  popular: 89,
  status: "live",
  addedOn: "2026-11-23",
};

export default unitConverterTool;
