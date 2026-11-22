import { Tool } from "../types";

export const passwordGeneratorTool: Tool = {
  id: "password-generator",
  slug: "/security/password-generator",
  category: "security",
  name: "Password Generator",
  tagline: "Strong, secure aur unbreakable passwords generate karo",
  icon: "shield-check",
  keywords: [
    "password",
    "generator",
    "pass",
    "strong password",
    "random password",
    "passcode",
    "generate password",
    "pasward",
    "surakshit password",
  ],
  seo: {
    title: "Password Generator Online - Random Secure Passwords | SourceLab",
    description:
      "Generate strong, cryptographically secure passwords in your browser using Web Crypto API. Customizable length, symbols, and zero storage.",
  },
  inputs: ["none"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["hash-generator", "jwt-decoder"],
  chainTo: ["hash-generator"],
  faq: [
    {
      q: "Kya generated passwords server par save hote hain?",
      a: "Bilkul nahi! Passwords tumhare browser ke crypto.getRandomValues() se bante hain. Server par na koi log banta hai na save hota hai.",
    },
    {
      q: "crypto.getRandomValues() standard Math.random() se behtar kyu hai?",
      a: "Math.random() predictable pseudo-random hai. Web Crypto API cryptographically secure random values use karta hai jo brute-force proof hote hain.",
    },
    {
      q: "Strong password me kya kya hona chahiye?",
      a: "Kam se kam 16 characters, uppercase, lowercase, numbers aur symbols ka mix hona recommended hai.",
    },
    {
      q: "Kya main ek saath multiple passwords generate kar sakta hoon?",
      a: "Haan, tum ek click me 1 se lekar 20 passwords tak ek saath generate aur copy kar sakte ho.",
    },
  ],
  popular: 94,
  status: "live",
  addedOn: "2026-11-22",
};

export default passwordGeneratorTool;
