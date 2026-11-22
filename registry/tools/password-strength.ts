import { Tool } from "../types";

export const passwordStrengthTool: Tool = {
  id: "password-strength",
  slug: "/security/password-strength",
  category: "security",
  name: "Password Strength Checker",
  tagline: "Password ki entropy aur crack time check karo bina leak ke",
  icon: "shield-check",
  keywords: [
    "password strength",
    "password checker",
    "entropy calculator",
    "crack time",
    "password security",
    "strong password",
    "shaktishali password",
    "password test",
  ],
  seo: {
    title: "Password Strength & Entropy Checker Online | SourceLab",
    description:
      "Check password strength, entropy in bits, and crack time estimates with zero server uploads. 100% private in your browser.",
  },
  inputs: ["text"],
  outputs: ["stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["password-generator", "hash-generator"],
  chainTo: ["password-generator"],
  faq: [
    {
      q: "Password strength kaise calculate hoti hai?",
      a: "Ye NIST guidelines aur Information Theory ke hisaab se character pool (lowercase, uppercase, numbers, symbols) aur length se total entropy (bits) aur estimated crack time calculate karta hai.",
    },
    {
      q: "Kya mera password kisi server par upload hota hai?",
      a: "Bilkul nahi! Ye tool 100% client-side chalta hai. Aapka password aapke device ke browser se bahar kabhi nahi jata.",
    },
    {
      q: "Entropy kya hoti hai?",
      a: "Entropy ye batati hai ki password kitna unpredictable hai. 60+ bits ka password strong maana jata hai aur 80+ bits brute-force immune hota hai.",
    },
    {
      q: "Crack time ka kya matlab hai?",
      a: "Ek modern GPU cluster (100 billion guesses/sec) ko aapka password todne me kitna samay lagega, ye uska mathematical estimate dikhata hai.",
    },
  ],
  popular: 94,
  status: "live",
  addedOn: "2026-11-23",
};

export default passwordStrengthTool;
